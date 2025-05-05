import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentExam } from "@/types/metrics.types";
import { EXAM_TYPE_LABELS } from "@/lib/constants";
import { formatDateToLocale } from "@/lib/date-utils";
import { getColorByScore } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface RecentExamsListProps {
  exams: RecentExam[];
  loading?: boolean;
}

export function RecentExamsList({ exams, loading = false }: RecentExamsListProps) {
  // Blueprint: Lista de exámenes recientes con título, fecha y puntuación
  // Cada examen es un enlace a la página de detalle
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Exámenes Recientes</CardTitle>
          <CardDescription>Últimos exámenes realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-md bg-muted/50" data-testid="loading-placeholder" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Exámenes Recientes</CardTitle>
        <CardDescription>Últimos exámenes realizados</CardDescription>
      </CardHeader>
      <CardContent>
        {exams.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay exámenes recientes para mostrar.
          </p>
        ) : (
          <div className="flex flex-col space-y-3">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                to={`/exams/${exam.id}`}
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">{exam.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateToLocale(exam.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${getColorByScore(exam.score / exam.maxScore * 10)}`}>
                    {exam.score}/{exam.maxScore}
                  </span>
                  <ExternalLink size={16} className="text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}