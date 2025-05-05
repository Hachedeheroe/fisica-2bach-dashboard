import { UserButton } from '@clerk/clerk-react';
import { BellIcon, MenuIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/use-ui-store';
import { APP_NAME } from '@/lib/constants';

export function Header() {
  const { theme, setTheme, toggleSidebar } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <MenuIcon size={20} />
          <span className="sr-only">Menú</span>
        </Button>
        <h1 className="hidden text-xl font-bold lg:inline-block">{APP_NAME}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          <span className="sr-only">Cambiar tema</span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <BellIcon size={20} />
          <span className="sr-only">Notificaciones</span>
        </Button>
        
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}