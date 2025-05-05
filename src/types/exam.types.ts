export interface Exam {
  id: string;
  title: string;
  date: string;
  type: ExamType;
  subject: string;
  topics: string[];
  totalQuestions: number;
  maxScore: number;
  studentScore: number;
  status: ExamStatus;
}

export interface ExamDetail extends Exam {
  questions: Question[];
}

export interface Question {
  id: string;
  examId: string;
  number: number;
  text: string;
  type: QuestionType;
  difficulty: number;
  topic: string;
  maxScore: number;
  studentAnswer?: string;
  correctAnswer: string;
  studentScore: number;
  feedback?: string;
  errorTypes?: ErrorType[];
}

export type ExamType = 
  | 'PARCIAL_1'
  | 'PARCIAL_2'
  | 'EVALUACION_1'
  | 'EVALUACION_2'
  | 'EVALUACION_3'
  | 'FINAL'
  | 'RECUPERACION';

export type ExamStatus = 
  | 'PENDIENTE'
  | 'COMPLETADO'
  | 'CALIFICADO'
  | 'REVISADO';

export type QuestionType = 
  | 'OPCION_MULTIPLE'
  | 'VERDADERO_FALSO'
  | 'DESARROLLO'
  | 'CALCULO'
  | 'FORMULA';

export type ErrorType = 
  | 'CONCEPTO_ERRONEO'
  | 'FORMULA_INCORRECTA'
  | 'CALCULO_INCORRECTO'
  | 'UNIDADES_INCORRECTAS'
  | 'INTERPRETACION_ERRONEA'
  | 'VECTORES_ESCALARES';

export interface ExamFilters {
  type?: ExamType;
  status?: ExamStatus;
  topic?: string;
  startDate?: string;
  endDate?: string;
}