
// Chat utility functions for API requests

export default async function handler(
    req: any,
    res: any
) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || '',
        'X-Title': process.env.NEXT_PUBLIC_APP_TITLE || 'Portfolio Chat'
      },
      body: req.body
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error('OpenRouter API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
