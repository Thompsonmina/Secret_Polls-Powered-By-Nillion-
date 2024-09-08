"use client";

import { type FC } from "react";
import { Memory as ComputeIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";

import {
  NadaValue,
  NadaValues,
  NamedValue,
  PartyName,
  ProgramBindings,
  ProgramId,
  StoreId,
} from "@nillion/client-core";
import { useNilCompute, useNillion } from "@nillion/client-react-hooks";

type ComputeProps = {
  poll_id: string;
  poll_store_ids: string[];  // Array of Store IDs to be used
  program_name: string;      // Program name (to be displayed)
};

export const PollCompute: FC<ComputeProps> = ({ poll_id, poll_store_ids, program_name }) => {
  const { client } = useNillion();
  const nilCompute = useNilCompute();
  
    console.log(poll_store_ids, "store ids")
  const handleClick = () => {
    if (!program_name) throw new Error("compute: program name required");

    const programId = `${client.userId}/${program_name}`; // Combine userId with program name to form the full program ID
    
    const bindings = ProgramBindings.create(ProgramId.parse(programId))
      .addInputParty(PartyName.parse("poll_owner"), client.partyId)
      .addOutputParty(PartyName.parse("poll_owner"), client.partyId);

    const values = NadaValues.create()
      .insert(NamedValue.parse("starting_val"), NadaValue.createSecretInteger(0));

    const storeIds = poll_store_ids.map((store_id) => StoreId.parse(store_id));

    console.log("started computing", { programId, storeIds });
    
    nilCompute.execute({ bindings, values, storeIds });
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "grey.400",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography variant="h5">Compute</Typography>
      <Typography variant="body2">
        Running program: {program_name}
      </Typography>
      <Typography variant="body2">
        Poll ID: {poll_id}
      </Typography>
      <Box sx={{ mb: 4 }} />

      <LoadingButton
        variant="outlined"
        sx={{ width: "150px", mt: 4 }}
        startIcon={<ComputeIcon />}
        loading={nilCompute.isLoading}
        onClick={handleClick}
        disabled={nilCompute.isLoading}
      >
        Compute
      </LoadingButton>
      <ul>
        <li>
          <Typography sx={{ mt: 2 }}>Status: {nilCompute.status}</Typography>
        </li>
        <li>
          <Typography sx={{ mt: 2 }}>
            Compute output id: {nilCompute.isSuccess ? nilCompute.data : "idle"}
          </Typography>
        </li>
      </ul>
    </Box>
  );
};
