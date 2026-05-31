import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const { ingredients } = await req.json();

  if (!ingredients) {
    return NextResponse.json({ error: "Ingredients are required" }, { status: 400 });
  }

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `You are a professional chef. Create a detailed recipe using these ingredients: ${ingredients}

Format the response as:
🍽️ **Recipe Name**

**Description:** (1-2 sentences about the dish)

**Ingredients:**
• ingredient 1
• ingredient 2
...

**Instructions:**
1. Step one
2. Step two
...

**Tips:** (1-2 cooking tips)`,
      },
    ],
  });

  const recipe = response.choices[0].message.content ?? "";
  return NextResponse.json({ recipe });
}
