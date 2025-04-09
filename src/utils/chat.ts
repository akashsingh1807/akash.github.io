// Mock implementation for chat functionality
export const handleChatRequest = async (
  messages: any[],
  options = {}
) => {
  try {
    // Hardcoded API key
    const apiKey = "tesapikey";
    const siteUrl = window.location.origin;
    const appTitle = "Akash's Portfolio";
    
    console.log('Using hardcoded API key');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': appTitle
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages,
        ...options
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error details:', errorData);
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

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
