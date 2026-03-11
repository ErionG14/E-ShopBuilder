import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  HiUsers,
  HiTrash,
  HiPencil,
  HiSearch,
  HiBadgeCheck,
  HiX,
  HiUserAdd,
  HiMenuAlt1,
} from "react-icons/hi";

const AdminDashboard = () => {
  const today = new Date().toISOString().split("T")[0];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // MODAL STATES
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    surname: "",
    address: "",
    birthdate: new Date().toISOString().split("T")[0],
    gender: "",
    phoneNumber: "",
    role: "User",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5174/api/identity/GetAllUsers",
        {
          withCredentials: true,
        },
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
        name: newUser.name,
        surname: newUser.surname,
        address: newUser.address || "",
        birthdate: newUser.birthdate,
        gender: newUser.gender || "",
        phoneNumber: newUser.phoneNumber || "",
        role: newUser.role,
      };

      await axios.post("http://localhost:5174/api/identity/AddUser", payload, {
        withCredentials: true,
      });

      toast.success("User created successfully!");
      setIsAddModalOpen(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        name: "",
        surname: "",
        address: "",
        birthdate: new Date().toISOString().split("T")[0],
        gender: "",
        phoneNumber: "",
        role: "User",
      });
      fetchUsers();
    } catch (err) {
      console.error("Payload Error:", err.response?.data);
      toast.error(err.response?.data?.Message || "Internal Server Error");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: editingUser.userName,
        email: editingUser.email,
        name: editingUser.name || "",
        surname: editingUser.surname || "",
        address: editingUser.address || "",
        birthdate: editingUser.birthdate || null,
        gender: editingUser.gender || "",
        phoneNumber: editingUser.phoneNumber || "",
        role: editingUser.role,
      };

      await axios.put(
        `http://localhost:5174/api/identity/UpdateUser/${editingUser.id}`,
        payload,
        { withCredentials: true },
      );
      toast.success("User updated successfully!");
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error("Error updating user");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5174/api/identity/DeleteUser/${userToDelete.id}`,
        { withCredentials: true },
      );
      toast.success("User deleted!");
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-400">Admin Panel</h1>
          <button
            className="lg:hidden text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <HiX size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center space-x-3 w-full p-3 bg-blue-600 rounded-xl font-medium">
            <HiUsers className="text-xl" />
            <span>User Management</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 w-full min-w-0">
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <HiMenuAlt1 size={26} className="text-gray-700" />
          </button>
          <h2 className="font-bold text-gray-800 text-lg">Dashboard</h2>
          <div className="w-10"></div>
        </div>

        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Users</h2>
            <p className="text-gray-500 text-sm">Manage registered accounts</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg active:scale-95"
            >
              <HiUserAdd className="text-xl" />
              <span>Add User</span>
            </button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase hidden md:table-cell">
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
                        className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === "Admin" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                      {u.address || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingUser({ ...u });
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"
                        >
                          <HiPencil size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(u);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                        >
                          <HiTrash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* DELETE MODAL */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiTrash className="text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Account?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure about <b>{userToDelete.userName}</b>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Update Account</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <HiX className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="p-3 bg-gray-50 border rounded-xl outline-none"
                  value={editingUser.userName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, userName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Email"
                  className="p-3 bg-gray-50 border rounded-xl outline-none"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="p-3 bg-gray-50 border rounded-xl outline-none"
                  value={editingUser.name || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="p-3 bg-gray-50 border rounded-xl outline-none"
                  value={editingUser.surname || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, surname: e.target.value })
                  }
                />
              </div>
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

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New User</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <HiX className="text-2xl" />
              </button>
            </div>
            <form
              onSubmit={handleAddUser}
              className="p-6 space-y-3 overflow-y-auto max-h-[80vh]"
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setNewUser({ ...newUser, surname: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Address"
                  className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setNewUser({ ...newUser, address: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setNewUser({ ...newUser, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="date"
                  max={today}
                  className="p-3 bg-gray-50 border rounded-xl outline-none text-xs"
                  onChange={(e) =>
                    setNewUser({ ...newUser, birthdate: e.target.value })
                  }
                />
                <select
                  className="p-3 bg-gray-50 border rounded-xl outline-none text-xs"
                  onChange={(e) =>
                    setNewUser({ ...newUser, gender: e.target.value })
                  }
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <select
                  className="p-3 bg-gray-50 border rounded-xl outline-none text-xs"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="User">User</option>
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
