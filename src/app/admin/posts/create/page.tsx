'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AuthGuard from '@/components/auth/AuthGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  status: 'PUBLISHED' | 'DRAFT';
  imageUrl: string;
}

function CreatePostContent() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    status: 'DRAFT',
    imageUrl: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/posts');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Error al crear el post'}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error al crear el post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, content: value || '' }));
  };

  if (loadingCategories) {
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-heading text-primary">
            Crear Nuevo Post
          </h1>
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ingresa el título del post"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      name="excerpt"
                      required
                      value={formData.excerpt}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Breve descripción del post"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Imagen
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenido *
                  </label>
                  <div className="border border-gray-300 rounded-md">
                    <MDEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      height={400}
                      preview="edit"
                      hideToolbar={false}
                      data-color-mode="light"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Configuración
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      name="categoryId"
                      required
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado de Publicación
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="DRAFT">🟡 Borrador (No visible al público)</option>
                      <option value="PUBLISHED">🟢 Publicado (Visible al público)</option>
                    </select>
                    <div className="mt-2 text-xs text-gray-500">
                      {formData.status === 'PUBLISHED' 
                        ? '✅ Este post será visible inmediatamente en el blog público' 
                        : '⚠️ Este post solo será visible en el panel de administración'
                      }
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Creando...' : (
                      formData.status === 'PUBLISHED' 
                        ? '📢 Crear y Publicar' 
                        : '💾 Crear como Borrador'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setFormData({...formData, status: 'DRAFT'})}
                    disabled={loading}
                  >
                    💾 Guardar como Borrador
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default function CreatePostPage() {
  return (
    <AuthGuard requireAuth={true}>
      <CreatePostContent />
    </AuthGuard>
  );
}