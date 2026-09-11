import { Tag } from "lucide-react";
import Badge from "../ui/Badge";

export default function CouponCard({ coupon, action }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-gold/50 bg-gold-light/40 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-light text-gold-dark">
          <Tag className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-ink">{coupon.code}</p>
          <p className="text-sm text-ink/60">
            {coupon.discount}% off
            {coupon.minOrder ? ` · min ₹${coupon.minOrder}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!coupon.active === false && <Badge text={coupon.active ? "Active" : "Expired"} tone={coupon.active ? "field" : "rust"} />}
        {action}
      </div>
    </div>
  );
}
