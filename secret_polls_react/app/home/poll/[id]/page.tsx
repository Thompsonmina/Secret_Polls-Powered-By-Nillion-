"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { usePoll } from "@/app/components/PollContext";
import { OwnerPollView, ParticipantPollView, PollResultView } from "@/app/components";

// Dummy function to simulate fetching poll data from an API
// const fetchPollData = async (pollId: string) => {
//   return {
//     question: "What is your favorite programming language?",
//     options: ["Python", "JavaScript", "Go", "Rust"],
//     expiry: "2024-12-01",
//     participantsCount: 75,
//     totalVotes: 100,
//     votes: [50, 30, 10, 10], // votes for each option
//     ownerId: "123", // Example owner ID
//     pollStatus: "active", // Can be "active" or "completed"
//     currentUserId: "1277893", // The current logged-in user
//   };
// };
const fetchPollData = async (pollId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/polls/${pollId}`);
      if (!response.ok) {
        throw new Error(`Error fetching poll with ID ${pollId}`);
      }
      const data = await response.json();
      setPoll(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

const PollPage = () => {
  const { id } = useParams();  // Get the poll ID from the dynamic route
  const { role, setRole, setPollStatus, setParticipantsCount, pollData} = usePoll();  // Access poll context

  if (!pollData) {
    return <Typography>Loading poll data...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Poll: {pollData.question}
      </Typography>

      {/* Conditional rendering based on the role from context */}
      {role === "owner" && (
        <OwnerPollView
          question={pollData.question}
          options={pollData.options}
          visibility="public"
          status={pollData.pollStatus}
          participantsCount={pollData.participantsCount}
          expiry={pollData.expiry}
        />
      )}

      {role === "participant" && (
        <ParticipantPollView
          question={pollData.question}
          options={pollData.options}
        />
      )}

      {role === "result" && (
        <PollResultView
          question={pollData.question}
          options={pollData.options.map((option: string, index: number) => ({
            option,
            votes: pollData.votes[index],
          }))}
          totalVotes={pollData.totalVotes}
          participantsCount={pollData.participantsCount}
        />
      )}
    </Box>
  );
};

export default PollPage;
