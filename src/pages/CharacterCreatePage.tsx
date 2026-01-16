import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/stores/gameStore';
import type { CharacterClass } from '@/types/game';
import wizardImage from '@/assets/character-wizard.png';
import knightImage from '@/assets/character-knight.png';
import rogueImage from '@/assets/character-rogue.png';

const CHARACTER_CLASSES = [
  {
    id: 'knight' as CharacterClass,
    name: 'Brave Knight',
    emoji: '🗡️',
    description: 'Strong with sword, protects friends',
    color: 'from-red-400 to-orange-500',
    image: knightImage,
  },
  {
    id: 'wizard' as CharacterClass,
    name: 'Clever Wizard',
    emoji: '🪄',
    description: 'Magic spells, solves puzzles',
    color: 'from-purple-400 to-blue-500',
    image: wizardImage,
  },
  {
    id: 'rogue' as CharacterClass,
    name: 'Sneaky Rogue',
    emoji: '🎯',
    description: 'Quick and smart, finds treasures',
    color: 'from-green-400 to-teal-500',
    image: rogueImage,
  },
];

export default function CharacterCreatePage() {
  const navigate = useNavigate();
  const createCharacter = useGameStore((state) => state.createCharacter);
  
  const [step, setStep] = useState<'name' | 'class'>('name');
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);

  const handleNext = () => {
    if (step === 'name' && name.trim()) {
      setStep('class');
    } else if (step === 'class' && selectedClass) {
      createCharacter(name.trim(), selectedClass);
      navigate('/game');
    }
  };

  const handleBack = () => {
    if (step === 'class') {
      setStep('name');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <AnimatePresence mode="wait">
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card-game text-center"
            >
              <h1 className="text-kid-3xl font-display text-foreground mb-4">
                🎭 What's Your Name?
              </h1>
              <p className="text-kid text-muted-foreground mb-8">
                Every hero needs a great name!
              </p>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="text-kid-xl text-center h-16 rounded-2xl mb-8"
                maxLength={20}
                autoFocus
              />

              <Button
                onClick={handleNext}
                disabled={!name.trim()}
                className="btn-primary-game gap-2"
              >
                Next <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {step === 'class' && (
            <motion.div
              key="class"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card-game"
            >
              <h1 className="text-kid-3xl font-display text-foreground mb-2 text-center">
                🎯 Choose Your Class, {name}!
              </h1>
              <p className="text-kid text-muted-foreground mb-8 text-center">
                Each class has special powers!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {CHARACTER_CLASSES.map((charClass) => (
                  <motion.button
                    key={charClass.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedClass(charClass.id)}
                    className={`
                      relative p-4 rounded-3xl border-4 transition-all
                      ${selectedClass === charClass.id
                        ? 'border-primary shadow-game'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    {selectedClass === charClass.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Check className="w-5 h-5 text-primary-foreground" />
                      </motion.div>
                    )}

                    <div className="aspect-square mb-4 rounded-2xl overflow-hidden bg-muted">
                      <img
                        src={charClass.image}
                        alt={charClass.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-kid-xl mb-1">{charClass.emoji}</div>
                    <h3 className="text-kid font-bold text-foreground mb-1">
                      {charClass.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {charClass.description}
                    </p>
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleNext}
                  disabled={!selectedClass}
                  className="btn-primary-game gap-2"
                >
                  <Check className="w-5 h-5" />
                  Start Adventure!
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
