import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl font-semibold tracking-[0.01em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary-950 text-white hover:bg-primary-900 focus:ring-primary-400 active:scale-[0.98]',
      secondary: 'bg-gold-100 text-primary-950 hover:bg-gold-200 focus:ring-gold-400 active:scale-[0.98]',
      outline: 'border-2 border-primary-200/90 text-primary-950 hover:bg-primary-50 focus:ring-primary-400 active:scale-[0.98]',
      ghost: 'text-primary-950 hover:bg-primary-50 focus:ring-primary-500',
      gold: 'bg-gradient-to-r from-gold-500 to-gold-600 text-primary-950 hover:from-gold-600 hover:to-gold-700 focus:ring-gold-400 active:scale-[0.98] shadow-gold',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
