require("dotenv").config();
import Groq from "groq-sdk";
import { getSystemPrompt } from "./prompt";

const groq = new Groq();

async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    max_tokens:8000,
    //system: getSystemPrompt(),
    messages: [
        {
          role: "system",content: "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n\n",
        },{
          role:"user" , content: "Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n{{BASE_PROMPT}}\n\nHere is a files that exist on the file system but are not being shown to you:\n\n -.gitignore\n -package-lock.json\n -.craftly/prompt"
        },
        {
          role: 'user', content: "create a to do app"
        }
      ],
    })
  console.log(completion.choices[0].message.content);
}

main();



