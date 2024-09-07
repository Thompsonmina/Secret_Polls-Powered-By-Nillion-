"use client";

import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button } from "@mui/material";
import { useState } from "react";

type ParticipantPollProps = {
  question: string;
  options: string[];
  status: string;   // Poll status (e.g., "active", "paused", "expired", "closed")
  user_id: string;  // User ID to identify the participant
  poll_id: string;  // Poll ID to identify the poll
};

export const ParticipantPollView: React.FC<ParticipantPollProps> = ({ question, options, status, user_id, poll_id }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null); // Track submission success

  const handleSubmit = async () => {
    if (!selectedOption) {
      console.log("No option selected");
      return;
    }

    try {
      // Simulate sending the vote to an API
    //   const response = await fetch("/api/submit-vote", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       user_id,
    //       poll_id,
    //       selected_option: selectedOption,
    //     }),
    //   });

    //   if (response.ok) {
    //     setSubmitSuccess(true);  // Mark submission as successful
    //     console.log("Vote submitted successfully");
    //   } else {
    //     throw new Error("Failed to submit vote");
        //   }

        console.log("submitted woohoo")
        setSubmitSuccess(true);
        

    } catch (error) {
      setSubmitSuccess(false);  // Mark submission as failed
      console.error("Error submitting vote:", error);
    }
  };

  // Determine if the poll is not active (paused, expired, or closed)
  const isPollInactive = status === "paused" || status === "expired" || status === "closed";

  return (
    <Box sx={{ p: 4, border: "1px solid", borderColor: "#1976D2", borderRadius: 2, backgroundColor: "#FFFFFF", boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom color="#1976D2">
        {question}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <RadioGroup
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              control={<Radio color="primary" />}
              label={option}
              disabled={isPollInactive}  // Disable individual radio buttons if the poll is inactive
            />
          ))}
        </RadioGroup>
      </Box>

      {/* Handle different poll statuses */}
      {status === "paused" && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          This poll is currently paused and cannot be voted on.
        </Typography>
      )}

      {status === "expired" && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          This poll has expired and is no longer open for voting.
        </Typography>
      )}

      {status === "closed" && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          This poll has reached the maximum number of participants and is now closed.
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 4 }}
        disabled={!selectedOption || isPollInactive}  // Disable button if no option selected or poll is inactive
      >
        Submit Vote
      </Button>

      {/* Display submission result */}
      {submitSuccess && (
        <Typography color="success" variant="body2" sx={{ mt: 2 }}>
          Your vote has been submitted successfully!
        </Typography>
      )}
      {submitSuccess === false && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          There was an issue submitting your vote. Please try again.
        </Typography>
      )}
    </Box>
  );
};
