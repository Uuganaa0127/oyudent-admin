import { apiService } from "@/apiService/apiService";
import { useState, useEffect } from "react";
// import { useRouter } from "next/router";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
//   const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiService.callGet("user/list");
      console.log(response, "Fetched Users");
      setUsers(response || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await apiService.callDelete(`user/${id}`);
        alert("Deleted successfully!");
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete!");
      }
    }
  };

//   const handleUpdate = (id) => {
//     router.push(`/user/edit/${id}`);
//   };

//   const handleClientTime = (id) => {
//     router.push(`/client-time/${id}`);
//   };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Position</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Created</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.firstName}</td>
                <td className="py-2 px-4 border-b">{user.lastName}</td>
                <td className="py-2 px-4 border-b">{user.position}</td>
                <td className="py-2 px-4 border-b">{user.phone}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.type === 1 ? "Admin" : "Client"}
                </td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => handleUpdate(user.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                  >
                    Delete
                  </button>
                  {user.type === 2 && (
                    <button
                      onClick={() => handleClientTime(user.id)}
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-xs"
                    >
                      Client Time
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
