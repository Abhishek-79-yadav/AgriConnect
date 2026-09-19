import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, X } from "lucide-react";

import { fetchWishlistThunk, removeWishlistThunk } from "../../redux/thunks/wishlistThunk";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlistThunk());
  }, [dispatch]);

  return (
    <div>
      <PageHeader title="Wishlist" />

      {!items.length ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you like to find them here later."
          action={
            <Link to="/products">
              <Button>Browse products</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-line bg-card p-4">
              <Link to={`/products/${item.productId || item.id}`} className="font-display text-ink hover:text-gold-dark">
                {item.productName || item.name}
              </Link>
              <button
                onClick={() => dispatch(removeWishlistThunk(item.productId || item.id))}
                className="rounded p-1.5 text-ink/40 hover:bg-rust-light hover:text-rust"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
