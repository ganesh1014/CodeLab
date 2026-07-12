const { GoogleGenerativeAI } = require("@google/generative-ai");

const solveDoubt = async (req, res) => {
  try {
    const { messages, title, description, testCases, startCode } = req.body;

    if (!messages || !title || !description) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: messages, title, description"
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        stopSequences: ["###"]
      }
    });

    
    const systemPrompt = `
You are an expert Data Structures and Algorithms (DSA) tutor.

CURRENT PROBLEM:
Title: ${title}
Description: ${description}
Examples: ${testCases || "N/A"}
Starter Code: ${startCode || "N/A"}

RULES:
- Only discuss this DSA problem
- Give hints, explanations, or solutions as requested
- Prefer teaching over dumping answers
- Use the same language as the user
    `.trim();

    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || m.text }]
      }))
    ];

    const result = await model.generateContent({ contents });
    const response = result.response.text();

    res.status(200).json({
      success: true,
      response
    });

  } catch (err) {
    console.error("Gemini API Error:", err.message);

    if (err.message?.includes("SAFETY")) {
      return res.status(403).json({
        success: false,
        error: "Your request was blocked by safety filters."
      });
    }

    if (err.status === 429) {
      return res.status(429).json({
        success: false,
        error: "AI quota exceeded. Please wait and try again."
      });
    }

    res.status(500).json({
      success: false,
      error: "AI service temporarily unavailable"
    });
  }
};

module.exports = solveDoubt;
