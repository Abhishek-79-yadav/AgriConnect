import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCouponsThunk } from "../../redux/thunks/couponThunk";
import CouponCard from "../../components/cards/CouponCard";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

export default function Coupons() {
  const dispatch = useDispatch();
  const coupons = useSelector((state) => state.coupon.coupons);

  useEffect(() => {
    dispatch(fetchCouponsThunk());
  }, [dispatch]);

  return (
    <div>
      <PageHeader title="Available coupons" />

      {!coupons?.length ? (
        <EmptyState title="No coupons right now" description="Check back later for offers." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  );
}
