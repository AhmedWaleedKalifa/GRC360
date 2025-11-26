const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const {
  BadRequestError,
  ServiceUnavailableError,
} = require("../errors/errors");

// AI Configuration
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const FREE_MODELS = [
  "openai/gpt-4o-mini",
  "anthropic/claude-3-haiku",
  "mistralai/mistral-7b-instruct",
  "meta-llama/llama-3.2-3b-instruct",
];

let SELECTED_MODEL = FREE_MODELS[0];
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// GRC360 System Prompt
const SYSTEM_PROMPT = `
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

const knowledgeFolder = path.join(__dirname, "..", "knowledge");
let knowledgeBase = "";

// Load knowledge files (.txt and .docx)
async function loadKnowledgeBase() {
  if (!fs.existsSync(knowledgeFolder)) {
    console.warn("Knowledge folder not found. No knowledge base will be used.");
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
    console.log("✅ Knowledge base loaded successfully");
  } catch (err) {
    console.error("❌ Failed to load knowledge base:", err);
  }
})();

// Fallback responses when AI is unavailable
function getFallbackResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  const fallbackResponses = {
    greeting: "Hello! I'm GRC360 Assistant. I'm currently experiencing technical difficulties with my AI service, but I'm still here to help with basic GRC questions.",
    risk: "I can help you with risk management concepts. Typically, risk management involves identification, assessment, and mitigation of risks. For detailed assistance, please try again when the AI service is available.",
    compliance: "Compliance management ensures adherence to regulations and standards like ISO 27001, NIST, or SOC2. The specific requirements depend on your industry and jurisdiction.",
    general: "I'm here to help with Governance, Risk, and Compliance topics. Currently, my advanced AI features are temporarily unavailable. Please try again in a few moments."
  };

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return fallbackResponses.greeting;
  } else if (lowerMessage.includes('risk')) {
    return fallbackResponses.risk;
  } else if (lowerMessage.includes('compliance')) {
    return fallbackResponses.compliance;
  } else {
    return fallbackResponses.general;
  }
}

// Handle API errors and model switching
async function handleAPIError(response) {
  const errorText = await response.text();
  console.error("❌ OpenRouter API error:", errorText);

  let errorMessage = `OpenRouter API error (${response.status})`;
  try {
    const errorData = JSON.parse(errorText);
    errorMessage = errorData.error?.message || errorMessage;
  } catch (e) {
    errorMessage = errorText || errorMessage;
  }

  // If one model fails, try the next one in the list
  if (response.status === 402 || errorMessage.includes("credits")) {
    const currentIndex = FREE_MODELS.indexOf(SELECTED_MODEL);
    if (currentIndex < FREE_MODELS.length - 1) {
      SELECTED_MODEL = FREE_MODELS[currentIndex + 1];
      console.log(`🔄 Switching to model: ${SELECTED_MODEL}`);
      throw new ServiceUnavailableError(`AI service temporarily unavailable. Please try again with model: ${SELECTED_MODEL}`);
    }
  }

  throw new ServiceUnavailableError(`AI service error: ${errorMessage}`);
}

// In your aiController.js - Update the chat function
async function chat(req, res, next) {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history) || history.length === 0) {
      // Send error as stream to maintain consistency
      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      res.write("Error: History is required and must be a non-empty array");
      res.end();
      return;
    }

    // Validate API key
    if (!OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is missing");
      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      res.write("Error: AI service is not configured properly. Please check API key.");
      res.end();
      return;
    }

    // Get the last user message for fallback
    const lastUserMessage = history.filter(msg => msg.role === 'user').pop()?.text || '';

    // Combine the system pre-prompt and knowledge base
    const combinedSystemPrompt = knowledgeBase 
      ? `${SYSTEM_PROMPT}\n\nAdditional Context:\n${knowledgeBase}`
      : SYSTEM_PROMPT;

    // Format messages for OpenRouter API
    const messages = [
      {
        role: "system",
        content: combinedSystemPrompt,
      },
      ...history.map((msg) => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.text,
      })),
    ];

    const requestBody = {
      model: SELECTED_MODEL,
      messages: messages,
      stream: true,
      max_tokens: 2048,
    };

    const apiResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
        "X-Title": "GRC360 Assistant",
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      // Handle API errors with streaming response
      const error = await handleAPIError(apiResponse);
      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      res.write(`Error: ${error.message}`);
      res.end();
      return;
    }

    // Set headers for streaming response
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-AI-Model": SELECTED_MODEL
    });

    const reader = apiResponse.body.getReader();
    const decoder = new TextDecoder();
    let fullResponseContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        try {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }

            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0]?.delta?.content) {
              const content = parsed.choices[0].delta.content;
              fullResponseContent += content;
              res.write(content);
            }
          }
        } catch (error) {
          console.error("Failed to parse stream chunk:", line, error);
        }
      }
    }

    res.end();

  } catch (error) {
    console.error("Error in chat endpoint:", error);
    
    // Provide fallback response for all errors
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    
    if (error.message.includes('Network error') || error.message.includes('fetch failed')) {
      const fallbackResponse = getFallbackResponse(lastUserMessage);
      res.write(fallbackResponse);
    } else {
      res.write(`I'm experiencing technical difficulties. Please try again later. Error: ${error.message}`);
    }
    res.end();
  }
}
async function getModelInfo(req, res, next) {
  try {
    const modelInfo = {
      currentModel: SELECTED_MODEL,
      availableModels: FREE_MODELS,
      apiKeyConfigured: !!OPENROUTER_API_KEY,
      knowledgeBaseLoaded: knowledgeBase.length > 0
    };

    res.status(200).json(modelInfo);
  } catch (err) {
    next(err);
  }
}

async function getKnowledgeStatus(req, res, next) {
  try {
    let fileCount = 0;
    if (fs.existsSync(knowledgeFolder)) {
      fileCount = fs.readdirSync(knowledgeFolder).filter(file => 
        ['.txt', '.docx'].includes(path.extname(file).toLowerCase())
      ).length;
    }
    
    const status = {
      hasKnowledgeBase: knowledgeBase.length > 0,
      fileCount,
      knowledgeBaseLength: knowledgeBase.length,
      knowledgeFolderExists: fs.existsSync(knowledgeFolder)
    };

    res.status(200).json(status);
  } catch (err) {
    next(err);
  }
}

async function reloadKnowledge(req, res, next) {
  try {
    knowledgeBase = await loadKnowledgeBase();
    
    const status = {
      hasKnowledgeBase: knowledgeBase.length > 0,
      knowledgeBaseLength: knowledgeBase.length,
      message: "Knowledge base reloaded successfully"
    };

    res.status(200).json(status);
  } catch (err) {
    console.error("Failed to reload knowledge base:", err);
    next(new ServiceUnavailableError("Failed to reload knowledge base"));
  }
}

async function testConnection(req, res, next) {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new ServiceUnavailableError("OpenRouter API key is not configured");
    }

    // Simple test request
    const testResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: SELECTED_MODEL,
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 5
      }),
    });

    const status = {
      connected: testResponse.ok,
      status: testResponse.status,
      statusText: testResponse.statusText,
      model: SELECTED_MODEL,
      apiKeyConfigured: !!OPENROUTER_API_KEY
    };

    if (!testResponse.ok) {
      throw new ServiceUnavailableError(`AI service test failed: ${testResponse.status} ${testResponse.statusText}`);
    }

    res.status(200).json(status);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  chat,
  getModelInfo,
  getKnowledgeStatus,
  reloadKnowledge,
  testConnection,
};