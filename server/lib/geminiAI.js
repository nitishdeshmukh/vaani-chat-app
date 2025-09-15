import axios from "axios";

export async function getGeminiAIResponse(userMessage) {
  try {
    const response = await axios.post(
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: userMessage,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the AI response from the correct path
    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";
    return aiText;
  } catch (error) {
    console.error(
      "Gemini AI API error:",
      error.response?.data || error.message
    );
    return "Sorry, I couldn't process your message right now.";
  }
}
