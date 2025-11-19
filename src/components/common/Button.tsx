import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = `
    font-semibold rounded-xl transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    inline-flex items-center justify-center gap-2
    transform hover:scale-[1.02] active:scale-[0.98]
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

    const variantStyles = {
        primary: `
      bg-gradient-to-r from-blue-500 to-indigo-600 
      hover:from-blue-600 hover:to-indigo-700 
      text-white shadow-lg shadow-blue-500/30
      focus:ring-blue-500
    `,
        secondary: `
      bg-white hover:bg-gray-50 
      text-gray-700 border border-gray-200
      shadow-sm hover:shadow
      focus:ring-gray-500
    `,
        danger: `
      bg-gradient-to-r from-red-500 to-rose-600 
      hover:from-red-600 hover:to-rose-700 
      text-white shadow-lg shadow-red-500/30
      focus:ring-red-500
    `,
        success: `
      bg-gradient-to-r from-emerald-500 to-teal-600 
      hover:from-emerald-600 hover:to-teal-700 
      text-white shadow-lg shadow-emerald-500/30
      focus:ring-emerald-500
    `,
        ghost: `
      bg-transparent hover:bg-gray-100 
      text-gray-600 hover:text-gray-900
      focus:ring-gray-500
    `,
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Cargando...</span>
                </span>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;