"use client";

import { type FC, useState } from "react";
import { GetApp as GetIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";

import { useNilComputeOutput } from "@nillion/client-react-hooks";
import { ComputeOutputId } from "@nillion/client-core";

type ComputeOutputProps = {
  poll_id: string;  // Poll ID passed as a prop
};

export const PollComputeOutput: FC<ComputeOutputProps> = ({ poll_id }) => {
    const nilComputeOutput = useNilComputeOutput();
    const [computeId, setComputeId] = useState<ComputeOutputId | string>("");
    const apiUrl = process.env.NEXT_PUBLIC_SECRET_POLLS_API_URL;

    
    const handleClick = async () => {
        if (!computeId) throw new Error("compute-output: Compute id is required");
        nilComputeOutput.execute({ id: computeId });
    };

    let computeOutput = "idle";
    if (nilComputeOutput.isSuccess) {
        // 9f76de18-1120-4759-9e0e-c55b162e9b4d
        computeOutput = JSON.stringify(nilComputeOutput.data, (key, value) => {
            if (typeof value === "bigint") {
                return value.toString();
            }
            return value;
        });
      
        console.log(computeOutput)
      
        const parsedResult = {
            "option-1": computeOutput['option-1'] || "0",
            "option-2": computeOutput['option-2'] || "0",
            "option-3": computeOutput['option-3'] || "0",
            "option-4": computeOutput['option-4'] || "0",
        };

        console.log("Compute Output:", parsedResult);

        fetch(`${apiUrl}/polls/${poll_id}/store_result`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ result: parsedResult }),
          })
            .then((response) => {
              if (response.ok) {
                console.log("Result stored successfully");
              } else {
                return response.json().then((errorData) => {
                  console.error("Failed to store result:", errorData);
                });
              }
            })
            .catch((error) => {
              console.error("Error storing result:", error);
            })
    }

    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: "grey.400",
                borderRadius: 2,
                p: 2,
            }}
        >
            <Typography variant="h5">Compute Output</Typography>
            <Box sx={{ mb: 4 }} />

            {/* Input for Compute Output ID */}
            <TextField
                fullWidth
                label="Compute output ID"
                value={computeId}
                onChange={(e) => setComputeId(e.target.value)}
            />

            <LoadingButton
                variant="outlined"
                sx={{ width: "150px", mt: 4 }}
                startIcon={<GetIcon />}
                loading={nilComputeOutput.isLoading}
                onClick={handleClick}
                disabled={!computeId || nilComputeOutput.isLoading}
            >
                Fetch & Store Result
            </LoadingButton>

            <ul>
                <li>
                    <Typography sx={{ mt: 2 }}>Status: {nilComputeOutput.status}</Typography>
                </li>
                <li>
                    <Typography sx={{ mt: 2 }}>Output: {computeOutput}</Typography>
                </li>
            </ul>
        </Box>
    );
}
