import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
    const anthropic = new Anthropic({
        apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
      });
      
      async function main() {
        const stream = anthropic.messages
        .stream({
            model: 'claude-3-opus-20240229',
            max_tokens: 1024,
            messages: [
                {
                role: 'user',
                content: `Give me historical data about Jantar Mantar, Delhi in about 50 words.`,
                },
            ],
            })
            .on('text', (text) => {
            console.log(text);
            });

        const message = await stream.finalMessage();
        console.log(message);
        return NextResponse.json({message})
      }
      
      main();
}