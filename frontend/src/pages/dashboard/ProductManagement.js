import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  HiShoppingBag,
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronDown,
  HiBuildingStorefront,
  HiPlusCircle,
  HiXMark,
  HiPhoto,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Form State
  const initialForm = {
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    category: "",
    imageUrl: "",
  };
  const [formData, setFormData] = useState(initialForm);

  const cloudName = "digigigcr";
  const uploadPreset = "EShopBuilder_uploads";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const res = await axios.get("http://localhost:5174/api/Store/MyStore", {
        withCredentials: true,
      });
      const storeData = Array.isArray(res.data) ? res.data : [res.data];
      setStores(storeData);
      if (storeData.length > 0) {
        setSelectedStore(storeData[0]);
        fetchProducts(storeData[0].id);
      }
    } catch (err) {
      toast.error("Could not load your stores");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (storeId) => {
    try {
      const res = await axios.get(
        `http://localhost:5174/api/catalog/Store/${storeId}`,
      );
      setProducts(res.data);
    } catch (err) {
      setProducts([]);
    }
  };

  // --- Cloudinary Logic ---
  const handleOpenWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        multiple: false,
        cropping: true,
        aspectRatio: 1,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData((prev) => ({
            ...prev,
            imageUrl: result.info.secure_url,
          }));
          toast.success("Image uploaded!");
        }
      },
    );
    widget.open();
  };

  // --- CRUD Operations ---
  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      storeId: selectedStore.id,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
    };

    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:5174/api/catalog/updateProduct/${editingProductId}`,
          payload,
          { withCredentials: true },
        );
        toast.success("Product updated!");
      } else {
        await axios.post(
          "http://localhost:5174/api/catalog/addProduct",
          payload,
          { withCredentials: true },
        );
        toast.success("Product added!");
      }
      closeModal();
      fetchProducts(selectedStore.id);
    } catch (err) {
      toast.error(isEditMode ? "Failed to update" : "Failed to add");
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(
        `http://localhost:5174/api/catalog/deleteProduct/${productToDelete.id}`,
        { withCredentials: true },
      );
      toast.success("Product removed");
      setIsDeleteModalOpen(false);
      fetchProducts(selectedStore.id);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // --- Modal Helpers ---
  const openEditModal = (product) => {
    setIsEditMode(true);
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingProductId(null);
    setFormData(initialForm);
  };

  if (loading)
    return (
      <div className="p-20 text-center">Loading Management Console...</div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter">
      {/* Sidebar - Remains the same */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-blue-400">VoltX Owner</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/owner-dashboard"
            className="flex items-center space-x-3 w-full p-3 text-gray-400 hover:bg-gray-800 rounded-xl font-medium"
          >
            <HiBuildingStorefront className="text-xl" />
            <span>My Stores</span>
          </Link>
          <Link
            to="/owner-products"
            className="flex items-center space-x-3 w-full p-3 bg-blue-600 rounded-xl font-semibold"
          >
            <HiPlusCircle className="text-xl" />
            <span>Products Management</span>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Inventory Management
            </h2>
            <div className="relative mt-4 inline-block">
              <select
                onChange={(e) => {
                  const store = stores.find(
                    (s) => s.id === parseInt(e.target.value),
                  );
                  setSelectedStore(store);
                  fetchProducts(store.id);
                }}
                value={selectedStore?.id}
                className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl font-bold text-blue-600 outline-none shadow-sm cursor-pointer hover:border-blue-300 transition-all"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg"
          >
            <HiPlus className="text-xl" />
            <span>Add New Product</span>
          </button>
        </header>

        {/* Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-8 py-4">Image</th>
                <th className="px-8 py-4">Product Details</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-8 py-5">
                    <img
                      src={p.imageUrl || "https://via.placeholder.com/50"}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                    />
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400 line-clamp-1">
                      {p.description}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold uppercase">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-8 py-5 font-bold text-sm">
                    {p.stockQuantity} units
                  </td>
                  <td className="px-8 py-5 flex gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <HiPencil />
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(p);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <HiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Main Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">
                  {isEditMode ? "Edit Product" : "Add Product"}
                </h3>
                <button onClick={closeModal} className="text-gray-400">
                  <HiXMark className="text-2xl" />
                </button>
              </div>

              <form
                onSubmit={handleAddOrUpdateProduct}
                className="grid grid-cols-2 gap-4"
              >
                {/* Cloudinary Upload Area */}
                <div className="col-span-2 border-2 border-dashed border-gray-200 rounded-3xl p-4 bg-gray-50 flex flex-col items-center">
                  {formData.imageUrl ? (
                    <div className="relative w-32 h-32">
                      <img
                        src={formData.imageUrl}
                        className="w-full h-full object-cover rounded-2xl"
                        alt="Preview"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, imageUrl: "" })
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <HiXMark />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenWidget}
                      className="flex flex-col items-center text-gray-400"
                    >
                      <HiPhoto className="text-4xl" />
                      <span className="text-xs font-bold uppercase">
                        Upload Image
                      </span>
                    </button>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Product Name
                  </label>
                  <input
                    required
                    className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Price
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none outline-none"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Stock
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none outline-none"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Category
                  </label>
                  <input
                    required
                    className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none outline-none"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Description
                  </label>
                  <textarea
                    className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none outline-none h-24 resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="col-span-2 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg mt-4"
                >
                  {isEditMode ? "Save Changes" : "Confirm & Upload"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiTrash className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Delete product?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to remove{" "}
              <span className="font-bold">{productToDelete?.name}</span>? This
              action is permanent.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;