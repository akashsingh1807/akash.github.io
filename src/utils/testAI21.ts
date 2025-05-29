// Test utility for AI21 Studio integration

export const testAI21Integration = async (): Promise<boolean> => {
    const ai21ApiKey = import.meta.env.VITE_AI21_API_KEY || process.env.AI21_API_KEY;
    
    if (!ai21ApiKey) {
        console.error('AI21 API key not found');
        return false;
    }
    
    try {
        const response = await fetch('https://api.ai21.com/studio/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ai21ApiKey}`
            },
            body: JSON.stringify({
                model: 'jamba-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant for Akash Singh portfolio website.'
                    },
                    {
                        role: 'user',
                        content: 'Hello, test message'
                    }
                ],
                max_tokens: 50,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            console.error('AI21 API test failed:', await response.text());
            return false;
        }

        const data = await response.json();
        console.log('AI21 API test successful:', data.choices[0]?.message?.content);
        return true;
    } catch (error) {
        console.error('Error testing AI21 API:', error);
        return false;
    }
};
