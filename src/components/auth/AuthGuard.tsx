'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/admin/login' 
}: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAuth = async () => {
      try {
        console.log('AuthGuard: Checking authentication...');
        const response = await fetch('/api/auth/me', {
          credentials: 'include', // Ensure cookies are sent
          cache: 'no-store' // Prevent caching of auth check
        });

        console.log('AuthGuard: Auth response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('AuthGuard: User authenticated:', data.user.email);
          setUser(data.user);
        } else {
          console.log('AuthGuard: User not authenticated, response:', response.status);
          setUser(null);
          
          // Only redirect if we require auth and we're not already on the redirect page
          if (requireAuth && pathname !== redirectTo) {
            console.log(`AuthGuard: Redirecting to ${redirectTo}`);
            router.replace(redirectTo);
            return;
          }
        }
      } catch (error) {
        console.error('AuthGuard: Auth check failed:', error);
        setUser(null);
        
        if (requireAuth && pathname !== redirectTo) {
          router.replace(redirectTo);
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [mounted, requireAuth, redirectTo, pathname, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If auth is required but user is not authenticated, don't render anything
  if (requireAuth && !user) {
    return null;
  }

  // If auth is not required OR user is authenticated, render children
  return <>{children}</>;
}