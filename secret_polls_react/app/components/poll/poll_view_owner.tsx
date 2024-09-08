"use client";

import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import { ConcludePollModal } from "@/app/components";

type PollProps = {
  question: string;
  options: string[];
  visibility: string;
  status: string;
  participantsCount: number;
  expiry: string;
  poll_id: string;
};

export const OwnerPollView: React.FC<PollProps> = ({ question, options, visibility, status, participantsCount, expiry, poll_id }) => {
  const [isPaused, setIsPaused] = useState(status === "paused");
  const [isConcluded, setIsConcluded] = useState(status === "concluded");
  const [modalOpen, setModalOpen] = useState(false);


  const handlePauseResume = async () => {
    try {
      // Toggle pause state
      const newStatus = isPaused ? "active" : "paused";
  
      // Make an API call to update the poll status on the server
      const response = await fetch(`${process.env.NEXT_PUBLIC_SECRET_POLLS_API_URL}/polls/${poll_id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update poll status");
      }
  
      // Update the local state based on the new status
      setIsPaused(!isPaused);
      console.log("Poll status updated successfully.");
    } catch (error) {
      console.error("Error updating poll status:", error);
    }
  };
  
  const handleConclude = () => {
    // setIsConcluded(true); // Conclude the poll
    setModalOpen(true);  // Open the conclude poll modal
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <Box sx={{ p: 4, border: "1px solid", borderColor: "#1976D2", borderRadius: 2, backgroundColor: "#FFFFFF", boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom color="#1976D2">
        {question}
      </Typography>
      <Typography variant="body2" color="#64B5F6" gutterBottom>
        Visibility: {visibility}
      </Typography>
      <Typography variant="body2" color="#64B5F6" gutterBottom>
        Status: {status}
      </Typography>
      <Typography variant="body2" color="#64B5F6" gutterBottom>
       Current Participants: {participantsCount}
      </Typography>
      <Typography variant="body2" color="#64B5F6" gutterBottom>
        Expiry: {expiry}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="#212121">
          Poll Options:
        </Typography>
        {options.map((option, index) => (
          <Typography key={index} variant="body1" color="#212121">
            {index + 1}. {option}
          </Typography>
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        {!isConcluded ? (
          <>
            <Button
              variant="outlined"
              color={isPaused ? "success" : "secondary"}
              onClick={handlePauseResume}
              sx={{ mr: 2 }}
            >
              {isPaused ? "Resume Poll" : "Pause Poll"}
            </Button>
            <Button variant="contained" color="error" onClick={handleConclude} disabled={isConcluded}>
              Conclude Poll
            </Button>
          </>
        ) : (
          <Typography color="error" variant="body2">
            Poll has been concluded.
          </Typography>
        )}
      </Box>
      <ConcludePollModal open={modalOpen} handleClose={handleCloseModal} />
    </Box>
  );
};

