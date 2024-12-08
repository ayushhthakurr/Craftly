require("dotenv").config();
import express from "express";
import Groq from "groq-sdk";
import cors from "cors";
import { getSystemPrompt } from "./prompt";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";

const groq = new Groq();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
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

    if (answer === "react") {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (answer === "node") {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }
    res.status(403).json({ message: "You can't access this" });
  } catch (error) {
    console.error("Error in /template:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
