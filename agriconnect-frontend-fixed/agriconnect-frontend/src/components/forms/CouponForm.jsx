import { useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

export default function CouponForm({ onSubmit, submitting = false }) {
  const [coupon, setCoupon] = useState({ code: "", discount: "", expiryDate: "" });

  const set = (field) => (e) => setCoupon({ ...coupon, [field]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(coupon);
      }}
      className="flex flex-col gap-4"
    >
      <Input
        label="Coupon code"
        required
        placeholder="e.g. WELCOME10"
        value={coupon.code}
        onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })}
      />

      <Input label="Discount (%)" type="number" min="0" max="100" required value={coupon.discount} onChange={set("discount")} />

      <Input label="Expiry date" type="date" required value={coupon.expiryDate} onChange={set("expiryDate")} />

      <Button type="submit" loading={submitting} className="mt-2 self-start">
        Create coupon
      </Button>
    </form>
  );
}
