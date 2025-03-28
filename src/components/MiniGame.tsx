import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cookie, Zap, Coffee } from 'lucide-react';

const MiniGame = () => {
    const [score, setScore] = useState(0);
    const [autoClickers, setAutoClickers] = useState(0);
    const [powerUp, setPowerUp] = useState(false);
    const [floatingNumbers, setFloatingNumbers] = useState<{ id: number; value: number }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (autoClickers > 0) {
                setScore(prev => prev + autoClickers);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [autoClickers]);

    const handleClick = () => {
        const points = powerUp ? 5 : 1;
        setScore(prev => prev + points);
        setFloatingNumbers(prev => [
            ...prev,
            { id: Date.now(), value: points }
        ]);
    };

    const buyAutoClicker = () => {
        if (score >= 50) {
            setAutoClickers(prev => prev + 1);
            setScore(prev => prev - 50);
        }
    };

    const buyPowerUp = () => {
        if (score >= 200 && !powerUp) {
            setPowerUp(true);
            setScore(prev => prev - 200);
            setTimeout(() => setPowerUp(false), 10000);
        }
    };

    return (
        <motion.div
            className="fixed bottom-4 left-4 bg-background/90 backdrop-blur-md p-4 rounded-lg shadow-lg border"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
        >
            <div className="flex flex-col items-center gap-2 mb-4">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClick}
                    className="relative cursor-pointer"
                >
                    <Cookie className="w-16 h-16 text-amber-600" />
                    <AnimatePresence>
                        {floatingNumbers.map(num => (
                            <motion.span
                                key={num.id}
                                className="absolute text-green-500 font-bold"
                                initial={{ y: 0, opacity: 1 }}
                                animate={{ y: -50, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                onAnimationComplete={() =>
                                    setFloatingNumbers(prev => prev.filter(n => n.id !== num.id))
                                }
                            >
                                +{num.value}
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <motion.div
                    className="text-lg font-bold mb-2"
                    key={score}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    Cookies: {score}
                </motion.div>
            </div>

            <div className="flex flex-col gap-2">
                <Button
                    onClick={buyAutoClicker}
                    variant="outline"
                    className="flex justify-between items-center"
                >
                    <span>Buy Auto-Clicker (50)</span>
                    <div className="flex items-center gap-1">
                        {autoClickers} <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                </Button>

                <Button
                    onClick={buyPowerUp}
                    variant="outline"
                    disabled={powerUp}
                    className="flex justify-between items-center"
                >
                    <span>Power Up (200)</span>
                    <Coffee className="w-4 h-4 text-blue-500" />
                </Button>
            </div>
        </motion.div>
    );
};

export default MiniGame;