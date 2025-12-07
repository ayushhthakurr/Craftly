require("dotenv").config();
import express from "express";
import Groq from "groq-sdk";
import cors from "cors";
import { getSystemPrompt } from "./prompt";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";

const groq = new Groq();
const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Local development
    'http://localhost:5173',  // Vite's default port
    'https://craftly-virid.vercel.app' // Production frontend URL
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware with options
app.use(cors(corsOptions));
app.use(express.json());

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "system",
          content: "Return either node or react based on what you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra.",
        },
      ],
    });

    const answer = response?.choices?.[0]?.message?.content?.trim().toLowerCase() || "";
    console.log('Model response:', answer);

    if (answer.includes("react")) {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (answer.includes("node")) {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }
    
    // Default to react if unclear
    console.log('Defaulting to react template');
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBasePrompt],
    });
  } catch (error) {
    console.error("Error in /template:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 8000,
      messages: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
        ...messages,
      ],
    });

    res.json({
      response: response.choices[0]?.message?.content || "No response content",
    });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT}`);
});
