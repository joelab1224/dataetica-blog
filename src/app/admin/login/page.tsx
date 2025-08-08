'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          // User is already logged in, redirect to admin
          router.replace('/admin/dashboard');
          return;
        }
      } catch (error) {
        // User is not logged in, stay on login page
        console.log('User not authenticated');
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Login: Submitting credentials...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Ensure cookies are handled
      });

      console.log('Login: Response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.log('Login: Login failed:', data.error);
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      console.log('Login: Login successful, user:', data.user.email);

      // Redirect to admin dashboard
      // Add a small delay to ensure cookie is set
      setTimeout(() => {
        console.log('Login: Redirecting to dashboard...');
        // Use router.push to work with Next.js routing
        router.push('/admin/dashboard');
      }, 100);
    } catch (err) {
      console.error('Login: Error occurred:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-col justify-center py-20 container padding-responsive">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-hero text-primary font-heading mb-4">
              Administración DataÉtica
            </h2>
            <p className="text-nav-card text-secondary font-body">
              Inicia sesión para administrar el blog
            </p>
          </div>

          <Card variant="elevated" className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-large mb-6">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-nav-card font-semibold text-primary mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-subtle rounded-large focus-purple transition-all duration-200 font-body"
                placeholder="admin@dataetica.info"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-nav-card font-semibold text-primary mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-subtle rounded-large focus-purple transition-all duration-200 font-body"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full py-3"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

            <div className="mt-6 pt-6 border-t border-subtle text-center">
              <span className="text-metadata text-secondary font-body">
                Solo administradores
              </span>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}