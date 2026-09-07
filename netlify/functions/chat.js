export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY is not set on the server.' }) }
  }
  const { messages = [], memory = [] } = JSON.parse(event.body || '{}')
  const memoryBlock = memory.length
    ? `Here is background information about the user that you should use when it is relevant:\n${memory.map((m) => `- ${m}`).join('\n')}`
    : ''
  const systemPrompt = [
    'You are Anzu, a personal assistant. Reply in Iraqi Arabic dialect by default, matching whatever language the user writes in. Keep replies concise and practical, suited for a small chat window and for being read aloud by text-to-speech.',
    memoryBlock,
  ].filter(Boolean).join('\n\n')
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      }),
    })
    if (!response.ok) {
      const text = await response.text()
      return { statusCode: response.status, body: JSON.stringify({ error: `Claude API error: ${text}` }) }
    }
    const data = await response.json()
    const reply = data.content?.map((block) => block.text || '').join('\n') || ''
    return { statusCode: 200, body: JSON.stringify({ reply }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
