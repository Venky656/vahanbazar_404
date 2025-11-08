import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

const VehicleReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  // Load reviews from Local Storage when page loads
  useEffect(() => {
    const storedReviews = localStorage.getItem("vehicleReviews");
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  // Save reviews to Local Storage whenever they change
  useEffect(() => {
    localStorage.setItem("vehicleReviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleAddReview = () => {
    if (!name || !comment || rating === 0) {
      alert("Please fill all fields before submitting!");
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      name,
      rating,
      comment,
    };

    setReviews([...reviews, newReview]);
    setName("");
    setComment("");
    setRating(0);
  };

  return (
    <Card className="p-6 mt-10 space-y-4">
      <h2 className="text-xl font-semibold">Customer Reviews</h2>

      {/* Show all reviews */}
      {reviews.length === 0 && (
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
      )}

      {reviews.map((rev) => (
        <Card key={rev.id} className="p-4">
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="font-medium">{rev.name}</p>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">{rev.comment}</p>
          </CardContent>
        </Card>
      ))}

      {/* Add new review */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Add Your Review</h3>
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 cursor-pointer ${
                i < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>
        <Button onClick={handleAddReview}>Submit Review</Button>
      </div>
    </Card>
  );
};

export default VehicleReviews;