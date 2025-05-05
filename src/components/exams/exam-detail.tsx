import { useState } from "react";
import { Link } from "react-router-dom";
import { ExamDetail, Question } from "@/types/exam.types";
import { 
  EXAM_STATUS_LABELS, 
  EXAM_TYPE_LABELS, 
  QUESTION_TYPE_LABELS, 
  ERROR_TYPE_LABELS 
} from "@/lib/constants";
import { formatDateToLocale } from "@/lib/date-utils";
import { calculateGrade, getColorByScore } from "@/lib/utils";
import { 
  ArrowLeft, 
  Calendar, 
  ChevronDown, 
  PencilRuler, 
  Sparkles,
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ExamDetailProps {
  exam: ExamDetail;
  loading?: boolean;
}

export function ExamDetail({ exam, loading = false }: ExamDetailProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  
  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-1/4 animate-pulse rounded-md bg-muted/50" data-testid="loading-placeholder" />
        <div className="h-64 animate-pulse rounded-lg bg-muted/50" data-testid="loading-placeholder" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              key={index} 
              className="h-16 animate-pulse rounded-md bg-muted/50" 
              data-testid="loading-placeholder"
            />
          ))}
        </div>
      </div>
    );
  }
  
  // Calcular estadísticas
  const totalQuestions = exam.questions.length;
  const correctQuestions = exam.questions.filter(q => 
    q.studentScore === q.maxScore
  ).length;
  const grade = calculateGrade(exam.studentScore, exam.maxScore);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/exams">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a exámenes
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Información del examen */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            
            {/* Metadatos */}
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDateToLocale(exam.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <PencilRuler className="h-4 w-4" />
                <span>{EXAM_TYPE_LABELS[exam.type]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>
                  {exam.topics.join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{EXAM_STATUS_LABELS[exam.status]}</span>
              </div>
            </div>
            
            {/* Resumen de resultados */}
            {exam.status !== "PENDIENTE" && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Resultados</h2>
                
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                    <span className="text-sm font-medium text-muted-foreground">Calificación</span>
                    <span className={`text-3xl font-bold ${getColorByScore(grade)}`}>
                      {grade.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">sobre 10</span>
                  </div>
                  
                  <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                    <span className="text-sm font-medium text-muted-foreground">Puntuación</span>
                    <span className="text-3xl font-bold">
                      {exam.studentScore}/{exam.maxScore}
                    </span>
                    <span className="text-xs text-muted-foreground">puntos</span>
                  </div>
                  
                  <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                    <span className="text-sm font-medium text-muted-foreground">Aciertos</span>
                    <span className="text-3xl font-bold">
                      {correctQuestions}/{totalQuestions}
                    </span>
                    <span className="text-xs text-muted-foreground">preguntas</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Acciones */}
        <div className="w-full md:w-64 space-y-3">
          <Button className="w-full" disabled={exam.status !== "PENDIENTE"}>
            {exam.status === "PENDIENTE" ? "Iniciar examen" : "Ver correcciones"}
          </Button>
          
          <Button variant="outline" className="w-full">
            Revisar con IA
          </Button>
        </div>
      </div>
      
      {/* Lista de preguntas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Preguntas</h2>
        
        {exam.questions.map((question, index) => (
          <QuestionItem 
            key={question.id}
            question={question}
            index={index}
            isExpanded={!!expandedQuestions[question.id]}
            onToggle={() => toggleQuestion(question.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface QuestionItemProps {
  question: Question;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function QuestionItem({ question, index, isExpanded, onToggle }: QuestionItemProps) {
  const questionScore = question.studentScore / question.maxScore;
  const scoreClass = getColorByScore(questionScore * 10);
  
  return (
    <Card className={`overflow-hidden transition-all ${isExpanded ? "shadow-md" : ""}`}>
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium">
            {question.number}
          </div>
          <div>
            <div className="font-medium">
              {question.text.length > 60
                ? question.text.substring(0, 60) + "..."
                : question.text}
            </div>
            <div className="text-xs text-muted-foreground">
              {QUESTION_TYPE_LABELS[question.type]} • {question.topic}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`font-semibold ${scoreClass}`}>
              {question.studentScore}/{question.maxScore}
            </div>
            <div className="text-xs text-muted-foreground">
              Dificultad: {question.difficulty}/5
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      
      {isExpanded && (
        <CardContent className="border-t bg-muted/10 px-4 pb-4 pt-2">
          <div className="space-y-3">
            <div>
              <div className="font-medium">Enunciado</div>
              <p className="mt-1">{question.text}</p>
            </div>
            
            {question.studentAnswer && (
              <div>
                <div className="font-medium">Tu respuesta</div>
                <p className="mt-1">{question.studentAnswer}</p>
              </div>
            )}
            
            <div>
              <div className="font-medium">Respuesta correcta</div>
              <p className="mt-1">{question.correctAnswer}</p>
            </div>
            
            {question.feedback && (
              <div>
                <div className="font-medium">Comentario del profesor</div>
                <p className="mt-1">{question.feedback}</p>
              </div>
            )}
            
            {question.errorTypes && question.errorTypes.length > 0 && (
              <div>
                <div className="font-medium">Tipos de error</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {question.errorTypes.map((errorType) => (
                    <span
                      key={errorType}
                      className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
                    >
                      {ERROR_TYPE_LABELS[errorType]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}