"use client";

import { Box, Typography } from "@mui/material";
import { CreatePollForm } from "@/app/components";

  

export default function CreatePollPage() {
  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create a New Secret Poll
          </Typography>
      <CreatePollForm />
    </Box>
  );
}
