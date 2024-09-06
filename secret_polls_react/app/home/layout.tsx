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
        {children}
  </ClientWrapper>;
};

export default HomeLayout;
