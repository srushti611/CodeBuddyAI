require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ChatGroq } = require('@langchain/groq');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize connection to the Groq Llama-3 AI Engine
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama3-8b-8192",
  temperature: 0.2 // Lower temperature means more accurate coding advice
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { code, mode } = req.body;

    if (!code || !mode) {
      return res.status(400).json({ error: "Missing code input or analysis mode!" });
    }

    // Setting up custom instructions depending on what button the beginner clicks
    let systemInstruction = "";
    if (mode === "explain") {
      systemInstruction = "You are an elite, super-friendly computer science teacher. Explain the following programming code block line-by-line. Use analogies that an 8-year-old child would understand. Break down complex words.";
    } else if (mode === "bug") {
      systemInstruction = "You are a professional software debugging engineer. Find any syntax errors, typos, or logic bugs in the following code block. Explain exactly why the bug causes a crash and give the clean corrected copy of the code.";
    }

    const fullPrompt = `${systemInstruction}\n\nHere is the user's code:\n\`\`\`\n${code}\n\`\`\``;

    const response = await model.invoke(fullPrompt);
    res.json({ result: response.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The AI debugger engine encountered an error parsing your code code." });
  }
});

app.listen(5000, () => console.log("🚀 CodeBuddy Engine listening live on http://localhost:5000"));