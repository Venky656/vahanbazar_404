// src/components/vehicle/ReviewsSection.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
// Update the import path below if StarRating is located elsewhere
import StarRating from "../common/StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Review = {
  id: number;
  vehicle_id: string;
  user_id?: string | null;
  author_name?: string | null;
  rating: number;
  comment?: string | null;
  created_at: string;
};

async function fetchReviews(vehicleId: string) {
  if (!vehicleId) return [];
  const { data, error } = await supabase
    .from<Review>("reviews")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export default function ReviewsSection({ vehicleId }: { vehicleId: string }) {
  const qc = useQueryClient();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);

  const {
    data: reviews = [],
    isLoading
  } = useQuery<Review[]>({
    queryKey: ["vehicle_reviews", vehicleId],
    queryFn: () => fetchReviews(vehicleId),
    enabled: !!vehicleId,
  });

  const postMutation = useMutation<boolean, Error, { rating: number; comment: string }>({
    mutationFn: async (payload: { rating: number; comment: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user ?? null;
      const author_name = (user?.user_metadata as any)?.full_name ?? user?.email ?? "Guest";

      const { error } = await supabase.from("reviews").insert([
        {
          vehicle_id: vehicleId,
          user_id: user?.id ?? null,
          author_name,
          rating: payload.rating,
          comment: payload.comment,
        },
      ]);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicle_reviews", vehicleId] });
      qc.invalidateQueries({ queryKey: ["vehicle_ratings", vehicleId] });
      setComment("");
      setRating(0);
    },
  });

  const averageRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = () => {
    if (!rating || comment.trim().length < 3) {
      alert("Please add a rating (1-5) and a comment (min 3 chars).");
      return;
    }
    postMutation.mutate({ rating, comment });
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Customer rating</h3>
          <div className="mt-1">
            <StarRating rating={averageRating} totalReviews={reviews.length} />
          </div>
        </div>
        <div>
          <Button onClick={() => window.scrollTo({ top: window.scrollY + 300, behavior: "smooth" })}>
            Write a review
          </Button>
        </div>
      </div>

      <div className="bg-background border rounded-lg p-4">
        <h4 className="font-medium mb-2">Add your review</h4>

        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setRating(s)}
              aria-label={`Rate ${s} star`}
              className={`text-2xl ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}
            >
              ★
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-3"
        />

        <div className="flex items-center gap-3">
          <Button onClick={handleSubmit} disabled={postMutation.isPending}>
            {postMutation.isPending ? "Posting..." : "Submit Review"}
          </Button>
          {postMutation.isError && <div className="text-sm text-red-500">Error posting review</div>}
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div>Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div className="text-muted-foreground">No reviews yet. Be the first!</div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b pb-3">
              <div className="flex justify-between items-center">
                <div className="font-medium">{r.author_name ?? "Guest"}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-1">
                <StarRating rating={r.rating} showNumber={false} />
              </div>
              <p className="text-sm mt-2">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}