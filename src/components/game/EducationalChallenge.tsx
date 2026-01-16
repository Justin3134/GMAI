import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import confetti from 'canvas-confetti';

export function EducationalChallenge() {
  const showChallenge = useGameStore((state) => state.showChallenge);
  const currentChallenge = useGameStore((state) => state.currentChallenge);
  const setShowChallenge = useGameStore((state) => state.setShowChallenge);
  const addXP = useGameStore((state) => state.addXP);
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!showChallenge) {
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    }
  }, [showChallenge]);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    if (currentChallenge && index === currentChallenge.correctAnswer) {
      addXP(50);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'],
      });
    }
  };

  const handleClose = () => {
    setShowChallenge(false);
  };

  if (!currentChallenge) return null;

  const isCorrect = selectedAnswer === currentChallenge.correctAnswer;

  const subjectEmojis = {
    math: '🔢',
    vocabulary: '📖',
    reading: '📚',
    science: '🔬',
  };

  return (
    <AnimatePresence>
      {showChallenge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="card-game w-full max-w-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-kid-2xl">
                  {subjectEmojis[currentChallenge.subject]}
                </span>
                <h2 className="text-kid-xl font-bold text-foreground capitalize">
                  {currentChallenge.subject} Challenge
                </h2>
              </div>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                +50 XP
              </span>
            </div>

            {/* Context */}
            {currentChallenge.context && (
              <p className="text-muted-foreground mb-4 italic">
                {currentChallenge.context}
              </p>
            )}

            {/* Question */}
            <div className="text-kid-lg font-semibold text-foreground mb-6 p-4 bg-muted rounded-2xl">
              {currentChallenge.question}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {currentChallenge.options.map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentChallenge.correctAnswer;
                
                let bgClass = 'bg-card hover:bg-muted';
                if (showResult) {
                  if (isCorrectAnswer) {
                    bgClass = 'bg-success/20 border-success';
                  } else if (isSelected && !isCorrectAnswer) {
                    bgClass = 'bg-danger/20 border-danger';
                  }
                } else if (isSelected) {
                  bgClass = 'bg-primary/20 border-primary';
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl border-2 border-border
                      text-left transition-all ${bgClass}
                      ${showResult ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    <span className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">
                      {letter}
                    </span>
                    <span className="text-kid text-foreground flex-1">{option}</span>
                    {showResult && isCorrectAnswer && (
                      <CheckCircle className="w-6 h-6 text-success" />
                    )}
                    {showResult && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-6 h-6 text-danger" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Result Message */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center p-4 rounded-xl mb-4 ${
                    isCorrect ? 'bg-success/20' : 'bg-danger/20'
                  }`}
                >
                  <p className="text-kid-xl font-bold">
                    {isCorrect ? '🎉 Correct! +50 XP' : '❌ Not quite! Try again next time'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between">
              {!showResult && currentChallenge.hint && (
                <Button
                  variant="outline"
                  onClick={() => setShowHint(!showHint)}
                  className="gap-2"
                >
                  <Lightbulb className="w-5 h-5" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
              )}
              
              {!showResult && !currentChallenge.hint && <div />}

              {showResult && (
                <Button
                  onClick={handleClose}
                  className="btn-primary-game ml-auto"
                >
                  Continue Adventure
                </Button>
              )}
            </div>

            {/* Hint Display */}
            <AnimatePresence>
              {showHint && currentChallenge.hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-gold/20 rounded-xl"
                >
                  <p className="text-kid text-foreground">
                    💡 {currentChallenge.hint}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
