"use client";

import React, { useState } from "react";
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
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";


export default function AdminRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "info" | "success" | "error" | "warning"
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Simpan token jika ingin langsung login
      localStorage.setItem("admin_token", data.token);

      setSnackbar({
        open: true,
        message: "Register berhasil! Redirecting...",
        severity: "success"
      });

      setTimeout(() => {
        router.push("/admin/login");
      }, 1500);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Registration error",
        severity: "error"
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
        sx={{ color: "#000000" }}
      >
        Register Admin
      </Typography>
      <Box component="form" onSubmit={handleRegister} sx={{ mt: 4 }}>
        <TextField
          label="Name"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
// Tambahkan ini di dalam form:
<FormControl fullWidth sx={{ mt: 2 }}>
  <InputLabel>Role</InputLabel>
  <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
    <MenuItem value="admin">Admin</MenuItem>
    <MenuItem value="manager">Manager</MenuItem>
    <MenuItem value="guest">Guest</MenuItem>
  </Select>
</FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
