import { Box, Button, Typography, Collapse, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { DownloadButton } from "./download_nada";
import { PollCompute } from "./poll_compute";
import { PollStoreProgram } from "./poll_store_program";
import { PollComputeOutput } from "./poll_compute_output";

type PollProgramProps = {
    poll_id: string;  // Poll ID
    poll_store_ids: string[];
};
  
export const FetchStoreProgram: React.FC<PollProgramProps> = ({ poll_id, poll_store_ids }) => {
  const [programCode, setProgramCode] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Define the API URL (based on environment variables or hardcoded URL)
    const apiUrl = process.env.NEXT_PUBLIC_SECRET_POLLS_API_URL || "http://localhost:5000"; 
    const program_name = `poll_${poll_id}_program`;

  // Fetch poll program from backend
  const fetchPollProgram = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Call the Flask API to fetch the script
      const response = await fetch(`${apiUrl}/polls/${poll_id}/script`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProgramCode(data.script);
        setOpen(true); // Automatically show the code on successful fetch
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch poll program");
      }
    } catch (error) {
      setError("Something went wrong while fetching the poll program.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Button 
        variant="contained" 
        sx={{ backgroundColor: '#0D47A1', color: '#fff', '&:hover': { backgroundColor: '#1565C0' } }} 
        onClick={fetchPollProgram}
        disabled={loading}  // Disable the button while loading
      >
        {loading ? "Fetching..." : "Fetch Poll Program"}
      </Button>
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      
      {programCode && (
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="outlined" 
            sx={{ color: '#1976D2', borderColor: '#1976D2', '&:hover': { backgroundColor: '#E3F2FD' } }} 
            onClick={() => setOpen(!open)}
          >
            {open ? "Hide Program Code" : "Show Program Code"}
          </Button>
          
          <Collapse in={open}>
            <Card sx={{ mt: 2, backgroundColor: '#F5F5F5' }}>
              <CardContent>
                <Typography variant="body2" component="pre" sx={{ backgroundColor: "#1E1E1E", color: "#FFF", p: 2, borderRadius: 1 }}>
                  {programCode}
                </Typography>
              </CardContent>
            </Card>
          </Collapse>
          
                  <Box sx={{ m: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                  <DownloadButton poll_id={poll_id} />
                  <PollStoreProgram programName={program_name} />
                  <PollCompute poll_id={poll_id} poll_store_ids={poll_store_ids} program_name={program_name} />
                    <PollComputeOutput poll_id={poll_id} />
                    </Box>

        </Box>
      )}
    </Box>
  );
};
