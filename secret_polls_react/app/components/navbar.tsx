"use client";

import { type FC } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import Link from "next/link";


export const Navbar: FC = () => {
  const router = useRouter();

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        {/* Title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
            Secret Polls
          </Link>
        </Typography>

        {/* Navigation Links */}
        <Box>
          <Button color="inherit">                      
            <Link href="home/create-poll" style={{ textDecoration: 'none', color: 'inherit' }}>
                Create A Poll
            </Link>
          </Button>
          <Button
            color="inherit"
            onClick={() => router.push("/my-polls")}
          >
            Show My Polls
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

