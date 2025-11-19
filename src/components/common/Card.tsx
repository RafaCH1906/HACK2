import { type ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
    gradient?: boolean;
    glass?: boolean;
}

const Card = ({
    children,
    className = '',
    onClick,
    hover = false,
    gradient = false,
    glass = false
}: CardProps) => {
    const baseStyles = `
    rounded-2xl p-6 
    transition-all duration-300 ease-out
    animate-fade-in
  `;

    const hoverStyles = hover ? `
    cursor-pointer 
    hover:shadow-xl hover:shadow-gray-200/50
    hover:-translate-y-1
    active:translate-y-0
  ` : '';

    const bgStyles = gradient
        ? 'bg-gradient-to-br from-white to-gray-50'
        : glass
            ? 'glass'
            : 'bg-white';

    const shadowStyles = 'shadow-lg shadow-gray-100/50 border border-gray-100/50';

    return (
        <div
            className={`${baseStyles} ${bgStyles} ${shadowStyles} ${hoverStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;