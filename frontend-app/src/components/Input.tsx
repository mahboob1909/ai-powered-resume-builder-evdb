import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  helperText,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-brand-gold dark:focus:ring-brand-gold focus:border-brand-gold bg-white dark:bg-dark-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500';

  const errorClasses = error
    ? 'border-red-400 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
    : 'border-gray-300 dark:border-dark-700 hover:border-brand-gold/50 dark:hover:border-brand-gold/50';

  const iconPadding = icon ? 'pl-11' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-brand-pirate-gold dark:text-brand-gold">
              {icon}
            </span>
          </div>
        )}
        <input
          className={`${baseClasses} ${errorClasses} ${iconPadding} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium animate-slide-down">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;