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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Adjust length based on selection
    let lengthPrompt = "Keep it short, around 1-2 sentences.";
    if (length === "Medium") lengthPrompt = "Make it medium length, around 3 sentences.";
    if (length === "Long") lengthPrompt = "Make it a detailed, longer review, around 4-5 sentences.";

    const prompt = `
      Write a Google review for Rakhee's NailStudio. 
      Rating: ${rating}/5 stars. 
      Services: ${services.join(", ")}. 
      Highlights: ${experiences.join(", ")}. 
      Tone: ${mood}. 
      Extra notes: ${notes || "None"}.
      
      Rules:
      1. ${lengthPrompt}
      2. Use simple, everyday conversational English that sounds authentic for a local Indian customer. Do not use complex or fancy vocabulary. Use relatable phrases (e.g., "very neat work", "superb", "really loved it", "highly recommended").
      3. IMPORTANT PROPRIETOR RULE: The studio does NOT have a staff. It is run by a solo artist. NEVER use the words "staff", "team", or "they". Instead, refer to "the artist", mention Rakhee by name, or use singular pronouns (e.g., "Rakhee was very polite", "she did an amazing job", or "very friendly artist").
      4. Include exactly 1 or 2 relevant emojis naturally (like 💅, ✨, ❤️, 💖) but do not overdo it.
      5. Output ONLY the review text. Do not wrap it in quotes.
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