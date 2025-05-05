import { NavLink } from 'react-router-dom';
import { useThemeStore } from '@/store/use-ui-store';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { 
  BarChart3, 
  Book, 
  ChevronLeft,
  Home, 
  MessageSquare, 
  Settings,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useThemeStore();

  // Manejo de sidebar en dispositivos móviles
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h2 className="text-lg font-semibold">Física 2º Bach</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            <SidebarItem to={ROUTES.DASHBOARD} icon={<Home size={20} />} label="Inicio" />
            <SidebarItem to={ROUTES.EXAMS} icon={<Book size={20} />} label="Exámenes" />
            <SidebarItem to={ROUTES.CHAT} icon={<MessageSquare size={20} />} label="Asistente IA" />
            <SidebarItem to={ROUTES.SETTINGS} icon={<Settings size={20} />} label="Configuración" />

            {/* Separador */}
            <li className="my-4 border-t" />

            {/* Datos y estadísticas */}
            <li className="px-3 py-2">
              <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                Análisis y Datos
              </h3>
              <ul className="space-y-1">
                <SidebarItem 
                  to="/analytics/performance" 
                  icon={<BarChart3 size={18} />} 
                  label="Rendimiento" 
                  compact
                />
                <SidebarItem 
                  to="/analytics/topics" 
                  icon={<Book size={18} />} 
                  label="Temas" 
                  compact
                />
                <SidebarItem 
                  to="/analytics/errors" 
                  icon={<X size={18} />} 
                  label="Errores" 
                  compact
                />
              </ul>
            </li>
          </ul>
        </nav>

        <div className="sticky bottom-0 border-t p-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={toggleSidebar}
          >
            <ChevronLeft size={16} className="mr-2" />
            <span>Contraer</span>
          </Button>
        </div>
      </aside>
    </>
  );
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  compact?: boolean;
}

function SidebarItem({ to, icon, label, compact = false }: SidebarItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent transition-colors",
            isActive && "bg-accent/80 font-medium",
            compact && "text-sm"
          )
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    </li>
  );
}