// src/components/common/StarRating.tsx
import React from "react";
import { Star } from "lucide-react";

interface Props {
  rating?: number;
  totalReviews?: number;
  size?: number;
  showNumber?: boolean;
}

const StarRating: React.FC<Props> = ({ rating = 0, totalReviews, size = 16, showNumber = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`f-${i}`} size={size} className="text-yellow-400" />
        ))}
        {hasHalf && <Star key="half" size={size} className="text-yellow-400 opacity-70" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`e-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>

      {showNumber && (
        <div className="text-sm text-muted-foreground">
          {isFinite(rating) ? rating.toFixed(1) : "0.0"}
          {totalReviews ? ` · ${totalReviews}` : ""}
        </div>
      )}
    </div>
  );
};

export default StarRating;