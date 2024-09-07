"use client";

import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useState } from "react";

import { useNilStoreValue } from "@nillion/client-react-hooks";
import { useNilCompute, useNillion } from "@nillion/client-react-hooks";


type ParticipantPollProps = {
  question: string;
  options: string[];
  status: string;   // Poll status (e.g., "active", "paused", "expired", "closed")
  owner_user_id: string;  // User ID to identify the participant
  poll_id: string;  // Poll ID to identify the poll\
  current_participants: number;
};

export const ParticipantPollView: React.FC<ParticipantPollProps> = ({ question, options, status, owner_user_id, poll_id, current_participants }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null); // Track submission success
    const [loading, setLoading] = useState(false);
    const [storedId, setStoredId] = useState<string | null>(null);

    const nilStore = useNilStoreValue();
    const { client } = useNillion();



    const store_poll_response = (): any => {
        const option_val = options.indexOf(selectedOption) + 1
        console.log(option_val, "options man")
        const input_name = `poll_${poll_id}_p${current_participants + 1}_response`

        console.log("storing secret response", input_name)
        //   if (!secret) throw new Error("store-value: Value required");
        return nilStore.executeAsync({ name: input_name, data: option_val, ttl: 1 }!);
    }
    

  const handleSubmit = async () => {
    if (!selectedOption) {
        console.log("No option selected");
      return;
    }
      
      setLoading(true);  // Show spinner while executing

    try {
        // Execute the function and wait for the result
        const storeId = await store_poll_response()

        // Store the resulting ID or any data from the result

        setStoredId(storeId); 
        console.log("Stored ID:", storeId);

    } catch (error) {
        console.error("Error storing value:", error);
    } finally {
        setLoading(false);  // Hide spinner after the operation completes
    }
      
      

      
      
      
        
    
      let input_name = `poll_${poll_id}_p${current_participants + 1}_response`
      let party_id = client.partyId
      let party_name = `Participant{i}`
      let store_id = "blah blah"

    //   ## we need to give the val being stored compute permissions which means computing the program_id. Program id is just user_id/program_name
    // program name should be like
      let program_name = `poll_${poll_id}`

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

        <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            loading={loading}
            sx={{ mt: 4 }}
            disabled={!selectedOption || isPollInactive}  // Disable button if no option selected or poll is inactive
        >
        Submit Vote -- {nilStore.isSuccess ? nilStore.data : "idle"}
        </LoadingButton>
          

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
