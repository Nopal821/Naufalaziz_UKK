"use client";
declare module 'js-cookie';
import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as "info" | "success" | "error" | "warning" });

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:8000/api/admin/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ 
                email: email.trim().toLowerCase(), // Normalisasi email
                password: password
            }),
        });

        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || "Login gagal");
        }

        // Simpan token di 2 tempat
        Cookies.set("admin_token", data.token, { expires: 1 });
        localStorage.setItem("admin_token", data.token);
        
        router.push("/admin");
    } catch (error) {
        setSnackbar({
            open: true,
            message: error.message || "Terjadi kesalahan saat login",
            severity: "error"
        });
    }
};

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.replace("/admin"); // replace, agar tidak kembali ke login di back
    }
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" sx={{color:'#000000'}}>
        Login Admin
      </Typography>
      <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 4 }}>
        <TextField
          label="Email"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
