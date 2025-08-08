'use client';

interface TagProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  removable?: boolean;
  onRemove?: () => void;
}

export default function Tag({ 
  children,
  onClick,
  variant = 'default',
  size = 'md',
  className = '',
  removable = false,
  onRemove
}: TagProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'success':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'danger':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'default':
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getSizeClasses = () => {
    return size === 'sm' ? 'px-2 py-1 text-metadata' : 'px-3 py-1.5 text-nav-card';
  };

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      onClick={onClick}
    >
      {children}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) onRemove();
          }}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </span>
  );
}