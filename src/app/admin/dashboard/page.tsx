'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import Card from '@/components/ui/Card';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Post {
  id: string;
  status: 'PUBLISHED' | 'DRAFT';
}

function AdminDashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalCategories: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    };

    const getStats = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/categories')
        ]);

        if (postsRes.ok && categoriesRes.ok) {
          const posts = await postsRes.json();
          const categories = await categoriesRes.json();
          
          setStats({
            totalPosts: posts.length,
            totalCategories: categories.length,
            publishedPosts: posts.filter((p: Post) => p.status === 'PUBLISHED').length,
            draftPosts: posts.filter((p: Post) => p.status === 'DRAFT').length,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    getUser();
    getStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-heading text-primary mb-4">
            Bienvenido al Panel de Administración
          </h2>
          
          {user && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Información del Usuario:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-purple-700">
                <div><strong>Nombre:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Rol:</strong> {user.role}</div>
                <div><strong>ID:</strong> {user.id}</div>
              </div>
            </div>
          )}
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.totalPosts}
            </div>
            <div className="text-gray-600">Total Posts</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.publishedPosts}
            </div>
            <div className="text-gray-600">Publicados</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {stats.draftPosts}
            </div>
            <div className="text-gray-600">Borradores</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalCategories}
            </div>
            <div className="text-gray-600">Categorías</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-heading text-primary mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/admin/posts/create"
              className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">✏️</div>
              <div className="font-medium text-purple-700">Crear Post</div>
            </Link>
            
            <Link
              href="/admin/posts"
              className="block p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📢</div>
              <div className="font-medium text-orange-700">Publicar/Despublicar</div>
            </Link>
            
            <Link
              href="/admin/categories"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📁</div>
              <div className="font-medium text-blue-700">Gestionar Categorías</div>
            </Link>
            
            <a
              href="/"
              target="_blank"
              className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🌐</div>
              <div className="font-medium text-green-700">Ver Sitio Web</div>
            </a>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <AdminDashboardContent />
    </AuthGuard>
  );
}