import { useEffect, useRef, useState, useCallback } from 'react';

const CELL_SIZE = 15;
const WIDTH = 100;
const HEIGHT = 80;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const SnakeGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Position>({ x: 15, y: 15 });
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const generateFood = useCallback(() => ({
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT)
    }), []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': setDirection(prev => prev !== 'DOWN' ? 'UP' : prev); break;
                case 'ArrowDown': setDirection(prev => prev !== 'UP' ? 'DOWN' : prev); break;
                case 'ArrowLeft': setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev); break;
                case 'ArrowRight': setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev); break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
        if (gameOver) return;

        const gameLoop = setInterval(() => {
            setSnake(prev => {
                const newSnake = [...prev];
                const head = { ...newSnake[0] };

                switch (direction) {
                    case 'UP': head.y -= 1; break;
                    case 'DOWN': head.y += 1; break;
                    case 'LEFT': head.x -= 1; break;
                    case 'RIGHT': head.x += 1; break;
                }

                // Wall collision
                if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {
                    setGameOver(true);
                    return prev;
                }

                // Self collision
                if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    setGameOver(true);
                    return prev;
                }

                newSnake.unshift(head);

                // Food collision
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 1);
                    setFood(generateFood());
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, 100);

        return () => clearInterval(gameLoop);
    }, [direction, food, gameOver, generateFood]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = WIDTH * CELL_SIZE;
        canvas.height = HEIGHT * CELL_SIZE;

        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = 'rgba(100, 255, 100, 0.3)';
        snake.forEach(segment => {
            ctx.fillRect(
                segment.x * CELL_SIZE,
                segment.y * CELL_SIZE,
                CELL_SIZE - 1,
                CELL_SIZE - 1
            );
        });

        // Draw food
        ctx.fillStyle = 'rgba(255, 50, 50, 0.5)';
        ctx.fillRect(
            food.x * CELL_SIZE,
            food.y * CELL_SIZE,
            CELL_SIZE - 1,
            CELL_SIZE - 1
        );
    }, [snake, food]);

    return (
        <div className="fixed inset-0 -z-50 opacity-20 pointer-events-none">
            <canvas ref={canvasRef} />
            <div className="absolute top-4 right-4 text-muted-foreground text-sm">
                {gameOver ? 'Game Over! Refresh to restart' : `Score: ${score} | Use arrow keys`}
            </div>
        </div>
    );
};

export default SnakeGame;