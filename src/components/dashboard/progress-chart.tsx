import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopicProgress } from "@/types/metrics.types";
import { getColorByScore, truncateText } from "@/lib/utils";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Registrar componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  title: string;
  description?: string;
  data: TopicProgress[];
  loading?: boolean;
}

export function ProgressChart({
  title,
  description,
  data,
  loading = false,
}: ProgressChartProps) {
  // Blueprint: Gráfico de línea que muestra el progreso por tema
  // Muestra el nivel de dominio para cada tema estudiado
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse bg-muted/50" />
        </CardContent>
      </Card>
    );
  }

  // Configurar datos para el gráfico
  const chartData = {
    labels: data.map(item => truncateText(item.topic, 15)),
    datasets: [
      {
        label: "Puntuación",
        data: data.map(item => item.score),
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Opciones del gráfico
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            const index = items[0].dataIndex;
            return data[index].topic;
          },
          label: (item) => {
            const value = item.raw as number;
            return `Puntuación: ${value.toFixed(1)}/10`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((topic) => (
            <div key={topic.topic} className="flex flex-col space-y-1.5 rounded-md border p-2">
              <div className="text-xs font-medium">{topic.topic}</div>
              <div className={`text-sm font-bold ${getColorByScore(topic.score)}`}>
                {topic.score.toFixed(1)}/10
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}