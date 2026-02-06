import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  HiTrash,
  HiShoppingBag,
  HiArrowRight,
  HiMinus,
  HiPlus,
  HiMapPin, // Added for the address icon
} from "react-icons/hi2";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: State for shipping address
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5174/api/cart/MyCart", {
        withCredentials: true,
      });
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // Safety check for address
    if (!address.trim()) {
      toast.warn("Please enter a shipping address before checking out.");
      return;
    }

    try {
      const orderItemsForBackend = cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      }));

      // STEP 1: Create Order using the dynamic address state
      const orderRes = await axios.post(
        `http://localhost:5174/api/Order/Checkout?address=${encodeURIComponent(address)}`,
        orderItemsForBackend,
        { withCredentials: true },
      );

      const newOrderId = orderRes.data.orderId;

      // STEP 2: Create Stripe Session
      const paymentData = {
        id: newOrderId,
        userId: cartItems[0]?.userId,
        orderItems: cartItems.map((item) => ({
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const paymentRes = await axios.post(
        "http://localhost:5174/api/Payments/Payment/create-checkout-session",
        paymentData,
        { withCredentials: true },
      );

      if (paymentRes.data.url) {
        window.location.href = paymentRes.data.url;
      }
    } catch (err) {
      console.error("Checkout process failed:", err);
      toast.error("Failed to process order. Please try again.");
    }
  };

  const handleUpdateQuantity = async (id, currentQty, change) => {
    const newQuantity = currentQty + change;
    if (newQuantity < 1) {
      handleRemoveItem(id);
      return;
    }

    try {
      await axios.put(
        `http://localhost:5174/api/cart/UpdateCart/${id}`,
        newQuantity,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        ),
      );
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Could not update quantity");
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5174/api/cart/DeleteCart/${id}`, {
        withCredentials: true,
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item removed");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-gray-500">
        Loading your cart...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-inter">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <HiShoppingBag className="text-2xl" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">
            Your Shopping Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-gray-300">
              Cart is Empty
            </h2>
            <Link
              to="/marketplace"
              className="text-blue-600 font-bold hover:underline"
            >
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 flex items-center gap-6 border border-gray-100 shadow-sm"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {item.productName}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity, -1)
                          }
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                          <HiMinus className="text-xs" />
                        </button>
                        <span className="px-4 font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity, 1)
                          }
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                          <HiPlus className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <HiTrash className="text-xl" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 sticky top-32 shadow-2xl">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                {/* NEW: Address Input Field */}
                <div className="mb-8">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">
                    Shipping Address
                  </label>
                  <div className="relative">
                    <HiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Street, City, Country"
                      required
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-400">
                      Total
                    </span>
                    <span className="text-3xl font-black text-blue-400">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-900/40"
                >
                  Checkout <HiArrowRight />
                </button>
                <p className="text-center text-[10px] text-gray-500 mt-6 uppercase tracking-widest font-bold">
                  Payments secured by Stripe
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
