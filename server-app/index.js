require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ChatGroq } = require('@langchain/groq');

const app = express();
app.use(cors());
app.use(express.json());

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama3-8b-8192",
  temperature: 0.3
});

// Mock In-Memory Vector Storage for quick local RAG tracking
let dynamicCourseDatabase = {};

// ENDPOINT 1: Generate a Personalized Course from a Prompt
app.post('/api/generate-course', async (req, res) => {
  try {
    const { skillLevel, programmingLanguage, customGoal } = req.body;

    const structuredPrompt = `
      You are an expert curriculum director. Create a personalized, 3-module programming course for a user.
      User Profile: Skill Level: ${skillLevel}, Language: ${programmingLanguage}, Goal: ${customGoal}.
      
      Respond ONLY with a valid JSON object matching this exact shape:
      {
        "courseTitle": "Title of the Course",
        "modules": [
          {
            "id": 1,
            "title": "Module 1 Title",
            "content": "Detailed, beginner-friendly explanation text...",
            "quizQuestion": "Write a snippet that accomplishes X...",
            "expectedAnswerKeyword": "keyword"
          },
          {
            "id": 2,
            "title": "Module 2 Title",
            "content": "Detailed explanation text...",
            "quizQuestion": "Write a snippet that accomplishes Y...",
            "expectedAnswerKeyword": "keyword"
          },
          {
            "id": 3,
            "title": "Module 3 Title",
            "content": "Detailed explanation text...",
            "quizQuestion": "Write a snippet that accomplishes Z...",
            "expectedAnswerKeyword": "keyword"
          }
        ]
      }
    `;

    const response = await model.invoke(structuredPrompt);
    
    // Clean up response strings if the LLM adds markdown triple backticks
    let rawText = response.content.trim();
    if (rawText.startsWith("```json")) rawText = rawText.replace("```json", "").replace("```", "");
    else if (rawText.startsWith("```")) rawText = rawText.replace("```", "").replace("```", "");

    const parsedCourse = JSON.parse(rawText.trim());

    // Local RAG Storage Ingestion: Store course modules inside database registry
    dynamicCourseDatabase["current_active_course"] = parsedCourse;

    res.json(parsedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to compile your personalized custom RAG course syllabus." });
  }
});

// ENDPOINT 2: Contextual Code Debugger & Verifier (RAG Retrieval)
app.post('/api/verify-code', async (req, res) => {
  try {
    const { codeInput, moduleId } = req.body;
    
    // RAG Retrieval Step: Retrieve the exact module source from our structural database memory
    const activeCourse = dynamicCourseDatabase["current_active_course"];
    if (!activeCourse) return res.status(404).json({ error: "No active syllabus found in memory chunks." });

    const specificModule = activeCourse.modules.find(m => m.id === parseInt(moduleId));
    const moduleContextText = specificModule ? specificModule.content : "";

    const ragDebugPrompt = `
      You are a compiler tutor. Review the user's code submissions against the context of this lecture.
      
      [LECTURE CONTEXT DATA]:
      ${moduleContextText}
      
      [USER INTERACTIVE QUIZ TASK]:
      ${specificModule ? specificModule.quizQuestion : "Verify general logic."}

      [USER SUBMITTED CODE]:
      \`\`\`
      ${codeInput}
      \`\`\`

      Analyze if the user's code meets the prompt goals and context rules. Explain bugs simply or congratulate them on success.
    `;

    const response = await model.invoke(ragDebugPrompt);
    res.json({ feedback: response.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The grading evaluation vector system encountered a parameter failure." });
  }
});

app.listen(5000, () => console.log("🚀 Major Project Core API running live on port 5000"));