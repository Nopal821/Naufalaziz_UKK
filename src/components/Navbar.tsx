"Use client";


import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function Navbar() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(true);
  const [showAppBar, setShowAppBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(()=> {
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);

  },[]);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    signOut();
  };
  
  return (
    <AppBar
    position="fixed"
    sx={{
      backgroundColor: darkMode
        ? "rgba(34, 34, 34, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      transition: "transform 0.3s ease-in-out",
      transform: showAppBar ? "translateY(0)" : "translateY(-100%)",
      boxShadow: 3,
    }}
    >
          <Toolbar>
      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        color="inherit"
        sx={{ color: darkMode ? "#E0E0E0" : "#333333" }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      <Typography
        variant="h6"
        sx={{
          flexGrow: 1,
          fontWeight: "bold",
          color: darkMode ? "#E0E0E0" : "#333333",
        }}
      >
        Hotel Hebat
      </Typography>
      <Button
sx={{
color: darkMode ? "#E0E0E0" : "#333333",
transition: "all 0.3s",
"&:hover": {
color: "#3d74f3",
textShadow: "0 0 10px rgba(61,116,243,0.7)",
transform: "scale(1.05)",
},
}}
>
<Link href="/">Home</Link>
</Button>

<Button
sx={{
color: darkMode ? "#E0E0E0" : "#333333",
transition: "all 0.3s",
"&:hover": {
color: "#3d74f3",
textShadow: "0 0 10px rgba(61,116,243,0.7)",
transform: "scale(1.05)",
},
}}
>
        <Link href="/room">room</Link>
      </Button>
      <Button
sx={{
color: darkMode ? "#E0E0E0" : "#333333",
transition: "all 0.3s",
"&:hover": {
color: "#3d74f3",
textShadow: "0 0 10px rgba(61,116,243,0.7)",
transform: "scale(1.05)",
},
}}
>
        <Link href="/facilities">facilities</Link>
      </Button>
      {session ? (
        <Box
          sx={{
            color: darkMode ? "#E0E0E0" : "#333333",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
         <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
<Avatar
alt={session.user.name || "Profile"}
sx={{ width: 40, height: 40 }}
/>
</IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  sx: {
                    color: darkMode ? "#fff" : "#000",
                    backgroundColor: darkMode ? "#333" : "#fff",
                    borderRadius: 2,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                  },
                },
              }}
            >
             <MenuItem
    sx={{
      color: darkMode ? "#E0E0E0" : "#333333",
      display:"flex",
      alignItems: "center",
      gap: 2,
    }}
    component={Link}
    href="/my-reservations"
    onClick={handleMenuClose}
    >
        Reservasi Saya
    </MenuItem>

    <MenuItem sx={{
                  color: darkMode ? "#E0E0E0" : "#333333",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
  onClick={handleLogout}>Logout</MenuItem>
</Menu>

              </Box>
            ) : (
              <Button
  sx={{
    color: darkMode ? "#E0E0E0" : "#333333",
    transition: "all 0.3s",
    "&:hover": {
      color: "#3d74f3",
      textShadow: "0 0 10px rgba(61,116,243,0.7)",
      transform: "scale(1.05)",
    },
  }}
  color="inherit"
  onClick={() => signIn("google")}
>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
  );
}
