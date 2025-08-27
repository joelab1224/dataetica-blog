'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogPostCard from '@/components/BlogPostCard';
import BlogFilters from '@/components/BlogFilters';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import MainNavigation from '@/components/navigation/MainNavigation';
import EthicsIconPattern from '@/components/ui/EthicsIconPattern';
import FeaturedArticlesSection from '@/components/FeaturedArticlesSection';
import StatisticsSection from '@/components/StatisticsSection';
import TopicsSection from '@/components/TopicsSection';
import useClientTranslation from '@/lib/i18n/hooks/useClientTranslation';
import { formatDate } from '@/lib/utils/dateFormatter';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: string;
  author: {
    name: string;
  };
  categories: Array<{
    name: string;
    slug: string;
  }>;
}

interface PaginationData {
  page: number;
  pageSize: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  description?: string;
}

function HomePageContent(): JSX.Element {
  const { t } = useClientTranslation(['blog', 'common']);
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 9,
    totalPages: 1,
    totalPosts: 0,
    hasMore: false,
  });

  // Get initial filters from URL
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
  });

  // Fetch posts
  const fetchPosts = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pagination.pageSize.toString(),
        status: 'PUBLISHED',
      });
      
      if (currentFilters.category) {
        params.set('category', currentFilters.category);
      }
      
      if (currentFilters.search) {
        params.set('search', currentFilters.search);
      }

      const response = await fetch(`/api/blog/posts?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data.posts || []);
      setPagination(data.pagination || pagination);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts(1, filters);
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle filter changes
  const handleFiltersChange = (newFilters: { category?: string; search?: string }) => {
    const updatedFilters = {
      category: newFilters.category || undefined,
      search: newFilters.search || undefined,
    };
    setFilters(updatedFilters);
    fetchPosts(1, updatedFilters);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchPosts(newPage, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle scroll to all articles
  const scrollToAllArticles = () => {
    setShowAllArticles(true);
    
    // Use setTimeout to ensure the state change has been processed
    setTimeout(() => {
      const articlesElement = document.getElementById('articles-section');
      if (articlesElement) {
        const elementTop = articlesElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementTop - 100; // Add some padding from top
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Render pagination
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={pagination.page === i ? 'primary' : 'secondary'}
          size="sm"
          className="mx-1"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-12 space-x-2">
        <Button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          variant="secondary"
          size="sm"
        >
          {t('common:previous')}
        </Button>
        
        {pages}
        
        <Button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          variant="secondary"
          size="sm"
        >
          {t('common:next')}
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="hero" />
      
      {/* Modern Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Pattern - Subtle */}
        <div className="absolute inset-0 opacity-[0.02] text-gray-800">
          <EthicsIconPattern />
        </div>
        
        {/* Geometric Background Elements */}
        <div className="absolute top-20 left-12 w-64 h-64 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 right-8 w-80 h-80 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full blur-2xl opacity-40 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        <div className="container padding-responsive pt-16 pb-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Hero Content Grid */}
            <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-200px)]">
              
              {/* Left Column - Main Content */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Category Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center space-x-3 text-sm font-medium text-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🔬</span>
                    </div>
                    <span>{t('hero.badge')}</span>
                  </div>
                </div>
                
                {/* Main Title */}
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-heading text-gray-900 leading-tight">
                    {t('hero.title')}
                    <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                      {t('hero.titleHighlight')}
                    </span>
                    {t('hero.titleEnd')}
                  </h1>
                  
                  <p className="text-xl text-gray-600 font-body leading-relaxed max-w-2xl">
                    {t('hero.subtitle')}
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={scrollToAllArticles}
                    className="font-semibold px-8 py-4 group transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[200px]"
                  >
                    <span className="flex items-center justify-center">
                      {t('hero.exploreArticles')}
                      <svg className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => {
                      const topicsElement = document.getElementById('topics-section');
                      if (topicsElement) {
                        const elementTop = topicsElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementTop - 100; // Add some padding from top
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="font-semibold px-8 py-4 group transition-all duration-300 hover:shadow-lg min-w-[180px]"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {t('hero.viewTopics')}
                    </span>
                  </Button>
                </div>
                
                {/* Social Proof */}
                <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full border-2 border-white flex items-center justify-center text-xs">👨‍💻</div>
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full border-2 border-white flex items-center justify-center text-xs">👩‍🔬</div>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-xs">🎓</div>
                    </div>
                    <span className="font-medium">{t('hero.socialProof')}</span>
                  </div>
                  
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span className="font-medium">{t('hero.updatedWeekly')}</span>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Featured Content Preview */}
              <div className="lg:col-span-5 space-y-6">
                {/* Featured Article Preview */}
                {posts.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-extra-large border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('hero.featuredArticle')}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(posts[0].publishedAt, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-heading text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                        {posts[0].title}
                      </h3>
                      
                      <p className="text-gray-600 font-body line-clamp-3 text-sm leading-relaxed">
                        {posts[0].excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          {posts[0].categories.slice(0, 2).map((category) => (
                            <span key={category.slug} className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                              {category.name}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                          <span>{t('common:readMore')}</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-large border border-gray-100 p-6 text-center hover:shadow-lg transition-all duration-300">
                    <div className="text-lg font-heading text-purple-600 mb-1">{t('hero.originalContent')}</div>
                    <div className="text-xs text-gray-600 font-medium">{t('hero.independentResearch')}</div>
                  </div>
                </div>
                
                {/* Value Proposition Cards */}
                <div className="space-y-3">
                  {[
                    { icon: '🤖', textKey: 'hero.valueProps.aiAnalysis' },
                    { icon: '🔒', textKey: 'hero.valueProps.privacyData' },
                    { icon: '⚖️', textKey: 'hero.valueProps.ethicalFramework' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/40 backdrop-blur-sm rounded-large border border-gray-50 hover:bg-white/60 transition-all duration-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center text-sm">
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{t(item.textKey)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>

      <MainNavigation />
      
      {!showAllArticles && !filters.search && !filters.category && (
        <FeaturedArticlesSection 
          posts={posts}
          onViewAllClick={scrollToAllArticles}
        />
      )}
      
      <StatisticsSection 
        totalPosts={pagination.totalPosts}
        totalCategories={categories.length}
      />
      
      <div id="topics-section"></div>
      <TopicsSection 
        categories={categories}
        className="bg-white"
      />

      <div id="articles-section"></div>
      <main className="container padding-responsive py-12" data-filters-section>
        <div className="text-center mb-8">
          <h2 className="text-section-header text-primary mb-4 font-heading">
            {showAllArticles || filters.search || filters.category 
              ? t('articles.title') 
              : t('articles.exploreContent')
            }
          </h2>
          {(!showAllArticles && !filters.search && !filters.category) && (
            <p className="text-body text-secondary max-w-2xl mx-auto">
              {t('articles.useFilters')}
            </p>
          )}
        </div>
        
        <BlogFilters onFiltersChange={handleFiltersChange} />
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-large mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <React.Fragment>
            {!loading && (
              <div className="mb-6 text-secondary text-nav-card font-body">
                {pagination.totalPosts === 0 ? (
                  t('articles.noArticles')
                ) : (
                  t('articles.showing', { 
                    start: ((pagination.page - 1) * pagination.pageSize) + 1,
                    end: Math.min(pagination.page * pagination.pageSize, pagination.totalPosts),
                    total: pagination.totalPosts 
                  })
                )}
              </div>
            )}

            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-secondary text-section-header space-y-4">
                  {filters.search || filters.category ? (
                    <React.Fragment>
                      <p className="font-body">{t('articles.noMatchingArticles')}</p>
                      <Button
                        onClick={() => {
                          setFilters({ category: undefined, search: undefined });
                          fetchPosts(1, { category: undefined, search: undefined });
                        }}
                        variant="primary"
                      >
                        {t('articles.seeAllArticles')}
                      </Button>
                    </React.Fragment>
                  ) : (
                    <p className="font-body">{t('articles.noArticles')}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid-responsive gap-8">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {renderPagination()}
          </React.Fragment>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default function HomePage(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
