'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AuthGuard from '@/components/auth/AuthGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import useClientTranslation from '@/lib/i18n/hooks/useClientTranslation';

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
  const { t } = useClientTranslation('admin');
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
        alert(`Error: ${errorData.error || t('messages.createError')}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert(t('messages.createError'));
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
            {t('forms.createPost')}
          </h1>
          <Button
            variant="secondary"
            onClick={() => router.back()}
          >
            {t('forms.cancel')}
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
                      {t('forms.title')} *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={t('forms.titlePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('forms.excerpt')} *
                    </label>
                    <textarea
                      name="excerpt"
                      required
                      value={formData.excerpt}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={t('forms.excerptPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('forms.imageUrl')}
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={t('forms.imageUrlPlaceholder')}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('forms.content')} *
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
                  {t('forms.configuration')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('forms.category')} *
                    </label>
                    <select
                      name="categoryId"
                      required
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">{t('forms.selectCategory')}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('forms.publishStatus')}
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="DRAFT">{t('forms.draftStatus')}</option>
                      <option value="PUBLISHED">{t('forms.publishedStatus')}</option>
                    </select>
                    <div className="mt-2 text-xs text-gray-500">
                      {formData.status === 'PUBLISHED' 
                        ? t('forms.publishedNote')
                        : t('forms.draftNote')
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
                    {loading ? t('forms.creating') : (
                      formData.status === 'PUBLISHED' 
                        ? t('forms.createAndPublish')
                        : t('forms.createAsDraft')
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => setFormData({...formData, status: 'DRAFT'})}
                    disabled={loading}
                  >
                    {t('forms.saveAsDraft')}
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