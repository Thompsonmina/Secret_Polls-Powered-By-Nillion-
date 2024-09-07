"use client";

import { type FC, useState } from "react";
import { ClientWrapper, Login } from "@/app/components";
import { Box, CircularProgress } from "@mui/material";


const HomeLayout: FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const [authenticated, setAuthenticated] = useState(false);  // Manage authentication state here
  

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  console.log(authenticated)


  return <ClientWrapper>
        
    <Login onLoginSuccess={handleLoginSuccess} />
    {!authenticated ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />  {/* Show spinner until authenticated */}
        </Box>
      ) : (
        // When authenticated is true, render the children
        <Box>
          {children}
        </Box>
      )}
  </ClientWrapper>;
};

export default HomeLayout;
