'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ 
  children, 
  className = '', 
  variant = 'default' 
}: CardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-card shadow-medium hover-shadow rounded-extra-large';
      case 'outlined':
        return 'bg-card border border-subtle rounded-extra-large';
      case 'default':
      default:
        return 'bg-card shadow-soft rounded-extra-large';
    }
  };

  return (
    <div className={`overflow-hidden transition-all duration-200 ${getVariantClasses()} ${className}`}>
      {children}
    </div>
  );
}