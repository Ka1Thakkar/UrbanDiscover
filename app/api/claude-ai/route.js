import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
    const anthropic = new Anthropic({
        apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
      });
        const msg = await anthropic.messages.create({
          model: "claude-3-opus-20240229",
          max_tokens: 1000,
          temperature: 0,
          system: "Give me the response in about 50 words. Try to add as much detail as possible about the topic asked.",
          messages: [
            {
              "role": "user",
              "content": [
                {
                  "type": "text",
                  "text": "Give me historical data about Jantar Mantar, Delhi."
                }
              ]
            }
          ]
        });
        console.log(msg);
        NextResponse.json(msg);
}