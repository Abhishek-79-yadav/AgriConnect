import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { addProductThunk } from "../../redux/thunks/farmerThunk";
import ProductForm from "../../components/forms/ProductForm";
import PageHeader from "../../components/common/PageHeader";

export default function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const submit = async (data) => {
    setSubmitting(true);
    const result = await dispatch(addProductThunk(data));
    setSubmitting(false);

    if (addProductThunk.fulfilled.match(result)) {
      toast.success("Product added");
      navigate("/farmer/products");
    } else {
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="max-w-xl">
      <PageHeader title="Add product" subtitle="List a new product for buyers to discover." />
      <div className="rounded-lg border border-line bg-card p-6">
        <ProductForm onSubmit={submit} submitting={submitting} />
      </div>
    </div>
  );
}
