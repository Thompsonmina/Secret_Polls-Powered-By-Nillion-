import { Button } from "@mui/material";
import { useState } from "react";

type DownloadButtonProps = {
  poll_id: string; // Pass the poll ID to the button
};

export const DownloadButton: React.FC<DownloadButtonProps> = ({ poll_id }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SECRET_POLLS_API_URL}/polls/${poll_id}/script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the binary file.");
      }

        // Convert the response to a Blob
      console.log(response)
      const binaryBlob = await response.blob();
      const url = URL.createObjectURL(binaryBlob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `poll_${poll_id}_program.nada.bin`); // Name of the downloaded file
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the object URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading binary file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      sx={{ mt: 2, backgroundColor: '#388E3C', color: '#fff', '&:hover': { backgroundColor: '#4CAF50' } }}
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? 'Downloading...' : 'Download Nada Binary'}
    </Button>
  );
};
