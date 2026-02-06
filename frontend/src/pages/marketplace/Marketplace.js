import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  HiBuildingStorefront,
  HiArrowRight,
  HiMagnifyingGlass,
} from "react-icons/hi2";

const Marketplace = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get("http://localhost:5174/api/Store/All");
        setStores(res.data);
      } catch (err) {
        console.error("Marketplace load error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const filtered = stores.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="p-20 text-center font-medium text-gray-500 animate-pulse">
        Opening Marketplace...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Marketplace
            </h1>
            <p className="text-gray-500 mt-1">
              Discover electronics shops powered by VoltX
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by shop name..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <HiBuildingStorefront className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {store.name}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-8 h-10">
                {store.description}
              </p>

              <Link
                to={`/shops/${store.slug}`}
                className="flex items-center justify-between bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all group-hover:scale-[1.02]"
              >
                <span>Visit Shop</span>
                <HiArrowRight className="text-xl" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
