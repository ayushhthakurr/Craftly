"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const cors_1 = __importDefault(require("cors"));
const prompt_1 = require("./prompt");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const groq = new groq_sdk_1.default();
const app = (0, express_1.default)();
// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:3000', // Local development
        'http://localhost:5173', // Vite's default port
        'https://craftly-virid.vercel.app' // Production frontend URL
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};
// Apply CORS middleware with options
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const prompt = req.body.prompt;
    try {
        const response = yield groq.chat.completions.create({
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
        const answer = ((_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim().toLowerCase()) || "";
        console.log('Model response:', answer);
        if (answer.includes("react")) {
            res.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [react_1.basePrompt],
            });
            return;
        }
        if (answer.includes("node")) {
            res.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [node_1.basePrompt],
            });
            return;
        }
        // Default to react if unclear
        console.log('Defaulting to react template');
        res.json({
            prompts: [
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [react_1.basePrompt],
        });
    }
    catch (error) {
        console.error("Error in /template:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const messages = req.body.messages;
    try {
        const response = yield groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            max_tokens: 8000,
            messages: [
                {
                    role: "system",
                    content: (0, prompt_1.getSystemPrompt)(),
                },
                ...messages,
            ],
        });
        res.json({
            response: ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "No response content",
        });
    }
    catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`);
});
