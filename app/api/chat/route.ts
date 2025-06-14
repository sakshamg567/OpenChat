import { smoothStream, streamText } from "ai";
import { google, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google"

export const POST = async (req: Request) => {
   const { messages } = await req.json()
   const result = streamText({
      model: google("gemini-2.5-flash-preview-05-20"),
      providerOptions: {
         google: {
            thinkingConfig: {
               thinkingBudget: 0
            }
         } satisfies GoogleGenerativeAIProviderOptions
      },
      messages,
      experimental_transform: smoothStream(),
      abortSignal: req.signal,
      onError: (error) => {
         console.log(error);
      }
   })

   return result.toDataStreamResponse({
      sendReasoning: true,
      getErrorMessage: (error) => {
         return (error as { message: string }).message;
      }
   });
}