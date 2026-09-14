import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { searchByNameApi } from "../../api/searchApi";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/ui/SearchBar";
import ProductCard from "../../components/cards/ProductCard";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (value) => {
    if (!value?.trim()) return;
    setLoading(true);
    try {
      const data = await searchByNameApi(value.trim());
      setResults(data);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  // Coming here from the navbar's search box (?q=...) should search
  // immediately, not leave the visitor staring at an empty results page.
  useEffect(() => {
    const q = searchParams.get("q");
    if (q?.trim()) handleSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <PageHeader title="Search products" />

      <SearchBar value={keyword} onChange={setKeyword} onSubmit={handleSearch} placeholder="Search by product name..." className="mb-6 max-w-md" />

      {loading ? (
        <Loader label="Searching..." />
      ) : !searched ? (
        <EmptyState title="Search for something" description="Try a product name, e.g. 'tomato'." />
      ) : !results.length ? (
        <EmptyState title="No results found" description={`Nothing matched "${keyword}".`} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
