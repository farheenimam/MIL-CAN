const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Google Gemini API key not found");
    }

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from the response
    if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text || "I'm here to help with media literacy questions. Could you please rephrase your question?";
    }
    
    return "I'm here to help with media literacy questions. Could you please rephrase your question?";
  } catch (error) {
    console.error("Google Gemini API error:", error);
    throw error;
  }
}

export async function handleAiAssistant(message: string): Promise<string> {
  try {
    const systemMessage = `You are a helpful AI assistant for MIL-CAN, a Media & Information Literacy platform. 
    You help educators, content creators, and ambassadors with:
    - Content creation strategies for media literacy education
    - Fact-checking techniques and verification methods
    - Digital literacy best practices
    - Educational resource recommendations
    - Community engagement tips
    
    Keep responses concise, helpful, and focused on media literacy education.`;

    const fullPrompt = `${systemMessage}\n\nUser question: ${message}`;
    return await callGeminiAPI(fullPrompt);
  } catch (error) {
    console.error("AI Assistant error:", error);
    return "I'm experiencing some technical difficulties. Please try again later or contact support if the issue persists.";
  }
}

export async function generateContentSuggestions(category: string, userRole: string): Promise<string> {
  try {
    const prompt = `As a ${userRole} in media literacy education, suggest 3 specific content ideas for the "${category}" category. 
    Include brief descriptions and target audience for each suggestion.`;

    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error("Content suggestion error:", error);
    return "Unable to generate content suggestions. Please try again later.";
  }
}