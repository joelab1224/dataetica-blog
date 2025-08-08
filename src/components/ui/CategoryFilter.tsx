'use client';

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange?: (categorySlug: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function CategoryFilter({ 
  categories = [],
  selectedCategory = 'all',
  onCategoryChange,
  className = '',
  disabled = false
}: CategoryFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  return (
    <div className={`category-filter ${className}`}>
      <label htmlFor="category" className="category-filter-label">
        Categoría
      </label>
      <select
        id="category"
        value={selectedCategory}
        onChange={handleChange}
        disabled={disabled}
        className="category-filter-select"
      >
        <option value="all">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name} ({category.postCount})
          </option>
        ))}
      </select>
    </div>
  );
}