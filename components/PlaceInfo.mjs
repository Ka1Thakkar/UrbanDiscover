import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: "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",
})

const location = "kolkata"
const msg = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Give a historical Decription of " + location + " in 5 lines." }],
})
console.log(msg.content[0].text)
