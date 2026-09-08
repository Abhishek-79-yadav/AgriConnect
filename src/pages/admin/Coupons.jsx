import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import { fetchCouponsThunk, createCouponThunk } from "../../redux/thunks/couponThunk";
import CouponCard from "../../components/cards/CouponCard";
import CouponForm from "../../components/forms/CouponForm";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

export default function Coupons() {
  const dispatch = useDispatch();
  const coupons = useSelector((state) => state.coupon.coupons);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCouponsThunk());
  }, [dispatch]);

  const handleCreate = async (data) => {
    setSubmitting(true);
    const result = await dispatch(createCouponThunk(data));
    setSubmitting(false);

    if (createCouponThunk.fulfilled.match(result)) {
      toast.success("Coupon created");
      setOpen(false);
    } else {
      toast.error("Failed to create coupon");
    }
  };

  return (
    <div>
      <PageHeader
        title="Coupons"
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New coupon</Button>}
      />

      {!coupons?.length ? (
        <EmptyState title="No coupons yet" description="Create one to offer buyers a discount." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create coupon">
        <CouponForm onSubmit={handleCreate} submitting={submitting} />
      </Modal>
    </div>
  );
}
