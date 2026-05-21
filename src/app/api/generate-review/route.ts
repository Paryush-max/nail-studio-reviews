export const runtime = "edge"; 

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { rating, services, experiences, notes } = await req.json();

    let prompt = "";

    // TIER 1: The Happy Customer (4-5 Stars)
    if (rating >= 4) {
      prompt = `Write a 2-sentence Google Maps review.
      Rating: ${rating}/5 stars. Services: ${services.join(", ")}. Loved: ${experiences.join(", ")}. Notes: ${notes || "None"}.
      
      STRICT RULES:
      1. CRITICAL SEO: You MUST explicitly include the exact words "Rakhee's NailStudio" and "Kalyan" in the text.
      2. Tone: Simple, everyday conversational Indian English (like a local texting on WhatsApp).
      3. Do NOT use fancy, high-level vocabulary. Use basic grammar.
      4. Use a tiny bit of natural Hinglish (e.g., "yaar", "mast", "superb") but do NOT overuse "ekdam". 
      5. Add 1-2 cute emojis.`;
    } 
    // TIER 2: The Neutral Customer (3 Stars)
    else if (rating === 3) {
      prompt = `Write a 2-sentence Google Maps review.
      Rating: ${rating}/5 stars. Services: ${services.join(", ")}. Notes: ${notes || "It was an average experience."}.
      
      STRICT RULES:
      1. CRITICAL SEO: You MUST explicitly include the exact words "Rakhee's NailStudio" and "Kalyan" in the text.
      2. Tone: Neutral, honest, and balanced. The service was just "okay".
      3. Use simple, basic everyday English. No fancy words.
      4. Add 1 mild emoji (like 👍, 🤔, or ✨).`;
    } 
    // TIER 3: The Unhappy Customer (1-2 Stars)
    else {
      prompt = `Write a 2-sentence Google Maps review.
      Rating: ${rating}/5 stars. Services: ${services.join(", ")}. Complaint: ${notes || "Disappointing experience."}.
      
      STRICT RULES:
      1. CRITICAL SEO: You MUST explicitly include the exact words "Rakhee's NailStudio" and "Kalyan" in the text.
      2. Tone: Serious and frustrated real customer.
      3. Use simple, basic English.
      4. NO emojis. NO Hinglish.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" }); 
    
    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
    
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to generate" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}