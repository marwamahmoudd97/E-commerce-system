import React from 'react';
import { Star } from 'lucide-react';
import { cn } from './ui/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  className
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const stars = Array.from({ length: maxRating }, (_, i) => {
    const filled = rating >= i + 1;
    const partial = rating > i && rating < i + 1;
    const fillPercentage = partial ? ((rating - i) * 100) : (filled ? 100 : 0);

    return (
      <div key={i} className="relative">
        <Star className={cn(sizeClasses[size], "text-gray-300")} />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")} />
        </div>
      </div>
    );
  });

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {stars}
      {showNumber && (
        <span className="ml-1 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
