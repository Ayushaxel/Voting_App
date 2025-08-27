import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const VoteCounts = () => {
const [votedRecords,setVotedRecords]=useState([]);
const [loading,setLoading]=useState(true);
const {APIURL} = useContext(AuthContext);


  // Fetch vote counts
  useEffect(() => {
    const fetchVoteCounts = async () => {
      try {
        const res = await fetch(`${APIURL}/candidate/vote/count`);
        if (!res.ok) throw new Error("Failed to fetch vote counts");
        const data = await res.json();
        // console.log("Vote Count API Response:", data);
        setVotedRecords(data.voteRecord);
      } catch (error) {
        console.error("Error fetching vote counts:", error);
      }finally{
        setLoading(false);
      }
    }

    fetchVoteCounts();

      //Auto-refresh every 5 seconds for live results
    const interval = setInterval(fetchVoteCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading vote counts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Vote Counts
      </h1>

      {votedRecords.length === 0 ? (
        <p className="text-center text-gray-600">No candidates found.</p>
      ) : (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <ul className="space-y-4">
            {votedRecords.map((candidate) => (
              <li
                key={candidate._id}
                className="flex justify-between items-center border-b last:border-none pb-2"
              >
                <span className="text-lg font-medium">{candidate.name}</span>
                <span className="text-green-600 font-bold">
                  {candidate.count || 0} Votes
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VoteCounts;
