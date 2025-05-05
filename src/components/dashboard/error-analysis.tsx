import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorTypeCount } from "@/types/metrics.types";
import { ERROR_TYPE_LABELS } from "@/lib/constants";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Registrar componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface ErrorAnalysisProps {
  errors: ErrorTypeCount[];
  loading?: boolean;
}

export function ErrorAnalysis({ errors, loading = false }: ErrorAnalysisProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análisis de Errores</CardTitle>
          <CardDescription>
            Distribución de tipos de errores cometidos
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="h-48 w-48 animate-pulse rounded-full bg-muted/50" data-testid="loading-placeholder" />
        </CardContent>
      </Card>
    );
  }

  // Si no hay errores registrados
  if (!errors || errors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análisis de Errores</CardTitle>
          <CardDescription>
            Distribución de tipos de errores cometidos
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-6">
          <div className="text-center text-muted-foreground">
            <p>No hay suficientes datos para analizar.</p>
            <p className="text-sm">
              A medida que completes exámenes, se analizarán tus errores más frecuentes.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preparar datos para el gráfico
  const chartData = {
    labels: errors.map(
      (error) => ERROR_TYPE_LABELS[error.type as keyof typeof ERROR_TYPE_LABELS] || error.type
    ),
    datasets: [
      {
        data: errors.map((error) => error.count),
        backgroundColor: [
          "hsl(215, 70%, 60%)",
          "hsl(25, 70%, 60%)",
          "hsl(145, 70%, 60%)",
          "hsl(265, 70%, 60%)",
          "hsl(355, 70%, 60%)",
          "hsl(180, 70%, 60%)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            return `${errors[index].count} errores (${(errors[index].percentage * 100).toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Análisis de Errores</CardTitle>
        <CardDescription>
          Distribución de tipos de errores cometidos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto h-48 w-48 mb-4">
          <Doughnut data={chartData} options={options} />
        </div>
        
        <div className="mt-2 space-y-2">
          {errors.map((error) => (
            <div
              key={error.type}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <span className="text-sm">
                {ERROR_TYPE_LABELS[error.type as keyof typeof ERROR_TYPE_LABELS] || error.type}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {error.count} errores
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                  {(error.percentage * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}