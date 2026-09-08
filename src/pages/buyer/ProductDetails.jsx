import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Leaf, ShoppingCart, Heart, MapPin, User, Mail, Package, Star } from "lucide-react";

import { fetchProductDetails } from "../../redux/thunks/productThunk";
import { addToCartThunk } from "../../redux/thunks/cartThunk";
import { addWishlistThunk } from "../../redux/thunks/wishlistThunk";
import {
  submitRatingThunk,
  fetchFarmerRatingsThunk,
  fetchFarmerRatingAverageThunk,
} from "../../redux/thunks/ratingThunk";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { getReviewsForProductApi } from "../../api/reviewApi";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [productReviews, setProductReviews] = useState([]);

  const { product, loading } = useSelector((state) => state.products);
  const { ratings, averageRating } = useSelector((state) => state.rating);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    getReviewsForProductApi(id)
      .then(setProductReviews)
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (product?.farmerId) {
      dispatch(fetchFarmerRatingsThunk(product.farmerId));
      dispatch(fetchFarmerRatingAverageThunk(product.farmerId));
    }
  }, [dispatch, product?.farmerId]);

  if (loading || !product) return <Loader label="Loading product..." full />;

  const name = product.productName || product.name;

  const handleAddToCart = async () => {
    const result = await dispatch(addToCartThunk({ productId: product.id, qty }));
    if (addToCartThunk.fulfilled.match(result)) {
      toast.success("Added to cart");
    } else {
      toast.error("Could not add to cart");
    }
  };

  const handleWishlist = async () => {
    const result = await dispatch(addWishlistThunk(product.id));
    if (addWishlistThunk.fulfilled.match(result)) {
      toast.success("Added to wishlist");
    } else {
      toast.error("Could not add to wishlist");
    }
  };

  // Direct buy: add to cart, then skip straight to checkout instead of
  // making the buyer visit the cart page as a separate step.
  const handleBuyNow = async () => {
    const result = await dispatch(addToCartThunk({ productId: product.id, qty }));
    if (addToCartThunk.fulfilled.match(result)) {
      navigate("/buyer/checkout");
    } else {
      toast.error("Could not start checkout");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error("Please add a short comment");
      return;
    }
    setSubmittingReview(true);
    const result = await dispatch(
      submitRatingThunk({ farmerId: product.farmerId, stars: reviewStars, comment: reviewComment.trim() })
    );
    setSubmittingReview(false);
    if (submitRatingThunk.fulfilled.match(result)) {
      toast.success("Review submitted");
      setReviewComment("");
      setReviewStars(5);
      dispatch(fetchFarmerRatingAverageThunk(product.farmerId));
    } else {
      toast.error(result.payload?.message || "Could not submit review");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 pb-24 sm:px-6 sm:py-6 sm:pb-6 md:pb-6">
      <Breadcrumb items={[{ label: "Products", to: "/products" }, { label: name }]} />

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg border border-line bg-card">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gold-light/40">
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gold text-card">
                <Leaf className="h-12 w-12" />
              </span>
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-2xl text-ink">{name}</h1>

          {(product.city || product.state) && (
            <p className="mt-1 flex items-center gap-1 text-sm text-ink/60">
              <MapPin className="h-4 w-4" />
              {[product.city, product.state].filter(Boolean).join(", ")}
            </p>
          )}

          <p className="mt-4 font-display text-3xl text-gold-dark">
            ₹{product.price}
            <span className="ml-1 text-sm font-normal text-ink/50">/ {product.unit?.toLowerCase() || "unit"}</span>
          </p>

          <p className="mt-1 flex items-center gap-1 text-sm text-ink/60">
            <Package className="h-4 w-4" />
            {product.quantity != null ? `${product.quantity} ${product.unit?.toLowerCase() || ""} available` : "Availability unknown"}
          </p>

          {product.farmerName && (
            <div className="mt-4 flex flex-col gap-2 rounded border border-line bg-paper p-3">
              <p className="flex items-center gap-2 text-sm text-ink">
                <User className="h-4 w-4 text-ink/50" />
                Sold by <span className="font-medium">{product.farmerName}</span>
              </p>
              {product.farmerEmail && (
                <a
                  href={`mailto:${product.farmerEmail}?subject=${encodeURIComponent(`Question about ${name}`)}`}
                  className="flex items-center gap-2 text-sm text-gold-dark hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  Contact farmer
                </a>
              )}
            </div>
          )}

          {product.description && <p className="mt-4 text-sm leading-relaxed text-ink/70">{product.description}</p>}

          <div className="mt-6 hidden items-center gap-3 md:flex">
            <div className="flex items-center rounded border border-line">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-ink/70 hover:bg-paper">−</button>
              <span className="px-3 text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 text-ink/70 hover:bg-paper">+</button>
            </div>

            <Button onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="h-4 w-4" /> Add to cart
            </Button>

            <Button onClick={handleBuyNow} variant="outline" className="flex-1">
              Buy now
            </Button>

            <Button variant="outline" onClick={handleWishlist}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile quantity stepper — the actual buy actions live in the
              fixed thumb-reach bar at the bottom of the screen instead. */}
          <div className="mt-6 flex items-center gap-3 md:hidden">
            <div className="flex items-center rounded border border-line">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-ink/70 hover:bg-paper">−</button>
              <span className="px-3 text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 text-ink/70 hover:bg-paper">+</button>
            </div>
            <button
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className="flex h-10 w-10 items-center justify-center rounded border border-line text-ink/70 hover:bg-paper"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          <Link to="/products" className="mt-6 inline-block text-sm text-gold-dark hover:underline">
            ← Back to products
          </Link>
        </div>
      </div>

      {/* Farmer rating summary + reviews */}
      {product.farmerId && (
        <div className="mt-10 border-t border-line pt-8">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl text-ink">Reviews for {product.farmerName}</h2>
            {averageRating != null && (
              <span className="flex items-center gap-1 text-sm text-ink/60">
                <Star className="h-4 w-4 fill-gold text-gold" />
                {averageRating.toFixed(1)} ({ratings.length})
              </span>
            )}
          </div>

          <div className="mt-4 rounded-lg border border-line bg-card p-4">
            <p className="text-sm font-medium text-ink">Leave a review</p>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setReviewStars(n)} aria-label={`${n} stars`}>
                  <Star className={`h-6 w-6 ${n <= reviewStars ? "fill-gold text-gold" : "text-line"}`} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How was this farmer's produce and service?"
              rows={3}
              className="mt-3 w-full rounded border border-line bg-paper p-2 text-sm text-ink outline-none focus:border-gold"
            />
            <Button onClick={handleSubmitReview} loading={submittingReview} className="mt-2">
              Submit review
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {ratings.length === 0 && <p className="text-sm text-ink/50">No reviews yet.</p>}
            {ratings.map((r) => (
              <div key={r.id} className="rounded border border-line bg-paper p-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`h-4 w-4 ${n <= r.stars ? "fill-gold text-gold" : "text-line"}`} />
                  ))}
                </div>
                {r.comment && <p className="mt-1 text-sm text-ink/70">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product reviews — separate from the farmer-level ratings above.
          Verified-purchase only: written from a delivered order's item
          (see buyer Orders page), not open to anyone visiting the page. */}
      <div className="mt-10 border-t border-line pt-8">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-ink">Product reviews</h2>
          {productReviews.length > 0 && (
            <span className="flex items-center gap-1 text-sm text-ink/60">
              <Star className="h-4 w-4 fill-gold text-gold" />
              {(productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)} (
              {productReviews.length})
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {productReviews.length === 0 && (
            <p className="text-sm text-ink/50">
              No reviews yet — reviews appear here once buyers who received this product leave one.
            </p>
          )}
          {productReviews.map((r) => (
            <div key={r.id} className="rounded border border-line bg-paper p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-gold text-gold" : "text-line"}`} />
                  ))}
                </div>
                <span className="text-xs text-ink/50">{r.buyerName}</span>
              </div>
              {r.comment && <p className="mt-1 text-sm text-ink/70">{r.comment}</p>}
              {r.farmerReply && (
                <div className="mt-2 rounded bg-card p-2 text-xs text-ink/70">
                  <span className="font-medium text-ink">Farmer's reply: </span>
                  {r.farmerReply}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* One-handed reach: primary actions pinned to the bottom of the
          screen on mobile instead of wherever they happen to fall in the
          page's scroll — stacked directly above the bottom nav bar. */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-card p-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] md:hidden">
        <Button onClick={handleAddToCart} variant="outline" className="flex-1">
          <ShoppingCart className="h-4 w-4" /> Add to cart
        </Button>
        <Button onClick={handleBuyNow} className="flex-1">
          Buy now
        </Button>
      </div>
    </div>
  );
}
