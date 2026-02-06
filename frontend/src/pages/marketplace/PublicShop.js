import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  HiBuildingStorefront,
  HiChevronLeft,
  HiMagnifyingGlass,
  HiTag,
} from "react-icons/hi2";

const PublicShop = () => {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Static categories for now - eventually you can fetch these from your DB
  const categories = ["All", "Electronics", "Accessories", "Home", "Fashion"];

  useEffect(() => {
    const loadShop = async () => {
      try {
        const storeRes = await axios.get(
          `http://localhost:5174/api/Store/BySlug/${slug}`,
        );
        setStore(storeRes.data);

        // Fetching with both name and category filters
        const productsRes = await axios.get(
          `http://localhost:5174/api/catalog/Search`,
          {
            params: {
              name: searchTerm,
              category: selectedCategory === "All" ? "" : selectedCategory,
            },
          },
        );

        // Filter by this specific store
        const storeProducts = productsRes.data.data.filter(
          (p) => p.storeId === storeRes.data.id,
        );
        setProducts(storeProducts);
      } catch (err) {
        console.error("Error loading shop:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      loadShop();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [slug, searchTerm, selectedCategory]); // Automatically re-runs when category changes!

  if (loading && !store)
    return <div className="p-20 text-center font-bold">Loading Store...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <HiBuildingStorefront className="text-3xl" />
              </div>
              <div>
                <Link
                  to="/marketplace"
                  className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1 mb-1 hover:underline"
                >
                  <HiChevronLeft /> Back to Marketplace
                </Link>
                <h1 className="text-3xl font-black text-gray-900">
                  {store?.name}
                </h1>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <HiTag className="text-gray-400 mr-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === "All" ? "" : cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat ||
                  (cat === "All" && !selectedCategory)
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              {/* Product Content as before... */}
              <div className="aspect-square bg-gray-100 rounded-2xl mb-5 overflow-hidden flex items-center justify-center text-gray-300">
                {product.imageUrl && product.imageUrl !== "test" ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  "No Image"
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                {product.category}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-2">
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 mt-1 mb-6">
                {product.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-2xl font-black text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-600 transition-all active:scale-95">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PublicShop;