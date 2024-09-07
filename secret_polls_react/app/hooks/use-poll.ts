import { useParams } from "next/navigation";
import {  useState, useEffect } from "react";

// Define the types for the context

// Context provider component


// Custom hook to use the PollContext
export const usePoll = () => {
  const { id } = useParams();  // Get the poll ID from the dynamic route
  const [role, setRole] = useState<"owner" | "participant" | "result">("participant");
  const [pollStatus, setPollStatus] = useState<string>("active");
  const [participantsCount, setParticipantsCount] = useState<number>(0);
  const [pollData, setPollData] = useState<any>(null);

  
// Dummy function to simulate fetching poll data from an API
  const fetchPollData = async (pollId: string) => {
      return {
      id:4,
      question: "What is your favorite programming language?",
      options: ["Python", "JavaScript", "Go", "Rust"],
      expiry: "2024-12-01",
      participantsCount: 75,
      totalVotes: 100,
      votes: [50, 30, 10, 10], // votes for each option
      ownerId: "123", // Example owner ID
      pollStatus: "active", // Can be "active" or "completed" or closed or paused or expired
      currentUserId: "1277893", // The current logged-in user
      current_participants: 0
    };
  }

  useEffect(() => {
    if (id && typeof id == 'string') {
      fetchPollData(id).then((data) => {
        setPollData(data);  // Set the poll data

        
        // Determine the role based on API data
        if (data.pollStatus === "completed") {
          setRole("result");  // If poll is completed, show results
        } else if (data.ownerId === data.currentUserId) {
          setRole("owner");  // If current user is the owner, show owner view
        } else {
          setRole("participant");  // Otherwise, the user is a participant
        }

        // Update the poll status and participants count
        setPollStatus(data.pollStatus);
        setParticipantsCount(data.participantsCount);
      });
    }
  }, [id, setRole, setPollStatus, setParticipantsCount]);

  return {
    role,
    pollStatus,
    participantsCount,
    setRole,
    setPollStatus,
    setParticipantsCount,
    pollData
  };
};
