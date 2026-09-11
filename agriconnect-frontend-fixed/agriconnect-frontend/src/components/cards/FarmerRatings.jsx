import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

import {
  fetchFarmerRatingsThunk,
  fetchFarmerRatingAverageThunk,
  submitRatingThunk,
} from "../../redux/thunks/ratingThunk";
import ROLES from "../../constants/roles";
import Button from "../ui/Button";

function StarRow({ value, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(value) ? "fill-gold text-gold" : "text-line"}
        />
      ))}
    </div>
  );
}

export default function FarmerRatings({ farmerId }) {
  const dispatch = useDispatch();
  const { ratings, averageRating, loading } = useSelector((state) => state.rating);
  const { token, user } = useSelector((state) => state.auth);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!farmerId) return;
    dispatch(fetchFarmerRatingsThunk(farmerId));
    dispatch(fetchFarmerRatingAverageThunk(farmerId));
  }, [dispatch, farmerId]);

  if (!farmerId) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    const result = await dispatch(submitRatingThunk({ farmerId, stars, comment }));
    setSubmitting(false);

    if (submitRatingThunk.fulfilled.match(result)) {
      toast.success("Thanks for your review!");
      setComment("");
      dispatch(fetchFarmerRatingAverageThunk(farmerId));
    } else {
      toast.error(result.payload?.message || "Could not submit review");
    }
  };

  return (
    <div className="mt-10 border-t border-line pt-6">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-lg text-ink">Farmer ratings & reviews</h2>
        {averageRating != null && (
          <span className="flex items-center gap-1.5 text-sm text-ink/70">
            <StarRow value={averageRating} />
            {averageRating.toFixed(1)} ({ratings.length})
          </span>
        )}
      </div>

      {user?.role === ROLES.BUYER && !!token && (
        <div className="mt-4 rounded-lg border border-line bg-card p-4">
          <p className="text-sm font-medium text-ink">Rate this farmer</p>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setStars(n)} aria-label={`${n} stars`}>
                <Star size={22} className={n <= stars ? "fill-gold text-gold" : "text-line"} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (optional)"
            maxLength={500}
            rows={3}
            className="mt-3 w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <Button onClick={handleSubmit} loading={submitting} className="mt-3">
            Submit review
          </Button>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {loading ? (
          <p className="text-sm text-ink/50">Loading reviews...</p>
        ) : !ratings.length ? (
          <p className="text-sm text-ink/50">No reviews yet.</p>
        ) : (
          ratings.map((r) => (
            <div key={r.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{r.buyerName}</span>
                <StarRow value={r.stars} size={14} />
              </div>
              {r.comment && <p className="mt-1.5 text-sm text-ink/70">{r.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
