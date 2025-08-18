'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AuthGuard from '@/components/auth/AuthGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
}

function PostsManagementContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id));
      } else {
        alert('Error al eliminar el post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar el post');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'PUBLISHED' | 'DRAFT') => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === id ? { ...post, status: newStatus } : post
        ));
      } else {
        alert('Error al cambiar el estado del post');
      }
    } catch (error) {
      console.error('Error updating post status:', error);
      alert('Error al cambiar el estado del post');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'ALL') return true;
    return post.status === filter;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-heading text-primary">
            Gestión de Posts
          </h1>
          <Link href="/admin/posts/create">
            <Button variant="primary">
              Crear Nuevo Post
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
            <div className="flex space-x-2">
              {[
                { key: 'ALL', label: 'Todos' },
                { key: 'PUBLISHED', label: 'Publicados' },
                { key: 'DRAFT', label: 'Borradores' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as 'ALL' | 'PUBLISHED' | 'DRAFT')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({filteredPosts.length} posts)
            </span>
          </div>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                No hay posts para mostrar
              </div>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-heading text-primary">
                        {post.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                        post.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        <span>{post.status === 'PUBLISHED' ? '🟢' : '🟡'}</span>
                        <span>{post.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📁 {post.category.name}</span>
                      <span>
                        📅 {format(new Date(post.createdAt), 'dd/MM/yyyy', { locale: es })}
                      </span>
                      <span>
                        🔄 {format(new Date(post.updatedAt), 'dd/MM/yyyy', { locale: es })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button size="sm" variant="secondary">
                        Editar
                      </Button>
                    </Link>
                    
                    <Button
                      size="sm"
                      variant={post.status === 'PUBLISHED' ? 'secondary' : 'primary'}
                      onClick={() => handleStatusChange(
                        post.id,
                        post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
                      )}
                      className={`${
                        post.status === 'PUBLISHED' 
                          ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-300' 
                          : 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                      }`}
                    >
                      {post.status === 'PUBLISHED' ? '📤 Despublicar' : '📢 Publicar'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default function PostsManagementPage() {
  return (
    <AuthGuard requireAuth={true}>
      <PostsManagementContent />
    </AuthGuard>
  );
}