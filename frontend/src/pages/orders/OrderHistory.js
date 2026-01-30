import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiLockClosed } from "react-icons/hi";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5174/api/order/MyOrders",
          { withCredentials: true },
        );
        setOrders(response.data);
        setFilteredOrders(response.data);
        setIsUnauthorized(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response && error.response.status === 401) {
          setIsUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (statusFilter !== "All") {
      result = result.filter(
        (o) => o.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }
    if (searchTerm) {
      result = result.filter(
        (o) =>
          o.id.toString().includes(searchTerm) ||
          o.items.some((item) =>
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }
    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  if (isUnauthorized && !loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] text-center px-4 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 max-w-sm w-full hover:shadow-2xl transition-all">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 p-5 rounded-full ring-8 ring-blue-50/50">
              <HiLockClosed className="text-5xl text-blue-600 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Access Restricted
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Please log in to your{" "}
            <span className="text-blue-600 font-semibold">E-ShopBuilder</span>{" "}
            account to view your personal order history.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <span>Sign In to Continue</span>
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">My Order History</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by ID or product..."
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none bg-white"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg text-center">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:border-blue-300 transition-all duration-300"
            >
              <div className="bg-gray-50 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-gray-200">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="font-bold text-gray-700">#{order.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date Placed
                  </p>
                  <p className="text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Total Amount
                  </p>
                  <p className="text-blue-600 font-bold">
                    €{order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center md:justify-end">
                  <span
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                      order.status.toLowerCase() === "paid"
                        ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                        : "bg-orange-100 text-orange-700 ring-1 ring-orange-200"
                    }`}
                  >
                    {order.status.toLowerCase() === "paid" && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-100">
                      <th className="pb-3 font-medium">Product Name</th>
                      <th className="pb-3 font-medium text-center">Qty</th>
                      <th className="pb-3 font-medium text-right">Price</th>
                      <th className="pb-3 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="text-sm">
                        <td className="py-4 text-gray-700 font-medium">
                          {item.productName}
                        </td>
                        <td className="py-4 text-center text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="py-4 text-right text-gray-600">
                          €{item.price.toFixed(2)}
                        </td>
                        <td className="py-4 text-right font-semibold text-gray-800">
                          €{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;