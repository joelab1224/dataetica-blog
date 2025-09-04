import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination, { PaginationData } from '../Pagination';

// Mock the useClientTranslation hook
jest.mock('@/lib/i18n/hooks/useClientTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'previous': 'Previous',
        'next': 'Next'
      };
      return translations[key] || key;
    }
  })
}));

// Mock LoadingSpinner component
jest.mock('../LoadingSpinner', () => {
  return function LoadingSpinner({ className }: { size?: string; className?: string }) {
    return <div data-testid="loading-spinner" className={className}>Loading...</div>;
  };
});

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  const defaultPagination: PaginationData = {
    page: 2,
    pageSize: 9,
    totalPages: 5,
    totalPosts: 45,
    hasMore: true
  };

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders pagination with correct page numbers', () => {
    render(
      <Pagination 
        pagination={defaultPagination}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show pages 1, 2, 3, 4, 5 (max 5 visible pages)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    // Previous and Next buttons should be present
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('calls onPageChange when page number is clicked', () => {
    render(
      <Pagination 
        pagination={defaultPagination}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('3'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when Previous button is clicked', () => {
    render(
      <Pagination 
        pagination={defaultPagination}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('Previous'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when Next button is clicked', () => {
    render(
      <Pagination 
        pagination={defaultPagination}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('Next'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('disables Previous button on first page', () => {
    const firstPagePagination = { ...defaultPagination, page: 1 };
    
    render(
      <Pagination 
        pagination={firstPagePagination}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous').closest('button');
    expect(previousButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    const lastPagePagination = { ...defaultPagination, page: 5 };
    
    render(
      <Pagination 
        pagination={lastPagePagination}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next').closest('button');
    expect(nextButton).toBeDisabled();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <Pagination 
        pagination={defaultPagination}
        onPageChange={mockOnPageChange}
        isLoading={true}
      />
    );

    // All buttons should be disabled during loading
    const pageButtons = screen.getAllByRole('button');
    pageButtons.forEach(button => {
      expect(button).toBeDisabled();
    });

    // Loading spinner should be visible on current page
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('does not render when totalPages is 1 or less', () => {
    const singlePagePagination = { ...defaultPagination, totalPages: 1 };
    
    const { container } = render(
      <Pagination 
        pagination={singlePagePagination}
        onPageChange={mockOnPageChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('handles large page numbers correctly', () => {
    const largePagination: PaginationData = {
      page: 50,
      pageSize: 9,
      totalPages: 100,
      totalPosts: 900,
      hasMore: true
    };
    
    render(
      <Pagination 
        pagination={largePagination}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show pages around page 50 (e.g., 48, 49, 50, 51, 52)
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
    expect(screen.getByText('52')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Pagination 
        pagination={defaultPagination}
        onPageChange={mockOnPageChange}
        className="custom-pagination-class"
      />
    );

    const navElement = container.querySelector('nav');
    expect(navElement).toHaveClass('custom-pagination-class');
  });

  it('uses custom maxVisiblePages', () => {
    const largePagination: PaginationData = {
      page: 5,
      pageSize: 9,
      totalPages: 20,
      totalPosts: 180,
      hasMore: true
    };
    
    render(
      <Pagination 
        pagination={largePagination}
        onPageChange={mockOnPageChange}
        maxVisiblePages={3}
      />
    );

    // Should only show 3 pages (4, 5, 6)
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.queryByText('7')).not.toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });
});
