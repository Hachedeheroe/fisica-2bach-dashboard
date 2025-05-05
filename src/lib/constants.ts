export const APP_NAME = 'Física 2º Bach';

export const ANTHROPIC_MODEL = 'claude-3-haiku-20240307';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  EXAMS: '/exams',
  EXAMS_DETAIL: '/exams/:id',
  CHAT: '/chat',
  SETTINGS: '/settings',
};

export const LOCAL_STORAGE_KEYS = {
  THEME: 'fisica-2bach-theme',
  SIDEBAR_STATE: 'fisica-2bach-sidebar-state',
};

export const EXAM_TYPE_LABELS = {
  PARCIAL_1: 'Primer Parcial',
  PARCIAL_2: 'Segundo Parcial',
  EVALUACION_1: 'Primera Evaluación',
  EVALUACION_2: 'Segunda Evaluación',
  EVALUACION_3: 'Tercera Evaluación',
  FINAL: 'Examen Final',
  RECUPERACION: 'Recuperación',
};

export const EXAM_STATUS_LABELS = {
  PENDIENTE: 'Pendiente',
  COMPLETADO: 'Completado',
  CALIFICADO: 'Calificado',
  REVISADO: 'Revisado',
};

export const QUESTION_TYPE_LABELS = {
  OPCION_MULTIPLE: 'Opción Múltiple',
  VERDADERO_FALSO: 'Verdadero/Falso',
  DESARROLLO: 'Desarrollo',
  CALCULO: 'Cálculo',
  FORMULA: 'Fórmula',
};

export const ERROR_TYPE_LABELS = {
  CONCEPTO_ERRONEO: 'Concepto erróneo',
  FORMULA_INCORRECTA: 'Fórmula incorrecta',
  CALCULO_INCORRECTO: 'Cálculo incorrecto',
  UNIDADES_INCORRECTAS: 'Unidades incorrectas',
  INTERPRETACION_ERRONEA: 'Interpretación errónea',
  VECTORES_ESCALARES: 'Confusión vectores/escalares',
};

export const PHYSICS_TOPICS = [
  'Cinemática',
  'Dinámica',
  'Trabajo y Energía',
  'Campo Gravitatorio',
  'Campo Eléctrico',
  'Campo Magnético',
  'Ondas',
  'Óptica',
  'Física Moderna',
  'Física Nuclear',
];

export const MASTERY_LEVEL_LABELS = {
  BEGINNER: 'Principiante',
  DEVELOPING: 'En desarrollo',
  PROFICIENT: 'Competente',
  ADVANCED: 'Avanzado',
  MASTER: 'Experto',
};

export const MASTERY_LEVEL_THRESHOLDS = {
  BEGINNER: 0,
  DEVELOPING: 3,
  PROFICIENT: 5,
  ADVANCED: 7,
  MASTER: 9,
};