"use client";

import { Box, Typography } from "@mui/material";

type PollProps = {
  question: string;
  options: string[];
  visibility: string;
  status: string;
};

const Poll: React.FC<PollProps> = ({ question, options, visibility, status }) => {
  return (
    <Box sx={{ p: 2, border: "1px solid grey", borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        {question}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Visibility: {visibility}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Status: {status}
      </Typography>
      <Box sx={{ mt: 2 }}>
        {options.map((option, index) => (
          <Typography key={index} variant="body1">
            {index + 1}. {option}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Poll;
