import { Review } from "@shared/schema";

interface ReviewsSliderProps {
  reviews: Review[];
}

export function ReviewsSlider({ reviews }: ReviewsSliderProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews available</p>
      </div>
    );
  }

  return (
    <div className="slider-container">
      <div className="slider-content">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 backdrop-blur-sm border border-blue-700/50 p-6 rounded-xl w-80 flex-shrink-0 shadow-lg" data-testid={`review-${review.id}`}>
            <div className="flex items-start mb-4">
              <img 
                src={review.avatarUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} 
                alt={review.name} 
                className="w-12 h-12 rounded-full mr-3 object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground text-base leading-tight">{review.name}</div>
                <div className="text-sm text-accent leading-tight whitespace-normal">{review.role}</div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed whitespace-normal">{review.content}</p>
            <div className="flex text-accent">
              {Array.from({ length: review.rating || 0 }, (_, i) => (
                <i key={i} className="fas fa-star text-sm"></i>
              ))}
            </div>
          </div>
        ))}
        
        {/* Duplicate reviews for seamless loop */}
        {reviews.map((review) => (
          <div key={`${review.id}-duplicate`} className="bg-gradient-to-br from-blue-900/80 to-blue-800/60 backdrop-blur-sm border border-blue-700/50 p-6 rounded-xl w-80 flex-shrink-0 shadow-lg">
            <div className="flex items-start mb-4">
              <img 
                src={review.avatarUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} 
                alt={review.name} 
                className="w-12 h-12 rounded-full mr-3 object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground text-base leading-tight">{review.name}</div>
                <div className="text-sm text-accent leading-tight whitespace-normal">{review.role}</div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed whitespace-normal">{review.content}</p>
            <div className="flex text-accent">
              {Array.from({ length: review.rating || 0 }, (_, i) => (
                <i key={i} className="fas fa-star text-sm"></i>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
