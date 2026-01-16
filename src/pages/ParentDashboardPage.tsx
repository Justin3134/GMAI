import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Clock, Target, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/game/ProgressBar';

// Mock data
const CHILD_DATA = {
  name: 'Emma',
  thisWeek: {
    adventures: 5,
    minutes: 47,
  },
  skills: {
    math: { progress: 85, details: ['Division: ⭐⭐⭐ Mastered', 'Fractions: ⭐⭐ Improving'] },
    vocabulary: { progress: 70, wordsLearned: 12 },
    reading: { progress: 95 },
    science: { progress: 60 },
  },
  safety: {
    contentFiltering: true,
    ageAppropriate: 100,
    safetyBlocks: 3,
  },
  settings: {
    sessionLimit: 30,
    difficulty: 'Adaptive',
  },
};

export default function ParentDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-kid-2xl font-display text-foreground">
              📊 {CHILD_DATA.name}'s Learning Progress
            </h1>
            <p className="text-muted-foreground">
              Parent Dashboard
            </p>
          </div>
        </div>

        {/* This Week Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-game mb-6"
        >
          <h2 className="text-kid-lg font-bold text-foreground mb-4">
            📅 This Week
          </h2>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-kid-3xl font-bold text-primary">{CHILD_DATA.thisWeek.adventures}</p>
              <p className="text-muted-foreground">Adventures</p>
            </div>
            <div className="text-center">
              <p className="text-kid-3xl font-bold text-secondary">{CHILD_DATA.thisWeek.minutes}</p>
              <p className="text-muted-foreground">Minutes Played</p>
            </div>
          </div>
        </motion.div>

        {/* Skills Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-game mb-6"
        >
          <h2 className="text-kid-lg font-bold text-foreground mb-6">
            📚 Skills Practiced
          </h2>

          <div className="space-y-6">
            {/* Math */}
            <div>
              <h3 className="text-kid font-semibold text-foreground mb-2">
                🔢 Math (Grade 3-4)
              </h3>
              <ProgressBar
                value={CHILD_DATA.skills.math.progress}
                color="primary"
              />
              <ul className="mt-2 space-y-1">
                {CHILD_DATA.skills.math.details.map((detail, i) => (
                  <li key={i} className="text-sm text-muted-foreground">• {detail}</li>
                ))}
              </ul>
            </div>

            {/* Vocabulary */}
            <div>
              <h3 className="text-kid font-semibold text-foreground mb-2">
                📖 Vocabulary
              </h3>
              <ProgressBar
                value={CHILD_DATA.skills.vocabulary.progress}
                color="secondary"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                • New words learned: {CHILD_DATA.skills.vocabulary.wordsLearned}
              </p>
            </div>

            {/* Reading */}
            <div>
              <h3 className="text-kid font-semibold text-foreground mb-2">
                📚 Reading Comprehension
              </h3>
              <ProgressBar
                value={CHILD_DATA.skills.reading.progress}
                color="success"
              />
            </div>

            {/* Science */}
            <div>
              <h3 className="text-kid font-semibold text-foreground mb-2">
                🔬 Science
              </h3>
              <ProgressBar
                value={CHILD_DATA.skills.science.progress}
                color="accent"
              />
            </div>
          </div>
        </motion.div>

        {/* Safety Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-game mb-6"
        >
          <h2 className="text-kid-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-success" />
            Safety Highlights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-xl text-center">
              <p className="text-kid font-semibold text-foreground">Content Filtering</p>
              <p className="text-success font-bold">✓ Active</p>
            </div>
            <div className="p-4 bg-muted rounded-xl text-center">
              <p className="text-kid font-semibold text-foreground">Age-Appropriate</p>
              <p className="text-success font-bold">{CHILD_DATA.safety.ageAppropriate}%</p>
            </div>
            <div className="p-4 bg-muted rounded-xl text-center">
              <p className="text-kid font-semibold text-foreground">Safety Blocks</p>
              <p className="text-foreground">{CHILD_DATA.safety.safetyBlocks} prevented</p>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-game"
        >
          <h2 className="text-kid-lg font-bold text-foreground mb-4">
            ⚙️ Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Session Time Limit</p>
                <p className="text-muted-foreground">{CHILD_DATA.settings.sessionLimit} minutes ⏱️</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
              <Target className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Difficulty</p>
                <p className="text-muted-foreground">{CHILD_DATA.settings.difficulty} 🎯</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button variant="outline" className="gap-2">
              <Download className="w-5 h-5" />
              Download Report
            </Button>
            <Button variant="outline">
              Edit Settings
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
