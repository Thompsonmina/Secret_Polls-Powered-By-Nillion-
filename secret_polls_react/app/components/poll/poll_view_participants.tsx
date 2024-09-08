"use client";

import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useState } from "react";

import { useNilStoreValue,  useNilSetStoreAcl, useNillion } from "@nillion/client-react-hooks";
import { StoreAcl, ProgramId, StoreId, UserId} from "@nillion/client-core";



type ParticipantPollProps = {
  question: string;
  options: string[];
  status: string;   // Poll status (e.g., "active", "paused", "expired", "closed")
  owner_user_id: string;  // User ID to identify the participant
  poll_id: string;  // Poll ID to identify the poll\
  current_participants: number;
  setPollStatus: (status: string) => void;
};

export const ParticipantPollView: React.FC<ParticipantPollProps> = ({ question, options, status, owner_user_id, poll_id, current_participants, setPollStatus }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null); // Track submission success
    const [loading, setLoading] = useState(false);
    const [storeId, setStoreId] = useState<string | null>(null);
    
  
    const { client } = useNillion();
    const nilStore = useNilStoreValue();
  const nilSetStoreAcl = useNilSetStoreAcl();
  
    
  const apiUrl = process.env.NEXT_PUBLIC_SECRET_POLLS_API_URL;
  
  const party_id = client.partyId;
  console.log(party_id, "observing party")

  console.log("Poll status:", status, "whatchu mean");




    const store_poll_response = async (): Promise<StoreId | null> =>{ 
        const option_val = options.indexOf(selectedOption) + 1
        console.log(option_val, "options man")
        const input_name = `poll_${poll_id}_p${current_participants + 1}_response`

        console.log("storing secret response", input_name)
        //   if (!secret) throw new Error("store-value: Value required");
        return nilStore.executeAsync({ name: input_name, data: option_val, ttl: 1 }!);
    }

  const add_compute_permissions_to_program = async (storeId: StoreId): Promise<void> => {
    const program_name = `poll_${poll_id}_program`
    const program_id = `${owner_user_id}/${program_name}`
    // const program_id = `${client.userId}/${program_name}`
    const other_userid = "4SZSub1FuvkVKrwEywdP5aLXSTCdd35U1n3TDRazjmvYKN6BK81gJrA1CkEPQFuhCbpKU19xaDhRmDNH6TF1w1sd"

    console.log(owner_user_id)
    // const program_id = `${client.userId}/poll_pls_program`
    // const program_id = `${other_userid}/poll_pls_program`
        

    // const acl = StoreAcl.create()
    const acl = StoreAcl.createDefaultForUser(UserId.parse(owner_user_id));
    const compute_acl = acl.allowCompute(UserId.parse(owner_user_id), ProgramId.parse(program_id))
    console.log(acl, "Acl")
    console.log(compute_acl, "Cacl")
        
    try {
      const result = await nilSetStoreAcl.executeAsync({ id: storeId, acl });
      console.log("Compute permissions set:", result);
    } catch (error) {
      console.error("Error setting compute permissions:", error);
    }

        console.log(storeId, "sid", program_id)

    }
    
  const handleSubmit = async () => {
    if (!selectedOption) {
      console.log("No option selected");
      return;
    }
  
    setLoading(true); // Show spinner while executing
  
    try {
      const _storeId = await store_poll_response(); // Wait for the StoreId from the poll response
  
      if (_storeId) {
        console.log("Stored ID:", _storeId);
        await add_compute_permissions_to_program(_storeId); // Use _storeId directly here
      } else {
        throw new Error("Failed to store response");
      }
  
      // Prepare the participant details to send in the API request
      const party_id = client.partyId;
      const party_name = `Participant${current_participants + 1}`;
      const store_id = _storeId.toString(); // StoreId as string
  
      console.log(party_id, party_name, store_id, "Sending to backend");
  
      // Make the POST request to add the participant to the backend
      const response = await fetch(`${apiUrl}/polls/${poll_id}/add_participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          party_id,
          party_name,
          store_id,
        }),
      });
  
      // Handle the response from the backend
      if (response.ok) {
        const data = await response.json();
        console.log("Participant added:", data);
        setSubmitSuccess(true); // Mark submission as successful
        setPollStatus("already_voted")
        console.log("why isnt status setting, come on")
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add participant");
      }

    } catch (error) {
      console.error("Error submitting vote:", error);
      setSubmitSuccess(false); // Mark submission as failed
    } finally {
      setLoading(false); // Hide spinner after the operation completes
    }
  };

  // Determine if the poll is not active (paused, expired, or closed)
  const isPollInactive = status === "paused" || status === "expired" || status === "closed" || status === "already_voted"

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

      {status === "already_voted" && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
         You have already participated in this poll.
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
