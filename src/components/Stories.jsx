import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stories = [
    {
        id: 1,
        text: "Kalian lagi laper?",
        emoji: "🤔",
        bgGradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #7f1d1d 100%)" // Red
    },
    {
        id: 2,
        text: "Mau makanan yang bisa dijadiin camilan atau dibarengin dengan nasi?",
        emoji: "🍚",
        bgGradient: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)" // Orange
    },
    {
        id: 3,
        text: "Mending makan ini aja deh!!??",
        emoji: "🥟✨",
        bgGradient: "linear-gradient(135deg, #eab308 0%, #ca8a04 50%, #a16207 100%)" // Yellow/Gold
    }
];

const STORY_DURATION = 3000; // 3 seconds per story

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

export default function Stories({ onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-advance timer with progress tracking
    useEffect(() => {
        if (isPaused) return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                clearInterval(interval);
                // Auto-advance to next story
                if (currentIndex < stories.length - 1) {
                    setDirection(1);
                    setCurrentIndex(prev => prev + 1);
                    setProgress(0);
                } else {
                    // Last story completed
                    onComplete();
                }
            }
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, [currentIndex, isPaused, onComplete]);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8
        })
    };

    const paginate = (newDirection) => {
        if (currentIndex + newDirection < 0) return;

        if (currentIndex + newDirection >= stories.length) {
            onComplete();
            return;
        }

        setDirection(newDirection);
        setCurrentIndex(currentIndex + newDirection);
        setProgress(0); // Reset progress when manually navigating
    };

    const handleTap = (e) => {
        const width = window.innerWidth;
        const clickX = e.clientX || e.touches?.[0]?.clientX || width / 2;

        if (clickX > width / 2) {
            paginate(1);
        } else {
            paginate(-1);
        }
    };

    // Get progress width for each indicator
    const getProgressWidth = (index) => {
        if (index < currentIndex) {
            return '100%'; // Previous stories are fully filled
        } else if (index === currentIndex) {
            return `${progress}%`; // Current story shows actual progress
        } else {
            return '0%'; // Future stories are empty
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#000',
                overflow: 'hidden'
            }}
            onClick={handleTap}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            {/* Progress bars */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                right: '1rem',
                zIndex: 20,
                display: 'flex',
                gap: '0.25rem'
            }}>
                {stories.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            flex: 1,
                            height: '4px',
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: '9999px',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                backgroundColor: '#fff',
                                borderRadius: '9999px',
                                width: getProgressWidth(index),
                                transition: index === currentIndex ? 'none' : 'width 0.3s ease'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Story content */}
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.3 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: stories[currentIndex].bgGradient,
                        cursor: 'pointer'
                    }}
                >
                    {/* Decorative elements */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        overflow: 'hidden',
                        pointerEvents: 'none'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '5rem',
                            left: '2.5rem',
                            width: '8rem',
                            height: '8rem',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '9999px',
                            filter: 'blur(48px)'
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '10rem',
                            right: '1.25rem',
                            width: '12rem',
                            height: '12rem',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '9999px',
                            filter: 'blur(48px)'
                        }} />
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        style={{
                            position: 'relative',
                            zIndex: 10,
                            textAlign: 'center',
                            padding: '0 2rem',
                            maxWidth: '32rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            style={{ fontSize: '4.5rem', marginBottom: '2rem' }}
                        >
                            {stories[currentIndex].emoji}
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            style={{
                                fontSize: 'clamp(1.875rem, 5vw, 3rem)',
                                fontWeight: 'bold',
                                color: '#fff',
                                lineHeight: 1.2,
                                textShadow: '0 4px 6px rgba(0,0,0,0.3)'
                            }}
                        >
                            {stories[currentIndex].text}
                        </motion.h1>
                    </motion.div>

                    {/* Tap hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        style={{
                            position: 'absolute',
                            bottom: '2.5rem',
                            left: 0,
                            right: 0,
                            textAlign: 'center',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '0.875rem'
                        }}
                    >
                        Tap atau swipe untuk lanjut →
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
