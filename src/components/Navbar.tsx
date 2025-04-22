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
        {["/", "/room","/facilities"].map((href, i) => {
            const label =href === "/" ? "Home" : href.slice(1).charAt(0).toUpperCase() + href.slice(2);
            return (
                <Button
              key={href}
              component={Link}
              href={href}
              sx={{
                color: darkMode ? "#E0E0E0" : "#333333",
                textTransform: "none",
                ml: i === 0 ? 0 : 1,
                transition: "all 0.3s",
                "&:hover": {
                  color: "#3d74f3",
                  textShadow: "0 0 10px rgba(61,116,243,0.7)",
                  transform: "scale(1.05)",
                },
              }}
            >
              {label}
            </Button>
            );
        })}
        {session?.user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                src={session.user.image || undefined}
                alt={session.user.name || "Profile"}
                sx={{ width: 36, height: 36 }}
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
                component={Link}
                href="/my-reservations"
                onClick={handleMenuClose}
                sx={{
                  color: darkMode ? "#E0E0E0" : "#333333",
                  textTransform: "none",
                }}
              >
                Reservasi Saya
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: darkMode ? "#E0E0E0" : "#333333",
                  textTransform: "none",
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            onClick={() => signIn("google")}
            sx={{
              color: darkMode ? "#E0E0E0" : "#333333",
              ml: 2,
              textTransform: "none",
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
