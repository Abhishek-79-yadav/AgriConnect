import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

import { getReviewsForFarmerApi, replyToReviewApi } from "../../api/reviewApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const load = () => {
    setLoading(true);
    getReviewsForFarmerApi()
      .then(setReviews)
      .catch(() => toast.error("Could not load reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submitReply = async (id) => {
    const reply = (replyDrafts[id] || "").trim();
    if (!reply) {
      toast.error("Write a reply first");
      return;
    }

    setSavingId(id);
    try {
      const updated = await replyToReviewApi(id, reply);
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success("Reply posted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not post reply");
    } finally {
      setSavingId(null);
    }
  };

  const average =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle={
          average
            ? `${average} average across ${reviews.length} review${reviews.length === 1 ? "" : "s"}`
            : "Reviews buyers leave on your products."
        }
      />

      {loading ? (
        <Loader label="Loading reviews..." />
      ) : !reviews.length ? (
        <EmptyState title="No reviews yet" description="Verified-purchase reviews on your products will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="flex flex-col gap-2 rounded-lg border border-line bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-ink">{r.productName}</h4>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-gold text-gold" : "text-line"}`} />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-ink/50">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                </span>
              </div>

              <p className="text-sm text-ink/70">
                <span className="font-medium text-ink">{r.buyerName}: </span>
                {r.comment || <span className="italic text-ink/40">No comment left.</span>}
              </p>

              {r.farmerReply ? (
                <div className="rounded bg-paper p-2 text-xs text-ink/70">
                  <span className="font-medium text-ink">Your reply: </span>
                  {r.farmerReply}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    value={replyDrafts[r.id] || ""}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))}
                    placeholder="Reply to this review..."
                    className="flex-1 rounded border border-line bg-paper px-2 py-1.5 text-sm text-ink outline-none focus:border-gold"
                  />
                  <Button size="sm" loading={savingId === r.id} onClick={() => submitReply(r.id)}>
                    Reply
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
