import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-2.5 border-2 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-brand-gold dark:focus:ring-brand-gold focus:border-brand-gold bg-white dark:bg-dark-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-vertical custom-scrollbar';

  const errorClasses = error
    ? 'border-red-400 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
    : 'border-gray-300 dark:border-dark-700 hover:border-brand-gold/50 dark:hover:border-brand-gold/50';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
          {label}
        </label>
      )}
      <textarea
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
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

export default Textarea;