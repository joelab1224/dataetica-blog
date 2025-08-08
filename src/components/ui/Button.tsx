'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export default function Button({ 
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-hero-gradient text-white hover:opacity-90';
      case 'secondary':
        return 'bg-white text-primary border border-subtle hover-shadow';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'ghost':
        return 'bg-transparent text-secondary hover:text-primary';
      case 'white':
        return 'bg-white/95 backdrop-blur-sm text-primary hover:bg-white hover:shadow-xl border border-white/20 hover:border-white/40';
      default:
        return 'bg-hero-gradient text-white hover:opacity-90';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-metadata';
      case 'md':
        return 'px-4 py-2 text-nav-card';
      case 'lg':
        return 'px-6 py-3 text-section-header';
      default:
        return 'px-4 py-2 text-nav-card';
    }
  };

  return (
    <button 
      className={`inline-flex items-center justify-center font-medium rounded-large transition-all duration-200 focus-purple disabled:opacity-50 disabled:cursor-not-allowed ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}