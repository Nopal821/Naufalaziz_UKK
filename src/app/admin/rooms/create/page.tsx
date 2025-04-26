"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRouter } from 'next/navigation';

export default function CreateRoomPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as "info"|"success"|"error"|"warning" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price: parseFloat(price), image }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }
      setSnackbar({ open: true, message: 'Kamar berhasil ditambahkan.', severity: 'success' });
      setTimeout(() => router.push('/admin'), 1000);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Terjadi kesalahan.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ my: 4, maxWidth: 'sm' }}>
      <Typography sx={{color:"#000000"}}variant="h5" gutterBottom>
        Tambah Kamar Baru
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Nama Kamar"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <TextField
          label="Deskripsi"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          rows={3}
        />
        <TextField
          label="Harga"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
          {loading && (
            <CircularProgress size={24} sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }} />
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
