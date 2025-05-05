import { useState } from "react";
import { Link } from "react-router-dom";
import { Exam, ExamFilters, ExamStatus, ExamType } from "@/types/exam.types";
import { EXAM_STATUS_LABELS, EXAM_TYPE_LABELS, PHYSICS_TOPICS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ChevronDown, 
  Filter, 
  Search, 
  SortAsc,
} from "lucide-react";
import { formatDateToLocale } from "@/lib/date-utils";
import { getColorByScore } from "@/lib/utils";

interface ExamListProps {
  exams: Exam[];
  loading?: boolean;
  onFilterChange?: (filters: ExamFilters) => void;
}

export function ExamList({ exams, loading = false, onFilterChange }: ExamListProps) {
  const [filters, setFilters] = useState<ExamFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Manejador para cambios en los filtros
  const handleFilterChange = (newFilters: Partial<ExamFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    // Eliminar filtros vacíos
    Object.keys(updatedFilters).forEach((key) => {
      if (!updatedFilters[key as keyof ExamFilters]) {
        delete updatedFilters[key as keyof ExamFilters];
      }
    });
    
    setFilters(updatedFilters);
    
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  // Función para obtener el color del status
  const getStatusColor = (status: ExamStatus) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "COMPLETADO":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "CALIFICADO":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "REVISADO":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  // Filtrar exámenes por término de búsqueda
  const filteredExams = searchTerm 
    ? exams.filter(exam => 
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : exams;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Exámenes</h2>
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-lg bg-muted/50"
              data-testid="loading-placeholder"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Exámenes</h2>
        
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar exámenes..."
              className="w-full rounded-md border border-input bg-background pl-8 pr-4 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
          
          <Button variant="outline" size="sm">
            <SortAsc className="mr-2 h-4 w-4" />
            Ordenar
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <Card className="animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Filtro por tipo */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Tipo de examen</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.type || ""}
                  onChange={(e) => handleFilterChange({ 
                    type: e.target.value ? e.target.value as ExamType : undefined 
                  })}
                >
                  <option value="">Todos</option>
                  {Object.entries(EXAM_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Filtro por estado */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Estado</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange({ 
                    status: e.target.value ? e.target.value as ExamStatus : undefined 
                  })}
                >
                  <option value="">Todos</option>
                  {Object.entries(EXAM_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Filtro por tema */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Tema</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={filters.topic || ""}
                  onChange={(e) => handleFilterChange({ topic: e.target.value || undefined })}
                >
                  <option value="">Todos</option>
                  {PHYSICS_TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Fechas */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha (desde)</label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    className="w-full rounded-md border border-input bg-background pl-8 pr-4 py-2 text-sm"
                    value={filters.startDate || ""}
                    onChange={(e) => handleFilterChange({ startDate: e.target.value || undefined })}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({});
                  setSearchTerm("");
                  if (onFilterChange) {
                    onFilterChange({});
                  }
                }}
              >
                Limpiar filtros
              </Button>
              <Button
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                Aplicar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {filteredExams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-muted-foreground">
              No se encontraron exámenes.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Prueba con otros filtros o términos de búsqueda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredExams.map((exam) => (
            <Link
              key={exam.id}
              to={`/exams/${exam.id}`}
              className="block"
            >
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{exam.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{EXAM_TYPE_LABELS[exam.type as keyof typeof EXAM_TYPE_LABELS]}</span>
                        <span>•</span>
                        <span>{formatDateToLocale(exam.date)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {exam.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full bg-secondary px-2 py-0.5 text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                        {exam.topics.length > 3 && (
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                            +{exam.topics.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                          exam.status
                        )}`}
                      >
                        {EXAM_STATUS_LABELS[exam.status]}
                      </span>
                      
                      {exam.status !== "PENDIENTE" && (
                        <span
                          className={`text-lg font-bold ${getColorByScore(
                            (exam.studentScore / exam.maxScore) * 10
                          )}`}
                        >
                          {exam.studentScore}/{exam.maxScore}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}