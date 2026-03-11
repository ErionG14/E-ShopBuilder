import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  HiBuildingStorefront,
  HiPencil,
  HiTrash,
  HiPlusCircle,
  HiGlobeAlt,
  HiXMark,
  HiPlus,
} from "react-icons/hi2";
import { HiMenuAlt1 } from "react-icons/hi";

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [editingStore, setEditingStore] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const initialFormState = { name: "", slug: "", description: "" };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    try {
      const res = await axios.get("http://localhost:5174/api/Store/MyStore", {
        withCredentials: true,
      });
      setStores(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      if (err.response?.status === 404) {
        setStores([]);
      } else {
        toast.error("Error loading stores");
      }
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData(initialFormState);
    setIsCreateModalOpen(true);
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      slug: formData.slug.toLowerCase().trim().replace(/\s+/g, "-"),
    };
    try {
      await axios.post("http://localhost:5174/api/Store/Create", payload, {
        withCredentials: true,
      });
      toast.success("New store launched!");
      setIsCreateModalOpen(false);
      fetchMyStores();
    } catch (err) {
      toast.error("Failed to create store");
    }
  };

  const openEditModal = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      slug: store.slug,
      description: store.description,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5174/api/Store/Update/${editingStore.id}`,
        formData,
        { withCredentials: true },
      );
      toast.success("Store updated!");
      setIsEditModalOpen(false);
      fetchMyStores();
    } catch (err) {
      toast.error("Failed to update store");
    }
  };

  const handleToggleStatus = async (currentStore) => {
    const action = currentStore.isActive ? "Deactivate" : "Activate";
    try {
      await axios.patch(
        `http://localhost:5174/api/Store/${action}/${currentStore.id}`,
        {},
        { withCredentials: true },
      );
      toast.success("Store status updated!");
      fetchMyStores();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const confirmDeleteStore = async () => {
    if (!storeToDelete) return;
    try {
      await axios.delete(
        `http://localhost:5174/api/Store/Delete/${storeToDelete.id}`,
        { withCredentials: true },
      );
      toast.success("Store deleted successfully!");
      setIsDeleteModalOpen(false);
      setStoreToDelete(null);
      fetchMyStores();
    } catch (err) {
      toast.error("Failed to delete store");
    }
  };

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter overflow-x-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-400 tracking-tight">
            VoltX Owner
          </h1>
          <button
            className="lg:hidden text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <HiXMark size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/owner-dashboard"
            className="flex items-center space-x-3 w-full p-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/20"
          >
            <HiBuildingStorefront className="text-xl" />
            <span>My Stores</span>
          </Link>
          <Link
            to="/owner-products"
            className="flex items-center space-x-3 w-full p-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl font-medium group transition-all"
          >
            <HiPlusCircle className="text-xl group-hover:text-blue-400" />
            <span>Products Management</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 p-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-blue-400">
              OG
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Owner Account
            </span>
          </div>
        </div>
      </aside>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 w-full min-w-0">
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <HiMenuAlt1 size={26} className="text-gray-700" />
          </button>
          <h2 className="font-bold text-gray-800 text-lg">Owner Panel</h2>
          <div className="w-10"></div>
        </div>

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Store Management
            </h2>
            <p className="text-gray-500 text-sm">
              Manage your multi-store portfolio
            </p>
          </div>
          {stores.length > 0 && (
            <button
              onClick={openCreateModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95"
            >
              <HiPlus className="text-xl" />
              <span>New Store</span>
            </button>
          )}
        </header>

        {stores.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 shadow-sm">
            <HiPlusCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No Stores Yet</h3>
            <button
              onClick={openCreateModal}
              className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
            >
              Create Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {stores.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:border-blue-200 transition-all"
              >
                <div
                  className={`px-6 py-2 flex justify-between items-center text-xs font-bold uppercase tracking-wider ${s.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                >
                  <span>{s.isActive ? "Live" : "Hidden"}</span>
                  <button
                    onClick={() => handleToggleStatus(s)}
                    className="hover:underline"
                  >
                    {s.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <HiBuildingStorefront className="text-2xl" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {s.name}
                        </h3>
                        <div className="flex items-center text-gray-400 text-xs mt-0.5">
                          <HiGlobeAlt className="mr-1 flex-shrink-0" />
                          <span className="truncate">
                            voltx.com/shops/{s.slug}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1 flex-shrink-0">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <HiPencil size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setStoreToDelete(s);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <HiTrash size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">New Store</h3>
              <button onClick={() => setIsCreateModalOpen(false)}>
                <HiXMark className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleCreateStore} className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Store Name"
                required
                value={formData.name}
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="URL Slug"
                required
                value={formData.slug}
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
              >
                Launch Store
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Details</h3>
              <button onClick={() => setIsEditModalOpen(false)}>
                <HiXMark className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleUpdateStore} className="p-6 space-y-4">
              <input
                type="text"
                value={formData.name}
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <textarea
                value={formData.description}
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {isDeleteModalOpen && storeToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiTrash className="text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Store?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure? This action is permanent.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStore}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg"
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

export default OwnerDashboard;