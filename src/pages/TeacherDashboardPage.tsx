import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Target, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProgressBar } from '@/components/game/ProgressBar';
import type { StudentProgress } from '@/types/game';

// Mock data
const CLASS_DATA = {
  teacher: 'Mrs. Johnson',
  grade: 3,
  totalStudents: 25,
  performance: {
    mathMastered: 18,
    fractionHelp: 7,
  },
  engagement: {
    avgSession: 16,
    completionRate: 82,
  },
  recommendations: [
    'Fraction practice needed for 7 students',
    'Vocabulary enrichment ready for 12 students',
  ],
};

const STUDENTS: StudentProgress[] = [
  { name: 'Emma', adventures: 12, mathScore: 85, readingScore: 92, lastPlayed: 'Today' },
  { name: 'Jake', adventures: 8, mathScore: 72, readingScore: 88, lastPlayed: 'Yesterday' },
  { name: 'Sofia', adventures: 15, mathScore: 94, readingScore: 91, lastPlayed: 'Today' },
  { name: 'Liam', adventures: 6, mathScore: 65, readingScore: 78, lastPlayed: '2 days ago' },
  { name: 'Olivia', adventures: 10, mathScore: 88, readingScore: 95, lastPlayed: 'Today' },
  { name: 'Noah', adventures: 9, mathScore: 76, readingScore: 82, lastPlayed: 'Yesterday' },
  { name: 'Ava', adventures: 11, mathScore: 90, readingScore: 89, lastPlayed: 'Today' },
  { name: 'Mason', adventures: 7, mathScore: 68, readingScore: 75, lastPlayed: '3 days ago' },
];

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-kid-2xl font-display text-foreground">
              👩‍🏫 {CLASS_DATA.teacher}'s Class - Grade {CLASS_DATA.grade}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              {CLASS_DATA.totalStudents} Students
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Class Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-game"
          >
            <h2 className="text-kid-lg font-bold text-foreground mb-4">
              📊 Class Performance
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-kid font-semibold text-foreground mb-2">Math Skills</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {CLASS_DATA.performance.mathMastered} students mastered division
                </p>
                <ProgressBar 
                  value={CLASS_DATA.performance.mathMastered} 
                  max={CLASS_DATA.totalStudents}
                  color="success"
                />
                <p className="text-sm text-danger mt-2">
                  {CLASS_DATA.performance.fractionHelp} students need fraction help
                </p>
              </div>
            </div>
          </motion.div>

          {/* Engagement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-game"
          >
            <h2 className="text-kid-lg font-bold text-foreground mb-4">
              📈 Engagement
            </h2>

            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-xl">
                <p className="text-kid-3xl font-bold text-primary">
                  {CLASS_DATA.engagement.avgSession} min
                </p>
                <p className="text-muted-foreground">Average Session</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-xl">
                <p className="text-kid-3xl font-bold text-success">
                  {CLASS_DATA.engagement.completionRate}%
                </p>
                <p className="text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-game"
          >
            <h2 className="text-kid-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Recommended Focus Areas
            </h2>

            <ul className="space-y-3">
              {CLASS_DATA.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground">
                  <span className="text-primary">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Student List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-game"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-kid-lg font-bold text-foreground">
              📋 Student List
            </h2>
            <Button variant="outline" className="gap-2">
              <Download className="w-5 h-5" />
              Export Data
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Adventures</TableHead>
                  <TableHead className="text-center">Math</TableHead>
                  <TableHead className="text-center">Reading</TableHead>
                  <TableHead>Last Played</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STUDENTS.map((student) => (
                  <TableRow key={student.name}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center">{student.adventures}</TableCell>
                    <TableCell className="text-center">
                      <span className={student.mathScore >= 80 ? 'text-success' : student.mathScore >= 70 ? 'text-accent' : 'text-danger'}>
                        {student.mathScore}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={student.readingScore >= 80 ? 'text-success' : student.readingScore >= 70 ? 'text-accent' : 'text-danger'}>
                        {student.readingScore}%
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{student.lastPlayed}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
