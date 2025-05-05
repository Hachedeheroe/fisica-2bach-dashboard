import { BarChart, BookOpen, BrainCircuit, GraduationCap } from "lucide-react";
import { MetricCard } from "./metric-card";
import { Metrics } from "@/types/metrics.types";

interface MetricsGridProps {
  metrics: Metrics;
  loading?: boolean;
}

export function MetricsGrid({ metrics, loading = false }: MetricsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-lg bg-muted/50"
            data-testid="loading-placeholder"
          />
        ))}
      </div>
    );
  }

  const {
    overallScore,
    examCount,
    topicsCount,
    topicsMastered,
  } = metrics;

  // Calcular porcentaje de temas dominados
  const masteryPercentage = Math.round((topicsMastered / topicsCount) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Nota Media"
        value={`${overallScore.toFixed(2)}/10`}
        description="En todos los exámenes"
        icon={<GraduationCap className="h-4 w-4" />}
      />
      <MetricCard
        title="Exámenes Completados"
        value={examCount}
        icon={<BookOpen className="h-4 w-4" />}
      />
      <MetricCard
        title="Temas Dominados"
        value={`${topicsMastered}/${topicsCount}`}
        description={`${masteryPercentage}% del temario`}
        icon={<BrainCircuit className="h-4 w-4" />}
        trend={{
          value: masteryPercentage,
          positive: true,
        }}
      />
      <MetricCard
        title="Actividad Semanal"
        value={metrics.weeklyActivity.length > 0 ? 
               `${metrics.weeklyActivity[metrics.weeklyActivity.length - 1].examsCount} exámenes` : 
               "0 exámenes"}
        icon={<BarChart className="h-4 w-4" />}
      />
    </div>
  );
}