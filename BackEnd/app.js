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

// Ollama Configuration
const OLLAMA_API_URL = 'http://localhost:11434/api/chat';
const MODEL_NAME = 'deepseek-r1:1.5b';

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

// AI Chat Endpoint - Now part of the main server (FIXED STREAMING)
// AI Chat Endpoint - Improved error handling
app.post("/api/chat", async (req, res) => {
  const { history } = req.body;

  console.log('📨 Received chat request with history:', history?.length, 'messages');

  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: 'History is required and must be a non-empty array.' });
  }

  try {
    // Combine the system pre-prompt and knowledge base into a single system message
    const combinedSystemPrompt = `${systemPreprompt}\n\n${knowledgeBase}`;
    console.log('🤖 System prompt loaded, knowledge base length:', knowledgeBase.length);

    // Add the combined system prompt as the first message
    const ollamaMessages = [{
      role: 'system',
      content: combinedSystemPrompt
    }].concat(history.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.text,
    })));

    console.log('📤 Sending request to Ollama with model:', MODEL_NAME);
    
    const ollamaRequestBody = {
      model: MODEL_NAME,
      messages: ollamaMessages,
      stream: true,
    };

    const ollamaResponse = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ollamaRequestBody),
    });

    console.log('🔍 Ollama response status:', ollamaResponse.status);

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error('❌ Ollama API error:', errorText);
      return res.status(ollamaResponse.status).json({ 
        error: `Ollama API error (${ollamaResponse.status}): ${errorText}` 
      });
    }

    // Set headers for streaming response
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    const reader = ollamaResponse.body.getReader();
    const decoder = new TextDecoder();
    let fullResponseContent = '';

    console.log('🔄 Starting to stream response from Ollama...');

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
          const parsed = JSON.parse(line);
          if (parsed.message && parsed.message.content) {
            fullResponseContent += parsed.message.content;
            // Send each chunk as it comes (streaming)
            res.write(parsed.message.content);
          }
        } catch (error) {
          console.error('❌ Failed to parse stream chunk:', line, error);
        }
      }
    }

    // Remove reasoning <think>...</think> blocks (multi-line safe)
    const filteredContent = fullResponseContent
      .replace(/<think>[\s\S]*?<\/think>/g, '') // remove everything inside <think>
      .trim();

    console.log('📝 Final filtered response length:', filteredContent.length);
    res.end(); // End the streaming response

  } catch (error) {
    console.error('💥 Error in /api/chat endpoint:', error);
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: `Could not connect to Ollama at ${OLLAMA_API_URL}. Make sure Ollama is running.` 
      });
    }
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
});