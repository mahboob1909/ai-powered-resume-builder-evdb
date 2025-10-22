import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

  const variantClasses = {
    primary: 'bg-gradient-gold text-dark-950 hover:shadow-gold-lg focus:ring-brand-gold shadow-gold font-bold',
    secondary: 'bg-dark-900 hover:bg-dark-800 dark:bg-dark-800 dark:hover:bg-dark-700 text-white focus:ring-dark-700 shadow-lg hover:shadow-xl border border-brand-gold/20',
    outline: 'border-2 border-brand-gold text-brand-pirate-gold dark:text-brand-gold hover:bg-brand-gold/10 dark:hover:bg-brand-gold/5 focus:ring-brand-gold',
    ghost: 'text-dark-900 dark:text-gray-300 hover:bg-brand-gold/10 dark:hover:bg-brand-gold/5 focus:ring-brand-gold',
    danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    gold: 'bg-brand-gold hover:bg-brand-pirate-gold text-dark-950 focus:ring-brand-gold shadow-gold hover:shadow-gold-lg font-bold'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg'
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className={`${iconSizeClasses[size]} mr-2 animate-spin`} />
      ) : icon ? (
        <span className={`${iconSizeClasses[size]} mr-2`}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;