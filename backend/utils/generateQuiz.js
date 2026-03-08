// import { GoogleGenerativeAI } from "@google/generative-ai";

// export const generateQuizWithGemini = async ({
//   topic,
//   difficulty,
//   questionCount,
// }) => {
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//   const prompt = `
//   Generate a quiz on the topic "${topic}".

//   **Instructions:**
//   - Difficulty Level: ${difficulty}
//   - Number of Questions: ${questionCount}
//   - Question Type: All questions must be Multiple Choice Questions (MCQ).
//   - Each question must have exactly 4 options.
//   - Provide the response as a valid JSON array of objects. Do not include any text, markdown, or explanations outside of the JSON array.

//   **JSON Format:**
//   [
//     {
//       "question": "The full text of the question goes here.",
//       "options": ["Option A", "Option B", "Option C", "Option D"],
//       "answer": "The text of the correct option. Must be one of the four options."
//     }
//   ]
//   `;

//   try {
//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     const jsonStart = text.indexOf("[");
//     const jsonEnd = text.lastIndexOf("]");
//     const jsonString = text.slice(jsonStart, jsonEnd + 1);

//     return JSON.parse(jsonString);
//   } catch (error) {
//     console.error("❌ Gemini Error:", error.message);
//     console.error("Gemini Response Text:", result.response.text());
//     throw new Error(
//       "Failed to parse quiz from Gemini response. The response was not valid JSON."
//     );
//   }
// };


import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.API_KEY,
});

export const generateQuizWithGemini = async ({
  topic,
  difficulty,
  questionCount,
}) => {
  const prompt = `
Generate a quiz on the topic "${topic}".

**Instructions:**
- Difficulty Level: ${difficulty}
- Number of Questions: ${questionCount}
- Question Type: All questions must be Multiple Choice Questions (MCQ).
- Each question must have exactly 4 options.
- Provide the response as a valid JSON array of objects. Do not include any text, markdown, or explanations outside of the JSON array.

**JSON Format:**
[
  {
    "question": "The full text of the question goes here.",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "The text of the correct option. Must be one of the four options."
  }
]
`;

  let responseText = "";

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    responseText = completion.choices[0]?.message?.content || "";

    const jsonStart = responseText.indexOf("[");
    const jsonEnd = responseText.lastIndexOf("]");

    const jsonString = responseText.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("❌ Groq Error:", error.message);
    console.error("Groq Response Text:", responseText);

    throw new Error(
      "Failed to parse quiz from Groq response. The response was not valid JSON.",
    );
  }
};
