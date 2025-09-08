'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import TurndownService from 'turndown';
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
  publishedAt: string;
}

function EditPostContent() {
  const { t } = useClientTranslation('admin');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    status: 'DRAFT',
    imageUrl: '',
    publishedAt: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  useEffect(() => {
    fetchCategories();
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

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

  const convertHtmlToMarkdown = (html: string) => {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
    return turndownService.turndown(html);
  };

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const post = await response.json();
        
        // Convert HTML content to markdown if it contains HTML tags
        let content = post.content;
        if (content && content.includes('<') && content.includes('>')) {
          content = convertHtmlToMarkdown(content);
        }
        
        setFormData({
          title: post.title,
          excerpt: post.excerpt,
          content: content,
          categoryId: post.categoryId,
          status: post.status,
          imageUrl: post.imageUrl || '',
          publishedAt: formatDateForInput(post.publishedAt),
        });
      } else {
        alert(t('messages.postNotFound'));
        router.push('/admin/posts');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert(t('messages.loadError'));
      router.push('/admin/posts');
    } finally {
      setLoadingPost(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/posts');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || t('messages.updateError')}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert(t('messages.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-populate publishedAt when status changes to PUBLISHED and no date is set
    if (name === 'status' && value === 'PUBLISHED' && !formData.publishedAt) {
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        [name]: value,
        publishedAt: formatDateForInput(now.toISOString())
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, content: value || '' }));
  };

  if (loadingPost || loadingCategories) {
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
            {t('forms.editPost')}
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

                  {formData.status === 'PUBLISHED' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Published Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        name="publishedAt"
                        value={formData.publishedAt}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        Set the exact date and time when this post should appear as published.
                      </div>
                    </div>
                  )}
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
                    {loading ? t('forms.updating') : (
                      formData.status === 'PUBLISHED' 
                        ? t('forms.updateAndPublish')
                        : t('forms.updateAsDraft')
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

export default function EditPostPage() {
  return (
    <AuthGuard requireAuth={true}>
      <EditPostContent />
    </AuthGuard>
  );
}