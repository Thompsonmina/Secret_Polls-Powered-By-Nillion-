"use client";

import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button } from "@mui/material";
import { useState } from "react";

type ParticipantPollProps = {
  question: string;
  options: string[];
};

export const ParticipantPollView: React.FC<ParticipantPollProps> = ({ question, options }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSubmit = () => {
    if (selectedOption) {
      console.log("Submitted Option:", selectedOption);
    } else {
      console.log("No option selected");
    }
  };

  return (
    <Box sx={{ p: 4, border: "1px solid", borderColor: "#1976D2", borderRadius: 2, backgroundColor: "#FFFFFF", boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom color="#1976D2">
        {question}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
          {options.map((option, index) => (
            <FormControlLabel key={index} value={option} control={<Radio color="primary" />} label={option} />
          ))}
        </RadioGroup>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 4 }}
        disabled={!selectedOption}
      >
        Submit Vote
      </Button>
    </Box>
  );
};

