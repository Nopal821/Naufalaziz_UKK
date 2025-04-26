"use client";
import React, { useState } from "react";
import {
  Container, TextField, Button, Typography, Snackbar, Alert, Box
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function CreateFacilityPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as "info" | "success" | "error" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:8000/api/facilities/buat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" // Explicitly ask for JSON
        },
        body: JSON.stringify({ name, description }),
      });
  
      // Handle non-JSON responses
      if (!res.headers.get('content-type')?.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} - ${text.substring(0, 100)}`);
      }
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }
  
      setSnackbar({ open: true, message: "Facility created successfully!", severity: "success" });
      setTimeout(() => router.push("/admin"), 1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create facility";
      console.error("Error details:", err);
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Tambah Fasilitas</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          label="Nama Fasilitas"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Deskripsi"
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          sx={{ mb: 3 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Simpan Fasilitas
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
