import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  variant?: 'default' | 'premium' | 'outlined';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
  variant = 'default'
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';

  const variantClasses = {
    default: 'bg-white dark:bg-dark-900 shadow-soft border border-gray-200 dark:border-dark-800',
    premium: 'bg-white dark:bg-dark-900 shadow-gold border-2 border-brand-gold/30 hover:border-brand-gold/60',
    outlined: 'bg-white/50 dark:bg-dark-900/50 backdrop-blur-sm border-2 border-brand-gold/20 hover:border-brand-gold/40'
  };

  const hoverClasses = hover ? 'hover:shadow-gold hover:-translate-y-1 cursor-pointer' : '';

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${paddingClasses[padding]} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;