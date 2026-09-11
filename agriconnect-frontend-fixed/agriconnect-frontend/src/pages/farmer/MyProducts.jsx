import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { fetchMyProductsThunk, deleteProductThunk } from "../../redux/thunks/farmerThunk";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function MyProducts() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.farmer);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchMyProductsThunk());
  }, [dispatch]);

  const confirmDelete = async () => {
    const result = await dispatch(deleteProductThunk(toDelete.id));
    if (deleteProductThunk.fulfilled.match(result)) {
      toast.success("Product deleted");
    } else {
      toast.error("Failed to delete product");
    }
    setToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="My products"
        action={
          <Link to="/farmer/products/add">
            <Button><Plus className="h-4 w-4" /> Add product</Button>
          </Link>
        }
      />

      {loading ? (
        <Loader label="Loading your products..." />
      ) : !products.length ? (
        <EmptyState
          title="No products listed yet"
          description="Add your first product to start selling."
          action={
            <Link to="/farmer/products/add">
              <Button>Add product</Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-lg border border-line bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{product.productName || product.name}</td>
                  <td className="px-4 py-3 text-ink/70">₹{product.price}</td>
                  <td className="px-4 py-3 text-ink/70">{product.quantity ?? "-"} {product.unit?.toLowerCase()}</td>
                  <td className="px-4 py-3">
                    <Badge text={product.available === false ? "Unavailable" : "Available"} tone={product.available === false ? "rust" : "field"} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/farmer/products/${product.id}/edit`} className="rounded p-1.5 text-ink/50 hover:bg-paper hover:text-ink">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => setToDelete(product)} className="rounded p-1.5 text-rust hover:bg-rust-light">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete product?"
        message={`"${toDelete?.productName || toDelete?.name}" will be removed from your listings.`}
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
