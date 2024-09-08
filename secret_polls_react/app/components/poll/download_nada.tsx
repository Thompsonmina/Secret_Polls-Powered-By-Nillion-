import { Button } from "@mui/material";

export const DownloadButton: React.FC = () => {
  const handleDownload = () => {
    const mockBinary = new Blob([`Mock binary content`], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(mockBinary);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'poll_program_binary.nada');
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);  // Clean up
  };

  return (
    <Button
      variant="contained"
      sx={{ mt: 2, backgroundColor: '#388E3C', color: '#fff', '&:hover': { backgroundColor: '#4CAF50' } }}
      onClick={handleDownload}
    >
      Download Nada Binary
    </Button>
  );
};