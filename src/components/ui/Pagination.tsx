'use client';

import React from 'react';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import useClientTranslation from '@/lib/i18n/hooks/useClientTranslation';

export interface PaginationData {
  page: number;
  pageSize: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
}

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

const Pagination = React.memo<PaginationProps>(({
  pagination,
  onPageChange,
  isLoading = false,
  maxVisiblePages = 5,
  className = ''
}) => {
  const { t } = useClientTranslation('common');

  // Don't render if there's only one page or no pages
  if (pagination.totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          variant="secondary"
          size="sm"
          disabled={isLoading}
          className={`mx-1 min-w-[2.5rem] transition-all duration-200 ${
            pagination.page === i 
              ? 'text-purple-600 font-extrabold bg-purple-50 border-2 border-purple-300 hover:bg-purple-100 shadow-lg ring-2 ring-purple-200' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          aria-label={`${pagination.page === i ? 'Current page, ' : ''}Page ${i}`}
          aria-current={pagination.page === i ? 'page' : undefined}
        >
          {isLoading && pagination.page === i ? (
            <LoadingSpinner size="sm" className="text-purple-600" />
          ) : (
            i
          )}
        </Button>
      );
    }

    return pages;
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1 && !isLoading) {
      onPageChange(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages && !isLoading) {
      onPageChange(pagination.page + 1);
    }
  };

  return (
    <nav 
      className={`flex justify-center items-center mt-12 space-x-2 ${className}`}
      aria-label="Pagination Navigation"
      role="navigation"
    >
      {/* Previous Button */}
      <Button
        onClick={handlePreviousPage}
        disabled={pagination.page === 1 || isLoading}
        variant="secondary"
        size="sm"
        className="px-4 py-2 transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go to previous page"
      >
        {isLoading && pagination.page > 1 ? (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>{t('previous')}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('previous')}</span>
          </div>
        )}
      </Button>
      
      {/* Page Numbers */}
      <div className="flex items-center space-x-1" role="group" aria-label="Page numbers">
        {generatePageNumbers()}
      </div>
      
      {/* Next Button */}
      <Button
        onClick={handleNextPage}
        disabled={pagination.page === pagination.totalPages || isLoading}
        variant="secondary"
        size="sm"
        className="px-4 py-2 transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Go to next page"
      >
        {isLoading && pagination.page < pagination.totalPages ? (
          <div className="flex items-center space-x-2">
            <span>{t('next')}</span>
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>{t('next')}</span>
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </Button>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
