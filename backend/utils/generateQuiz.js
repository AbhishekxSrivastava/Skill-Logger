import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuizWithGemini = async ({
  topic,
  difficulty,
  questionCount,
}) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    const jsonString = text.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    console.error("Gemini Response Text:", result.response.text());
    throw new Error(
      "Failed to parse quiz from Gemini response. The response was not valid JSON."
    );
  }
};
