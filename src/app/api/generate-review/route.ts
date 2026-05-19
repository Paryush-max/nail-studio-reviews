import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Your GEMINI_API_KEY is missing or empty in .env.local" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { rating, services, experiences, mood, notes, length } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    // Adjust length based on selection
    let lengthPrompt = "Keep it short, around 1-2 sentences.";
    if (length === "Medium") lengthPrompt = "Make it medium length, around 3 sentences.";
    if (length === "Long") lengthPrompt = "Make it a detailed, longer review, around 4-5 sentences.";

    const prompt = `
      Write a Google Maps review for Rakhee's NailStudio.
      Rating: ${rating}/5 stars. 
      Services received: ${services.join(", ")}. 
      Highlights: ${experiences.join(", ")}. 
      Tone: ${mood}. 
      Extra notes: ${notes || "None"}.
      
      CRITICAL RULES:
      1. LENGTH: ${lengthPrompt}
      2. SEO OPTIMIZATION: You MUST mention the city "Kalyan" naturally to help with local search. You MUST mention "Rakhee" (the artist) by name. You MUST include the exact service they chose in the text.
      3. LANGUAGE & TONE: Write in extremely simple, everyday English. It must sound like a real, authentic local person from Mumbai/Kalyan casually typing on their phone. Do NOT use fancy vocabulary or overly formal words.
      4. HINGLISH TOUCH: Lightly sprinkle 1 or 2 common conversational Hinglish phrases (e.g., "ekdum perfect", "bohot nice", "mast", "superb", "paisa vasool", "best in Kalyan"). Do not overdo it—keep it subtle and natural.
      5. SOLO ARTIST RULE: The studio has NO staff. NEVER use words like "staff", "team", or "they". Use "Rakhee", "she", or "the artist".
      6. EMOJIS: Add 1 or 2 relevant emojis naturally (like 💅, ✨, ❤️).
      7. OUTPUT: Output ONLY the review text. Do not wrap it in quotes.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ review: text.trim() });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error Connection Failed" },
      { status: 500 }
    );
  }
}