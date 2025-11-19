import { type ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

const Card = ({ children, className = '', onClick, hover = false }: CardProps) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-md p-6 ${hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''
                } ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;