const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const path = require("path");
const cors = require('cors');
const fs = require("fs");
const mammoth = require("mammoth"); // for reading .docx files
const userExtractor = require('./middleware/userExtractor');

const app = express();
require('dotenv').config();

app.use(express.json());
app.use(userExtractor);
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL2,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed for this origin: " + origin));
    }
  },
  credentials: true,
}));

// OpenRouter Configuration - Using FREE models
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Choose one of these FREE models:
const FREE_MODELS = [
  "openai/gpt-4o-mini",
  "anthropic/claude-3-haiku",
  "mistralai/mistral-7b-instruct",
  "meta-llama/llama-3.2-3b-instruct"
];

let SELECTED_MODEL = FREE_MODELS[0];
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// GRC360 System Prompt
const systemPreprompt = `
Your name is GRC360 and you are an expert in Governance, Risk, and Compliance. 
Your job is to assist users with understanding the GRC application, including:
- Risk management processes
- Compliance requirements and frameworks
- Governance structures and policies
- Incident management procedures
- Audit trails and logging
- Security configurations

Be helpful, professional, and provide accurate information about GRC concepts and the application functionality.

Keep responses concise and focused on GRC topics. If you don't know something, admit it rather than making up information.
`;

const knowledgeFolder = path.join(__dirname, "knowledge");
let knowledgeBase = "";

// Load knowledge files (.txt and .docx)
async function loadKnowledgeBase() {
  if (!fs.existsSync(knowledgeFolder)) {
    console.warn("❌ Knowledge folder not found. No knowledge base will be used.");
    return "";
  }
  const files = fs.readdirSync(knowledgeFolder);
  let allText = "";

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const fullPath = path.join(knowledgeFolder, file);

    if (ext === ".txt") {
      allText += fs.readFileSync(fullPath, "utf8") + "\n\n";
    } else if (ext === ".docx") {
      try {
        const buffer = fs.readFileSync(fullPath);
        const result = await mammoth.extractRawText({ buffer });
        allText += result.value + "\n\n";
      } catch (err) {
        console.error(`Error reading .docx file ${file}:`, err);
      }
    }
  }

  return allText.trim();
}

// Initialize knowledge base on startup
(async () => {
  try {
    knowledgeBase = await loadKnowledgeBase();
    console.log("✅ Knowledge base loaded successfully.");
  } catch (err) {
    console.error("❌ Failed to load knowledge base:", err);
  }
})();

// Import your existing GRC routes
const auditLogsRouter = require("./routes/auditLogsRouter");
const complianceItemsRouter = require("./routes/complianceItemsRouter");
const configurationsRouter = require("./routes/configurationsRouter");
const governanceItemsRouter = require("./routes/governanceItemsRouter");
const incidentsRouter = require("./routes/incidentsRouter");
const risksRouter = require("./routes/risksRouter");
const threatsRouter = require("./routes/threatsRouter");
const usersRouter = require("./routes/usersRouter");
const errorHandler = require("./middleware/errorHandler");

// Routes
app.get("/", (req, res) => res.send("GRC360 API Server is running!"));

// AI Chat Endpoint - Using FREE models via OpenRouter
app.post("/api/chat", async (req, res) => {
  const { history } = req.body;

  console.log('📨 Received chat request with history:', history?.length, 'messages');

  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: 'History is required and must be a non-empty array.' });
  }

  // Validate API key
  if (!OPENROUTER_API_KEY) {
    console.error('❌ OpenRouter API key is missing');
    return res.status(500).json({ 
      error: 'API configuration error: OpenRouter API key is not configured' 
    });
  }

  try {
    // Combine the system pre-prompt and knowledge base into a single system message
    const combinedSystemPrompt = `${systemPreprompt}\n\n${knowledgeBase}`;
    console.log('🤖 System prompt loaded, knowledge base length:', knowledgeBase.length);
    console.log('🚀 Using FREE model:', SELECTED_MODEL);

    // Format messages for OpenRouter API (OpenAI-compatible format)
    const messages = [
      {
        role: 'system',
        content: combinedSystemPrompt
      },
      ...history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text,
      }))
    ];

    console.log('📤 Sending request to OpenRouter API with model:', SELECTED_MODEL);
    
    const requestBody = {
      model: SELECTED_MODEL,
      messages: messages,
      stream: true,
      max_tokens: 2048, // Reduced for free models to avoid token limits
    };

    const apiResponse = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'GRC360 Assistant'
      },
      body: JSON.stringify(requestBody),
    });

    console.log('🔍 OpenRouter API response status:', apiResponse.status);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('❌ OpenRouter API error:', errorText);
      
      let errorMessage = `OpenRouter API error (${apiResponse.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      // If one model fails, try the next one in the list
      if (apiResponse.status === 402 || errorMessage.includes('credits')) {
        const currentIndex = FREE_MODELS.indexOf(SELECTED_MODEL);
        if (currentIndex < FREE_MODELS.length - 1) {
          console.log(`🔄 Switching from ${SELECTED_MODEL} to ${FREE_MODELS[currentIndex + 1]}`);
          SELECTED_MODEL = FREE_MODELS[currentIndex + 1];
          // You might want to implement retry logic here
        }
      }
      
      return res.status(apiResponse.status).json({ 
        error: errorMessage 
      });
    }

    // Set headers for streaming response
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    const reader = apiResponse.body.getReader();
    const decoder = new TextDecoder();
    let fullResponseContent = '';

    console.log('🔄 Starting to stream response from OpenRouter API...');

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('✅ Stream completed, total response length:', fullResponseContent.length);
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        try {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            if (data === '[DONE]') {
              break;
            }
            
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0]?.delta?.content) {
              const content = parsed.choices[0].delta.content;
              fullResponseContent += content;
              // Send each chunk as it comes (streaming)
              res.write(content);
            }
          }
        } catch (error) {
          console.error('❌ Failed to parse stream chunk:', line, error);
        }
      }
    }

    console.log('📝 Final response length:', fullResponseContent.length);
    res.end(); // End the streaming response

  } catch (error) {
    console.error('💥 Error in /api/chat endpoint:', error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

// Your existing GRC routes
app.use("/auditLogs", auditLogsRouter);
app.use("/complianceItems", complianceItemsRouter);
app.use("/configurations", configurationsRouter);
app.use("/governanceItems", governanceItemsRouter);
app.use("/incidents", incidentsRouter);
app.use("/risks", risksRouter);
app.use("/threats", threatsRouter);
app.use("/users", usersRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`✅ GRC360 Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Chat endpoint available at /api/chat`);
  console.log(`🔑 Using FREE model: ${SELECTED_MODEL}`);
  console.log(`🆓 Available free models: ${FREE_MODELS.join(', ')}`);
});