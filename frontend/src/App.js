import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/shared/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Footer from "./components/shared/Footer/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import SuccessPage from "./pages/success/SuccessPage";
import OrderHistory from "./pages/orders/OrderHistory";
import UserProfile from "./pages/profile/UserProfile";
import EditProfileForm from "./pages/profile/EditProfileForm";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";
import Marketplace from "./pages/marketplace/Marketplace";
import PublicShop from "./pages/marketplace/PublicShop";
import ProductManagement from "./pages/dashboard/ProductManagement";
import CartPage from "./pages/cart/CartPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Owner Dashboard - Specific to Store Management */}
                <Route element={<ProtectedRoute allowedRoles={["Owner"]} />}>
                  <Route path="/owner-dashboard" element={<OwnerDashboard />} />
                  <Route
                    path="/owner-products"
                    element={<ProductManagement />}
                  />
                  {/* <Route
                    path="/manage-my-products"
                    element={<ManageStoreProducts />}
                  /> */}
                </Route>

                {/* Admin Dashboard - Global Platform Management */}
                <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  {/* <Route path="/manage-users" element={<UserManagement />} /> */}
                </Route>

                {/* Common Protected Routes for everyone */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={["User", "Owner", "Admin"]} />
                  }
                ></Route>
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/shops/:slug" element={<PublicShop />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/edit-profile" element={<EditProfileForm />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
              <ToastContainer position="bottom-right" theme="colored" />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
