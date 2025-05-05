import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { ReactNode } from 'react';
import { useThemeStore } from '@/store/use-ui-store';

interface ClerkProviderProps {
  children: ReactNode;
}

export function CustomClerkProvider({ children }: ClerkProviderProps) {
  const { theme } = useThemeStore();
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        elements: {
          formButtonPrimary:
            'bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2',
          card: 'bg-card',
          formFieldInput: 'bg-background border-input',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}