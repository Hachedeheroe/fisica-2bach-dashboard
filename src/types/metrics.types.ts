export interface Metrics {
  overallScore: number;
  examCount: number;
  topicsCount: number;
  topicsMastered: number;
  progressByTopic: TopicProgress[];
  scoreByExamType: ExamTypeScore[];
  recentExams: RecentExam[];
  errorsByType: ErrorTypeCount[];
  weeklyActivity: WeeklyActivity[];
}

export interface TopicProgress {
  topic: string;
  score: number;
  questionsCount: number;
  masteryLevel: MasteryLevel;
}

export interface ExamTypeScore {
  type: string;
  averageScore: number;
  count: number;
}

export interface RecentExam {
  id: string;
  title: string;
  date: string;
  score: number;
  maxScore: number;
}

export interface ErrorTypeCount {
  type: string;
  count: number;
  percentage: number;
}

export interface WeeklyActivity {
  week: string;
  examsCount: number;
  averageScore: number;
}

export type MasteryLevel = 
  | 'BEGINNER'
  | 'DEVELOPING'
  | 'PROFICIENT'
  | 'ADVANCED'
  | 'MASTER';