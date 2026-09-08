import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from "../../components/cards/ProductCard";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/ui/SearchBar";
import Loader from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";

import { fetchProducts } from "../../redux/thunks/productThunk";

export default function Products() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filtered = products?.filter((p) =>
    (p.productName || p.name || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <PageHeader title="Fresh from the farm" subtitle="Browse produce listed directly by farmers." />

      <SearchBar value={query} onChange={setQuery} placeholder="Search products..." className="mb-6 max-w-sm" />

      {loading ? (
        <Loader label="Loading products..." />
      ) : error ? (
        <ErrorState message={typeof error === "string" ? error : "Failed to load products"} onRetry={() => dispatch(fetchProducts())} />
      ) : !filtered?.length ? (
        <EmptyState title="No products found" description="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
