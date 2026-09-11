import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Leaf, ShoppingCart } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { addToCartThunk } from "../../redux/thunks/cartThunk";

export default function ProductCard({ product, action }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = product.productName || product.name || "Unnamed product";
  const price = product.price ?? "-";
  const unit = product.unit?.toLowerCase() || "unit";

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const result = await dispatch(addToCartThunk({ productId: product.id, qty: 1 }));
    if (addToCartThunk.fulfilled.match(result)) {
      toast.success("Added to cart");
    } else {
      toast.error("Could not add to cart");
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    const result = await dispatch(addToCartThunk({ productId: product.id, qty: 1 }));
    if (addToCartThunk.fulfilled.match(result)) {
      navigate("/buyer/checkout");
    } else {
      toast.error("Could not start checkout");
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-line bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block aspect-[4/3] overflow-hidden bg-paper">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gold-light/40">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-card">
              <Leaf className="h-7 w-7" />
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${product.id}`} className="font-display text-base text-ink hover:text-gold-dark">
            {name}
          </Link>
          {product.category && <Badge text={product.category} tone="field" />}
        </div>

        {product.description && (
          <p className="line-clamp-2 text-sm text-ink/60">{product.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg text-gold-dark">
            ₹{price}
            <span className="ml-1 text-xs font-normal text-ink/50">/ {unit}</span>
          </span>
        </div>

        {action || (
          <div className="mt-2 flex gap-2">
            <Button onClick={handleAddToCart} variant="outline" className="flex-1 !py-1.5 text-xs">
              <ShoppingCart className="h-3.5 w-3.5" /> Add to cart
            </Button>
            <Button onClick={handleBuyNow} className="flex-1 !py-1.5 text-xs">
              Buy now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
