// for title generation

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { generateText } from "ai";

export async function POST(req: Request) {
   const headersList = await headers();
   const apiKey = headersList.get('X-Google-API-Key');

   if (!apiKey) {
      return NextResponse.json(
         {
            error: "Google API key is required for chat title Generation"
         },
         { status: 400 }
      )
   }

   const google = createGoogleGenerativeAI({
      apiKey
   })

   const { prompt, isTitle, messageId, threadId } = await req.json();

   try {
      const { text: title } = await generateText({
         model: google('gemini-2.5-flash-preview-04-17'),
         system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - you should NOT answer the user's message, you should only generate a summary/title
      - do not use quotes or colons`,
         prompt,
      })
      return NextResponse.json({ title, isTitle, messageId, threadId });
   } catch (error) {
      console.error("failed to generate title: [error] : ", error);
      return NextResponse.json(
         { error: 'Failed to generate title' },
         { status: 500 }
      );
   }
}