import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing. Check your .env file and restart the server.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const facts = await request.json();

    const prompt = `
      You are a professional Grant Reporting Assistant for Mantra4Change.
      Your task is to write a concise, professional, 2-paragraph grant report narrative based STRICTLY on the facts provided below.
      
      RULES:
      1. DO NOT invent, hallucinate, or assume any numbers, dates, or facts.
      2. Clearly state the current Risk Status and Attendance Rate.
      3. Summarize the Financial Utilization.
      4. Explicitly reference any attached evidence/media by title to prove completion.
      
      FACTS:
      ${JSON.stringify(facts, null, 2)}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ generatedReport: text });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ 
      error: `AI Generation failed: ${error.message}` 
    }, { status: 500 });
  }
}