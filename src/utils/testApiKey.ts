export const testOpenRouterApiKey = async (): Promise<boolean> => {
    const apiKey = "testOpenRouterApiKey";
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://akashsingh.dev',
                'X-Title': 'Akash Singh Portfolio'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct',
                messages: [{ role: 'user', content: 'Hello' }]
            })
        });

        if (!response.ok) {
            console.error('API key test failed:', await response.text());
            return false;
        }

        console.log('API key test successful');
        return true;
    } catch (error) {
        console.error('Error testing API key:', error);
        return false;
    }
}; 