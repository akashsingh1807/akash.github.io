
export const handleChatRequest = async (
  messages: any[],
  options = {}
) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || ''}`,
        'HTTP-Referer': import.meta.env.VITE_SITE_URL || '',
        'X-Title': import.meta.env.VITE_APP_TITLE || 'Portfolio Chat'
      },
      body: JSON.stringify({
        messages,
        ...options
      })
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw new Error('Failed to process chat request');
  }
}

// Add any other chat related utility functions here
export const formatChatMessages = (messages: any[]) => {
  return messages.map(msg => ({
    role: msg.role || 'user',
    content: msg.content
  }));
};
