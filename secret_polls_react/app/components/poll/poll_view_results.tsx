"use client";

import { Box, Typography, LinearProgress } from "@mui/material";

type PollResultProps = {
  question: string;
  options: { option: string; votes: number }[];
  totalVotes: number;
  participantsCount: number;
};

export const PollResultView: React.FC<PollResultProps> = ({ question, options, totalVotes, participantsCount }) => {
  // Find the option with the most votes
  const maxVotes = Math.max(...options.map((opt) => opt.votes));
  
  return (
    <Box sx={{ p: 4, border: "1px solid", borderColor: "#1976D2", borderRadius: 2, backgroundColor: "#FFFFFF", boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom color="#1976D2">
        Poll Results: {question}
      </Typography>
      <Typography variant="body2" color="#64B5F6" gutterBottom>
        Total Participants: {participantsCount}
      </Typography>
      <Box sx={{ mt: 4 }}>
        {options.map((option, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="body1" color={option.votes === maxVotes ? "#FFC107" : "#212121"} sx={{ fontWeight: option.votes === maxVotes ? "bold" : "normal" }}>
              {option.option} - {option.votes} votes
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(option.votes / totalVotes) * 100}
              sx={{
                height: 10,
                backgroundColor: option.votes === maxVotes ? "#FFC107" : "#64B5F6",
                "& .MuiLinearProgress-bar": { backgroundColor: option.votes === maxVotes ? "#FFC107" : "#1976D2" },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PollResultView;
