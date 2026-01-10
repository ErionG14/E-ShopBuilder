import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/shared/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Footer from "./components/shared/Footer/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<div className="p-8 text-center">Login Page Placeholder</div>} />

                {/* Protected Routes Example */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
                  <Route path="/dashboard" element={<div className="p-8 text-center">Dashboard (Protected)</div>} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<div className="p-8 text-center">404 Not Found</div>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
