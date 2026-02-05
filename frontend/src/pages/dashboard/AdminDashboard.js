import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  HiUsers,
  HiTrash,
  HiPencil,
  HiSearch,
  HiBadgeCheck,
  HiX,
  HiUserAdd,
} from "react-icons/hi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // DELETE MODAL STATES
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // EDIT MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ADD USER STATES
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    role: "User",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5174/api/identity/GetAllUsers",
        { withCredentials: true },
      );
      setUsers(response.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: newUser.email,
        password: newUser.password,
        username: newUser.username,
        name: newUser.name || "New",
        surname: newUser.surname || "User",
        address: newUser.address || "",
        birthdate: newUser.birthdate ? newUser.birthdate : null,
        gender: newUser.gender || "",
        phoneNumber: newUser.phoneNumber || "",
        role: newUser.role,
      };

      await axios.post("http://localhost:5174/api/identity/AddUser", payload, {
        withCredentials: true,
      });

      toast.success("User created successfully!", {
        style: {
          background: "white",
          color: "#1f2937",
          fontWeight: "bold",
          borderRadius: "12px",
        },
        progressStyle: { background: "#22c55e" },
        icon: <HiBadgeCheck style={{ color: "#22c55e", fontSize: "24px" }} />,
      });

      setIsAddModalOpen(false);
      setNewUser({ username: "", email: "", password: "", role: "User" });
      fetchUsers();
    } catch (err) {
      const serverMessage =
        err.response?.data?.Message || "Check console for validation errors.";
      toast.error(serverMessage);
    }
  };

  const openEditModal = (user) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5174/api/identity/UpdateUser/${editingUser.id}`,
        {
          username: editingUser.userName,
          email: editingUser.email,
          name: editingUser.name || "",
          surname: editingUser.surname || "",
          address: editingUser.address || "",
          birthdate: editingUser.birthdate || null,
          gender: editingUser.gender || "",
          phoneNumber: editingUser.phoneNumber || "",
          role: editingUser.role,
        },
        { withCredentials: true },
      );

      toast.success("User updated successfully!", {
        style: {
          background: "white",
          color: "#1f2937",
          fontWeight: "bold",
          borderRadius: "12px",
        },
        progressStyle: { background: "#22c55e" },
        icon: <HiBadgeCheck style={{ color: "#22c55e", fontSize: "24px" }} />,
      });

      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user.");
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(
        `http://localhost:5174/api/identity/DeleteUser/${userToDelete.id}`,
        { withCredentials: true },
      );
      toast.success(`User '${userToDelete.userName}' deleted!`, {
        style: {
          background: "white",
          color: "#1f2937",
          fontWeight: "bold",
          borderRadius: "12px",
        },
        progressStyle: { background: "#22c55e" },
        icon: <HiBadgeCheck style={{ color: "#22c55e", fontSize: "24px" }} />,
      });
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-blue-400">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center space-x-3 w-full p-3 bg-blue-600 rounded-xl font-medium transition-all">
            <HiUsers className="text-xl" />
            <span>User Management</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Users</h2>
            <p className="text-gray-500 text-sm">
              Manage all registered accounts
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              <HiUserAdd className="text-xl" />
              <span>Add User</span>
            </button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                        {u.image ? (
                          <img
                            src={u.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          u.userName.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {u.userName}
                        </div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.role === "Admin"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {u.address || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <HiPencil />
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(u);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <HiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiTrash className="text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Account?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-800">
                  {userToDelete.userName}
                </span>
                ? This action is permanent.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New User</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <HiX className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  className="p-3 bg-gray-50 border rounded-xl outline-none"
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="p-3 bg-gray-50 border rounded-xl outline-none"
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none"
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="p-3 bg-gray-50 border rounded-xl outline-none"
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Surname"
                  className="p-3 bg-gray-50 border rounded-xl outline-none"
                  onChange={(e) =>
                    setNewUser({ ...newUser, surname: e.target.value })
                  }
                />
              </div>
              <select
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="User">User</option>
                <option value="Owner">Owner</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Update Account</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <HiX className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none"
                value={editingUser.userName}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, userName: e.target.value })
                }
              />
              <input
                type="email"
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
              <select
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
              >
                <option value="User">User</option>
                <option value="Owner">Owner</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;