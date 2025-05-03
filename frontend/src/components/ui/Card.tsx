import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const Card = ({ className = '', children, ...props }: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;