"use client";

import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";

type PollProps = {
  question: string;
  options: string[];
  visibility: string;
  status: string;
  participantsCount: number;
  expiry: string;
};

export const OwnerPollView: React.FC<PollProps> = ({ question, options, visibility, status, participantsCount, expiry }) => {
  const [isPaused, setIsPaused] = useState(status === "paused");
  const [isConcluded, setIsConcluded] = useState(status === "concluded");

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false); // Resume the poll
    } else {
      setIsPaused(true); // Pause the poll
    }
  };

  const handleConclude = () => {
    setIsConcluded(true); // Conclude the poll
  };

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
        Participants: {participantsCount}
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
    </Box>
  );
};

