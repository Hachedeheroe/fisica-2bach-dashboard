import { ReactNode } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useThemeStore } from '@/store/use-ui-store';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const { sidebarOpen } = useThemeStore();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        
        <main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            sidebarOpen ? "lg:ml-64" : "ml-0"
          )}
        >
          <div className="container mx-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}