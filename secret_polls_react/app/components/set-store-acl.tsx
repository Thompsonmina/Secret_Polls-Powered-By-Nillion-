"use client";

import { type FC, useState } from "react";
import { Save as SaveIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";

import { useNillion, useNilSetStoreAcl } from "@nillion/client-react-hooks";
import { StoreAcl, UserId } from "@nillion/client-core";

export const SetStoreAcl: FC = () => {
  const { client } = useNillion();
  const nilSetStoreAcl = useNilSetStoreAcl();
  const [id, setId] = useState<string>("");

  const handleClick = () => {
    if (!id) throw new Error("set-store-acl: Id is required");
    const other_userid = "4SZSub1FuvkVKrwEywdP5aLXSTCdd35U1n3TDRazjmvYKN6BK81gJrA1CkEPQFuhCbpKU19xaDhRmDNH6TF1w1sd"
    const acl = StoreAcl.createDefaultForUser(UserId.parse(other_userid));
    console.log(acl)
    nilSetStoreAcl.execute({ id, acl });
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
      <Typography variant="h5">Set Store Acl</Typography>
      <Box sx={{ mb: 4 }} />
      <TextField
        fullWidth
        label="Store identifier"
        value={id}
        onChange={(e) => {
          setId(e.target.value);
        }}
      />
      <LoadingButton
        variant="outlined"
        sx={{ width: "150px", mt: 4 }}
        startIcon={<SaveIcon />}
        loading={nilSetStoreAcl.isLoading}
        onClick={handleClick}
        disabled={!id || nilSetStoreAcl.isLoading}
      >
        Set
      </LoadingButton>
      <ul>
        <li>
          <Typography sx={{ mt: 2 }}>
            Status: {nilSetStoreAcl.status}
          </Typography>
        </li>
        <li>
          <Typography sx={{ mt: 2 }}>
            Id: {nilSetStoreAcl.isSuccess ? nilSetStoreAcl.data : "idle"}
          </Typography>
        </li>
      </ul>
    </Box>
  );
};
