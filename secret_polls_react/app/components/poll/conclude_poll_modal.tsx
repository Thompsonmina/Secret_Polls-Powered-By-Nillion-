import { Box, Button, Typography, Modal } from "@mui/material";
import { useState } from "react";
import { FetchStoreProgram } from "./fetch_store_program";

type ConcludePollModalProps = {
  open: boolean;
    handleClose: () => void;
    poll_id: string;
    poll_store_ids: string[];
};

export const ConcludePollModal: React.FC<ConcludePollModalProps> = ({ open, handleClose, poll_id, poll_store_ids }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '80%', bgcolor: 'background.paper', boxShadow: 24, p: 4, 
        maxHeight: '80vh', overflowY: 'auto' // Add scrollability and height restriction
      }}>
        <Typography id="modal-modal-title" variant="h4" component="h2" gutterBottom>
          Conclude Poll - Fetch Poll Program
        </Typography>
              <FetchStoreProgram poll_id={poll_id} poll_store_ids={poll_store_ids} />
      </Box>
    </Modal>
  );
};
