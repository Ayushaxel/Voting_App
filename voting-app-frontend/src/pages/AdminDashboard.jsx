import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { token, user,APIURL } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "", age: "" });
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch candidates
  const fetchCandidates = async () => {
    setLoading(true); 
    try {
      const res = await fetch(`${APIURL}/candidate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch candidates");
      }

      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  // Add candidate
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${APIURL}/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCandidate),
      });

      if (!res.ok) {
        throw new Error("Failed to add candidate");
      }

      alert("Candidate added successfully!");
      setNewCandidate({ name: "", party: "", age: "" });
      fetchCandidates();
    } catch (err) {
      console.error(err);
      alert("Failed to add candidate");
    }
  };

  // Update candidate
  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${APIURL}/admin/${editingCandidate._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingCandidate),
      });

      if (!res.ok) {
        throw new Error("Failed to update candidate");
      }

      alert("Candidate updated successfully!");
      setEditingCandidate(null);
      fetchCandidates();
    } catch (err) {
      console.error(err);
      alert("Failed to update candidate");
    }
  };

  // Delete candidate
  const handleDeleteCandidate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;

    try {
      const res = await fetch(`${APIURL}/candidate${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete candidate");
      }

      alert("Candidate deleted successfully!");
      fetchCandidates();
    } catch (err) {
      console.error(err);
      alert("Failed to delete candidate");
    }
  };

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 mt-12">
      <h1 className="text-3xl text-center font-bold mb-4">Admin Dashboard</h1>

      {/* Admin Profile */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-semibold">Admin Profile</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>  
      </div>

      {/* Add Candidate */}
      <div className="bg-green-100 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-semibold mb-2">Add New Candidate</h2>
        <form onSubmit={handleAddCandidate} className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Name"
            value={newCandidate.name}
            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Party"
            value={newCandidate.party}
            onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={newCandidate.age}
            onChange={(e) => setNewCandidate({ ...newCandidate, age: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Candidate
          </button>
        </form>
      </div>

      {/* Candidate List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Manage Candidates</h2>

        {loading ? (
          <p>Loading candidates...</p>
        ) : (
          <table className="w-full border border-gray-300 mt-3">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Party</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate._id}>
                  <td className="border p-2">{candidate.name}</td>
                  <td className="border p-2">{candidate.party}</td>
                  <td className="border p-2">{candidate.age}</td>
                  <td className="border p-2  flex flex-col gap-2 sm:flex-row  sm:justify-center">
                    <button
                      className="bg-yellow-400 px-3 py-1 rounded"
                      onClick={() => setEditingCandidate(candidate)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteCandidate(candidate._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Candidate Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-2">Edit Candidate</h2>
            <form onSubmit={handleUpdateCandidate} className="flex flex-col gap-3">
              <input
                type="text"
                value={editingCandidate.name}
                onChange={(e) =>
                  setEditingCandidate({ ...editingCandidate, name: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                value={editingCandidate.party}
                onChange={(e) =>
                  setEditingCandidate({ ...editingCandidate, party: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                value={editingCandidate.age}
                onChange={(e) =>
                  setEditingCandidate({ ...editingCandidate, age: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="bg-gray-400 px-3 py-1 rounded"
                  onClick={() => setEditingCandidate(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
