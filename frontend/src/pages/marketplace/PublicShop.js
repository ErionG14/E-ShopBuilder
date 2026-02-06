import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { HiBuildingStorefront, HiShoppingBag, HiChevronLeft } from "react-icons/hi2";

const PublicShop = () => {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShop = async () => {
      try {
        // Step 1: Translate Slug to Store Data (including ID 10)
        const storeRes = await axios.get(`http://localhost:5174/api/Store/BySlug/${slug}`);
        setStore(storeRes.data);

        // Step 2: Fetch Products using the resolved Store ID
        const productsRes = await axios.get(
          `http://localhost:5174/api/catalog/Store/${storeRes.data.id}`,
        );
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Error loading shop:", err);
      } finally {
        setLoading(false);
      }
    };
    loadShop();
  }, [slug]);

  if (loading) return <div className="p-20 text-center">Loading Shop Inventory...</div>;
  if (!store) return <div className="p-20 text-center text-red-500 font-bold">Shop Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header */}
      <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <HiBuildingStorefront className="text-3xl" />
            </div>
            <div>
              <Link to="/marketplace" className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1 mb-1 hover:underline">
                <HiChevronLeft /> Back to Marketplace
              </Link>
              <h1 className="text-3xl font-black text-gray-900">{store.name}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Product List */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center gap-2 mb-10">
          <HiShoppingBag className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="aspect-square bg-gray-100 rounded-2xl mb-5 overflow-hidden flex items-center justify-center text-gray-300">
                {product.imageUrl && product.imageUrl !== "test" ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : "No Image"}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{product.category}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-2">{product.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mt-1 mb-6">{product.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-2xl font-black text-gray-900">${product.price.toFixed(2)}</span>
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