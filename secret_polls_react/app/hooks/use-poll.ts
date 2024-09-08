import { useParams } from "next/navigation";
import {  useState, useEffect } from "react";
import { useNilStoreValue,  useNilSetStoreAcl, useNillion } from "@nillion/client-react-hooks";


// Define the types for the context

// Context provider component


// Custom hook to use the PollContext
export const usePoll = () => {
  const { id } = useParams();  // Get the poll ID from the dynamic route
  const [role, setRole] = useState<"owner" | "participant" | "result">("participant");
  const [pollStatus, setPollStatus] = useState<string>("active");
  const [participantsCount, setParticipantsCount] = useState<number>(0);
    const [pollData, setPollData] = useState<any>(null);
    
    const { client } = useNillion();


  
// Dummy function to simulate fetching poll data from an API
//   const fetchPollData = async (pollId: string) => {
//       return {
//       id:4,
//       question: "What is your favorite programming language?",
//       options: ["Python", "JavaScript", "Go", "Rust"],
//       expiry: "2024-12-01",
//       participantsCount: 75,
//       totalVotes: 100,
//       votes: [50, 30, 10, 10], // votes for each option
//       ownerId: "123", // Example owner ID
//       pollStatus: "active", // Can be "active" or "completed" or closed or paused or expired
//       currentUserId: "1277893", // The current logged-in user
//       current_participants: 0
//     };
//   }
    
  const fetchPollData = async (pollId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/polls/${pollId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch poll data');
      }
  
      const data = await response.json();
      
      // Format the options as an array (similar to the dummy data)
      return {
        id: data.id,
        question: data.question,
        options: [data.options.option_1, data.options.option_2, data.options.option_3, data.options.option_4],
        expiry: data.expiration,
        participantsCount: data.current_participants,
        totalVotes: data.max_participants, // You might want to adapt this according to how you're calculating votes
        pollStatus: data.status,
        ownerId: data.owner_id,
        votes: []
      };
    } catch (error) {
      console.error('Error fetching poll data:', error);
      return null;
    }
  };
  

  useEffect(() => {
    if (id && typeof id == 'string') {
      fetchPollData(id).then((data) => {
        if (data) {
          setPollData(data);  // Set the poll data
            
          console.log(data.ownerId, "ownerid")
          console.log(client.userId)
          // Determine the role based on API data
          if (data.pollStatus === "completed") {
            setRole("result");  // If poll is completed, show results
          } else if (data.ownerId === client.userId) {
              console.log(data.ownerId, "ownerid")
            setRole("owner");  // If current user is the owner, show owner view
          } else {
            setRole("participant");  // Otherwise, the user is a participant
          }
  
          // Update the poll status and participants count
          setPollStatus(data.pollStatus);
          setParticipantsCount(data.participantsCount);
        }
      }).catch(error => {
        console.error('Failed to fetch poll data:', error);
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
