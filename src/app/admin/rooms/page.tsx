"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as "info"|"success"|"error"|"warning" });
  const router = useRouter();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/rooms');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Room[] = await res.json();
      setRooms(data);
    } catch (e: any) {
      setError('Gagal memuat data kamar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus kamar ini?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/rooms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSnackbar({ open: true, message: 'Kamar berhasil dihapus.', severity: 'success' });
      fetchRooms();
    } catch {
      setSnackbar({ open: true, message: 'Gagal menghapus kamar.', severity: 'error' });
    }
  };

  const filtered = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Container sx={{ my: 4 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid size={{xs:12, sm:8 ,md:9}}>
            <TextField
              label="Search by name"
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Grid>
         <Grid size={{xs:12, sm:4 ,md:3}}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/rooms/create')}
            >
              Tambah Kamar
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(room => (
              <Grid size={{xs:12, sm:6 ,md:4}} key={room.id}>
                <Card>
                  {room.image && (
                    <CardMedia
                      component="img"
                      height="160"
                      image={room.image}
                      alt={room.name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{room.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {room.description}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      Rp {room.price.toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => router.push(`/admin/rooms/${room.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(room.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

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
    </>
  );
}
