// Vercel serverless function: POST /api/chat
// Keeps the Anthropic API key on the server — it is never sent to the browser.
// Set ANTHROPIC_API_KEY in your Vercel project's Environment Variables.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set on the server.' })
    return
  }

  const { messages = [], memory = [] } = req.body || {}

  const memoryBlock = memory.length
    ? `Here is background information about the user that you should use when it is relevant:\n${memory
        .map((m) => `- ${m}`)
        .join('\n')}`
    : ''

  const systemPrompt = [
    'You are Anzu, a personal assistant. Reply in Iraqi Arabic dialect by default, matching whatever language the user writes in. Keep replies concise and practical, suited for a small chat window and for being read aloud by text-to-speech.',
    memoryBlock,
  ]
    .filter(Boolean)
    .join('\n\n')

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      res.status(response.status).json({ error: `Claude API error: ${text}` })
      return
    }

    const data = await response.json()
    const reply = data.content?.map((block) => block.text || '').join('\n') || ''
    res.status(200).json({ reply })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
