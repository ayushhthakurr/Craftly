require("dotenv").config();
import Groq from "groq-sdk";

const groq = new Groq();

async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    max_tokens:1024,
    temperature:0.5,
    messages: [
        {
          role: "user",
          content: "What is 2+2",
        },
      ],
    })
  console.log(completion.choices[0].message.content);
}

main();



