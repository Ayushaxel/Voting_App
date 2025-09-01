import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Candidates = () => {
  const [candidateData, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user, APIURL } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch(`${APIURL}/candidate`);
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        // console.log("API Response:", data);
        setCandidates(data.candidates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [APIURL]);

  // Handle voting
  const handleVote = async (candidateId) => {
    try {
      const res = await fetch(`${APIURL}/candidate/vote/${candidateId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to cast vote");

      alert(data.message);
      navigate("/vote-counts");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Error state
  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  return (
    <div className="px-4 lg:px-24 py-24">
      <h1 className="text-3xl font-bold text-center mb-8">
        🗳️ Vote for Your Candidate
      </h1>

      {loading ? (
        <p className="text-center">Loading... Please wait</p>
      ) : candidateData.length === 0 ? (
        <p className="text-center">No candidates found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {candidateData.map((candidate) => (
            <div
              key={candidate._id}
              className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.party}</p>

              {token ? (
                <>
                  <button
                    onClick={() => handleVote(candidate._id)}
                    disabled={user?.isVoted}
                    className={`mt-3 px-4 py-2 bg-blue-500 text-white rounded ${
                      user?.isVoted
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    }`}
                  >
                    Vote
                  </button>
                  {user?.isVoted && (
                    <p className="text-sm text-red-500 mt-2">
                      You have already voted
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-red-500 mt-2">
                  Please login to vote
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Candidates;
