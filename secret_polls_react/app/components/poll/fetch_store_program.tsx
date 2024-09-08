import { Box, Button, Typography, Collapse, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { DownloadButton } from "./download_nada";

export const FetchStoreProgram: React.FC = () => {
  const [programCode, setProgramCode] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Mock fetching poll program from backend
  const fetchPollProgram = async () => {
    // Simulate fetching the code from the backend
    const mockProgramCode = `
    # Poll Program
    def poll_program():
      responses = fetch_responses()
      result = compute_result(responses)
      return result
    `;
    setProgramCode(mockProgramCode);
    setOpen(true);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Button 
        variant="contained" 
        sx={{ backgroundColor: '#0D47A1', color: '#fff', '&:hover': { backgroundColor: '#1565C0' } }} 
        onClick={fetchPollProgram}
      >
        Fetch Poll Program
      </Button>
      
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
          
          <DownloadButton />
        </Box>
      )}
    </Box>
  );
};