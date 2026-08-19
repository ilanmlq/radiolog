import { useAuth } from '@/hooks/use-auth.ts';

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  if (!isAuthenticated) {
    void login();
    return;
  }

  return <>{children}</>
}
