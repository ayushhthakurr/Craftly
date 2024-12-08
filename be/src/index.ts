require("dotenv").config();
import Groq from "groq-sdk";
import { getSystemPrompt } from "./prompt";

const groq = new Groq();

async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    max_tokens:1024,
    messages: [
        {
          role: "system",
          content: "What is 2+2",
        },
      ],
    })
  console.log(completion.choices[0].message.content);
}

main();



