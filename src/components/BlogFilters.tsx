'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from './ui/Button';
import Tag from './ui/Tag';
import Card from './ui/Card';
import useClientTranslation from '@/lib/i18n/hooks/useClientTranslation';

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface BlogFiltersProps {
  onFiltersChange?: (filters: { category?: string; search?: string }) => void;
}

export default function BlogFilters({ onFiltersChange }: BlogFiltersProps) {
  const { t } = useClientTranslation('blog');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      updateFilters({ search: value, category: selectedCategory !== 'all' ? selectedCategory : undefined });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    updateFilters({ 
      search: searchTerm || undefined, 
      category: categorySlug !== 'all' ? categorySlug : undefined 
    });
  };

  // Update URL and notify parent
  const updateFilters = (filters: { category?: string; search?: string }) => {
    const params = new URLSearchParams();
    
    if (filters.category) {
      params.set('category', filters.category);
    }
    
    if (filters.search) {
      params.set('search', filters.search);
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '/';
    router.push(newUrl, { scroll: false });

    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    router.push('/', { scroll: false });
    
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all';

  return (
    <Card className="p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        {/* Search */}
        <div className="flex-1">
          <label className="block text-nav-card text-primary mb-2 font-semibold">
            {t('search.placeholder')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full pl-10 pr-4 py-3 border border-subtle rounded-large focus-purple transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <label className="block text-nav-card text-primary mb-2 font-semibold">
            {t('filters.category')}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-subtle rounded-large focus-purple transition-all duration-200 bg-white"
          >
            <option value="all">{t('categories.allCategories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name} ({category.postCount})
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="lg:pt-6">
            <Button
              onClick={clearFilters}
              variant="secondary"
              size="sm"
            >
              {t('filters.clearFilters')}
            </Button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-nav-card text-secondary font-medium">{t('filters.activeFilters')}:</span>
          
          {searchTerm && (
            <Tag
              variant="primary"
              size="sm"
              removable
              onRemove={() => {
                setSearchTerm('');
                updateFilters({ category: selectedCategory !== 'all' ? selectedCategory : undefined });
              }}
            >
              {t('search.searchBy')}: &ldquo;{searchTerm}&rdquo;
            </Tag>
          )}
          
          {selectedCategory !== 'all' && (
            <Tag
              variant="success"
              size="sm"
              removable
              onRemove={() => {
                setSelectedCategory('all');
                updateFilters({ search: searchTerm || undefined });
              }}
            >
              {t('filters.category')}: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
            </Tag>
          )}
        </div>
      )}
    </Card>
  );
}