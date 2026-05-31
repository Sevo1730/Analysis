import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "image/jpeg";

    const response = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
            {
              type: "text",
              text: `Analyze this food image and identify all visible ingredients and food items.
Provide a breakdown organized by category (e.g., Vegetables, Proteins, Fruits, Grains).
Use bullet points with • character. Be specific and thorough.
Format example:
Here's a breakdown of the items visible in the image:
• Vegetables:
  • Item one
• Proteins:
  • Item one`,
            },
          ],
        },
      ],
    });

    const summary = response.choices[0].message.content ?? "";
    return NextResponse.json({ summary });
  }

  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Analyze the following text and identify all food ingredients mentioned.
Provide a formatted response with:
1. A brief intro sentence about the dish
2. A bullet list using • character for each ingredient
3. A short closing remark

Text: "${text}"`,
      },
    ],
  });

  const summary = response.choices[0].message.content ?? "";
  return NextResponse.json({ summary });
}
