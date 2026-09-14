import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import ProductForm from "../../components/forms/ProductForm";
import { updateProductThunk } from "../../redux/thunks/farmerThunk";
import PageHeader from "../../components/common/PageHeader";

export default function EditProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // The backend only exposes PUT /farmer/products/{id}/price — there is
  // no general "update product" route yet, so only the price field from
  // this form is actually persisted.
  const updateProduct = async (data) => {
    setSubmitting(true);
    const result = await dispatch(updateProductThunk({ id, price: data.price }));
    setSubmitting(false);

    if (updateProductThunk.fulfilled.match(result)) {
      toast.success("Price updated");
      navigate("/farmer/products");
    } else {
      toast.error("Failed to update price");
    }
  };

  return (
    <div className="max-w-xl">
      <PageHeader title="Edit product" />

      <div className="mb-4 rounded border border-gold/40 bg-gold-light/40 px-4 py-3 text-sm text-gold-dark">
        Only price changes are saved right now — the backend doesn't yet support editing name, description, or stock after creation.
      </div>

      <div className="rounded-lg border border-line bg-card p-6">
        <ProductForm onSubmit={updateProduct} submitting={submitting} />
      </div>
    </div>
  );
}
