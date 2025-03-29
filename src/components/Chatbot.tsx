// components/Chatbot.tsx
import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ChatMessage = {
    content: string;
    role: 'user' | 'assistant';
};

const Chatbot = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { content: "Hello! I'm here to help. Ask me anything..", role: 'assistant' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sendSound = useRef<HTMLAudioElement>(new Audio('/sounds/ring.mp3'));
    const receiveSound = useRef<HTMLAudioElement>(new Audio('/sounds/ring.mp3'));

    const playSound = (type: 'send' | 'receive') => {
        const sound = type === 'send' ? sendSound.current : receiveSound.current;
        sound.currentTime = 0;
        sound.play().catch(error => console.error('Sound error:', error));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        try {
            setIsLoading(true);
            const userMessage = { content: input, role: 'user' as const };
            setMessages(prev => [...prev, userMessage]);
            playSound('send');
            setInput('');

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'meta-llama/llama-3-70b-instruct',
                    messages: [...messages, userMessage],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'API request failed');

            setMessages(prev => [...prev, {
                content: data.choices?.[0]?.message?.content || 'No response content',
                role: 'assistant'
            }]);
            playSound('receive');

        } catch (error) {
            setMessages(prev => [...prev, {
                content: `Error: ${(error as Error).message} | Please try again later.`,
                role: 'assistant'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[9999]">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full h-14 w-14 p-0 shadow-xl bg-black hover:bg-gray-900 border-2 border-white transition-all group relative overflow-hidden"
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white animate-spin-in" />
                ) : (
                    <div className="flex flex-col items-center relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute w-8 h-8 bg-orange-500 rounded-full blur-[12px] animate-pulse-fire" />
                        </div>

                        <svg
                            className="h-7 w-7 text-orange-400 animate-fire-spin"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 23c5.523 0 10-4.477 10-10 0-3.5-1.5-6.5-4-8.5-.5 2-2 3.5-3.5 4.5 1 1.5 2 3 2.5 4.5 0 3.5-3 6.5-5 6.5-1.5 0-4-1.5-4-4 0-2 1.5-3 2.5-3-1.5 0-3 1-3 2.5 0 1.5 1 2 1 2C7 19 8 23 12 23z" />
                        </svg>

                        <span className="text-xs text-orange-400 mt-0.5 font-medium animate-pulse-glow">
              AI
            </span>
                    </div>
                )}
            </Button>

            {isOpen && (
                <div className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col border-2 border-black animate-pop-in">
                    <div className="p-4 border-b-2 border-black">
                        <div className="flex items-center gap-3">
                            <div className="bg-black p-2 rounded-lg">
                                <svg
                                    className="h-6 w-6 text-white"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 23c5.523 0 10-4.477 10-10 0-3.5-1.5-6.5-4-8.5-.5 2-2 3.5-3.5 4.5 1 1.5 2 3 2.5 4.5 0 3.5-3 6.5-5 6.5-1.5 0-4-1.5-4-4 0-2 1.5-3 2.5-3-1.5 0-3 1-3 2.5 0 1.5 1 2 1 2C7 19 8 23 12 23z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-bold text-black">AI Assistant</h2>
                                <p className="text-xs text-gray-600">Powered by Llama 3</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`relative max-w-[85%] p-3 rounded-lg ${
                                    msg.role === 'user'
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black border-2 border-black'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="relative max-w-[85%] p-3 rounded-lg bg-white border-2 border-black">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 border-t-2 border-black">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 p-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black border-2 border-black placeholder-gray-500"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                className="p-3 bg-black hover:bg-gray-900 text-white rounded-lg transition-all border-2 border-black hover:border-gray-900"
                                disabled={isLoading}
                            >
                                <SendHorizontal className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;