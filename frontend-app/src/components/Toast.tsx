import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-600 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 text-red-900 dark:text-red-100',
    warning: 'bg-brand-gold/10 dark:bg-brand-gold/5 border-2 border-brand-gold text-brand-yukon-gold dark:text-brand-gold',
    info: 'bg-brand-gold/10 dark:bg-brand-gold/5 border-2 border-brand-pirate-gold text-brand-yukon-gold dark:text-brand-gold'
  };

  const iconColors = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-brand-gold',
    info: 'text-brand-pirate-gold'
  };

  const Icon = icons[type];

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm w-full rounded-lg p-4 shadow-gold transition-all duration-300 transform backdrop-blur-sm
      ${colors[type]}
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 mt-0.5 mr-3 ${iconColors[type]}`} />
        <div className="flex-1">
          <h4 className="font-bold">{title}</h4>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
          className="ml-3 opacity-70 hover:opacity-100 transition-opacity hover:text-brand-gold"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;