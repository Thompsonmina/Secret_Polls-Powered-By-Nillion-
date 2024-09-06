"use client";

import { useState } from "react";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import dayjs from 'dayjs';  // Install if not already present for date handling


import { useNilCompute, useNillion } from "@nillion/client-react-hooks";
import {
    PartyName,
} from "@nillion/client-core";

  


export  function CreatePollForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [visibility, setVisibility] = useState("public");
  const [passcode, setPasscode] = useState(""); // For private poll passcode
  const [expiration, setExpiration] = useState(dayjs().add(3, 'day').format('YYYY-MM-DD')); // Default to 3 days
  const [participants, setParticipants] = useState(5); // Default participants is 5
    
  const { client } = useNillion();
  

    
   const apiUrl = process.env.NEXT_PUBLIC_SECRET_POLLS_API_URL;

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      console.log(client.partyId)
      console.log(client.userId)
    
    const pollData = {
      question,
      options,
      visibility,
      passcode: visibility === "private" ? passcode : null, // Only include passcode if it's private
      expiration,
      max_participants: participants,
      poll_owner_id: client.partyId
    };

    try {
        const response = await fetch(`${apiUrl}/polls`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pollData),
        });
    
        if (response.ok) {
          const result = await response.json();
          console.log("Poll created yooo:", result);
        } else {
          const errorData = await response.json();
          console.error("Error creating poll:", errorData);
        }
      } catch (error) {
        console.error("Error creating poll:", error);
    }
      
    console.log("Poll created:", pollData);
    // Send the data to the backend API
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      {/* Question Field */}
      <TextField
        label="Poll Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        inputProps={{ maxLength: 1000 }}
        required
        fullWidth
        multiline
        helperText={`${question.length}/1000`}
      />

      {/* Option Fields */}
      {options.map((option, index) => (
        <TextField
          key={index}
          label={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          inputProps={{ maxLength: 500 }}
          required
          fullWidth
          multiline
          helperText={`${option.length}/500`}
        />
      ))}

      {/* Visibility Field */}
      <TextField
        select
        label="Visibility"
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
        fullWidth
        required
      >
        <MenuItem value="public">Public</MenuItem>
        <MenuItem value="private">Private</MenuItem>
        <MenuItem value="link_public">Anyone with Link (Public)</MenuItem>
        <MenuItem value="link_private">Anyone with Link (Private)</MenuItem>
      </TextField>

      {/* Conditionally show Passcode if Visibility is Private */}
      {visibility === "private" && (
        <TextField
          label="Passcode for Private Poll"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          inputProps={{ maxLength: 20 }} // Assuming passcodes have a length limit
          required
          fullWidth
          helperText="Enter a passcode to secure your private poll"
        />
      )}

      {/* Expiration Field */}
      <TextField
        label="Poll Expiration Date"
        type="date"
        value={expiration}
        onChange={(e) => setExpiration(e.target.value)}
        fullWidth
        required
        helperText="Choose when the poll expires (default: 3 days)"
        InputLabelProps={{
          shrink: true, // To ensure the label stays visible
        }}
      />

      {/* Number of Participants Field */}
      <TextField
        label="Number of Participants"
        type="number"
        value={participants}
        onChange={(e) => setParticipants(Math.min(20, Math.max(1, parseInt(e.target.value, 10))))} // Min 1, max 20
        fullWidth
        required
        helperText="Max participants: 20"
        InputProps={{ inputProps: { min: 1, max: 20 } }}
      />

      {/* Submit Button */}
      <Button variant="contained" type="submit">
        Create Poll
      </Button>
    </Box>
  );
}
