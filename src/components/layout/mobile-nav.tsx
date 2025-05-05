import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Book,
  Home, 
  Menu, 
  MessageSquare, 
  Settings, 
  X 
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  // Blueprint: Navegación móvil que aparece en pantallas pequeñas
  // Proporciona acceso a las páginas principales como menú desplegable
  
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMenu}
        aria-label="Menú"
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}
      
      {/* Menú desplegable */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs transform bg-background p-6 shadow-lg transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Física 2º Bach</div>
          <Button variant="ghost" size="icon" onClick={closeMenu}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-4">
            <NavItem to={ROUTES.DASHBOARD} icon={<Home />} label="Inicio" onClick={closeMenu} />
            <NavItem to={ROUTES.EXAMS} icon={<Book />} label="Exámenes" onClick={closeMenu} />
            <NavItem to={ROUTES.CHAT} icon={<MessageSquare />} label="Asistente IA" onClick={closeMenu} />
            <NavItem to={ROUTES.SETTINGS} icon={<Settings />} label="Configuración" onClick={closeMenu} />
            
            {/* Separador */}
            <li className="my-4 border-t" />
            
            {/* Análisis */}
            <li>
              <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                Análisis
              </div>
              <ul className="space-y-3 pl-2">
                <NavItem 
                  to="/analytics/performance" 
                  icon={<BarChart3 className="h-5 w-5" />} 
                  label="Rendimiento" 
                  onClick={closeMenu}
                />
                <NavItem 
                  to="/analytics/topics" 
                  icon={<Book className="h-5 w-5" />} 
                  label="Temas" 
                  onClick={closeMenu}
                />
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function NavItem({ to, icon, label, onClick }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
            isActive
              ? "bg-accent font-medium text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
          )
        }
        onClick={onClick}
      >
        <span className="h-5 w-5">{icon}</span>
        <span>{label}</span>
      </NavLink>
    </li>
  );
}