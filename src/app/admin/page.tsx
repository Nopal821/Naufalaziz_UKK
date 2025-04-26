"use client";
import React, { useEffect, useState } from "react";
import {
  Container, Grid, Card, CardMedia, CardContent, CardActions,
  Typography, Button, CircularProgress, TextField, Snackbar, Alert, Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { withAuth } from '../../lib/withAuth';

interface Room { id: number; name: string; description: string; price: number; image: string | null; }
interface Facility { id: number; name: string; description: string; }

type ActiveTable = "rooms" | "facilities";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [search, setSearch] = useState("");
  const [activeTable, setActiveTable] = useState<ActiveTable>("rooms");
  const [snackbar, setSnackbar] = useState({ open:false, message:"", severity:"info" as "info"|"success"|"error"|"warning" });
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) router.push("/admin/login");
  }, [router]);

  useEffect(() => {
    setError(null);
    setSearch("");
    setLoading(true);

    const url = activeTable === "rooms"
      ? "http://localhost:8000/api/rooms"
      : "http://localhost:8000/api/facilities";

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (activeTable === "rooms") setRooms(data);
        else setFacilities(data);
      })
      .catch(() => setError(`Gagal memuat data ${activeTable}.`))
      .finally(() => setLoading(false));
  }, [activeTable]);

  const handleDelete = async (id:number) => {
    if (!confirm(`Hapus ${activeTable} ini?`)) return;
    const endpoint = activeTable === "rooms" ? "rooms" : "facilities";
    try {
      const res = await fetch(`http://localhost:8000/api/${endpoint}/${id}`, { method:"DELETE" });
      if (!res.ok) throw new Error();
      setSnackbar({ open:true, message:`${endpoint} berhasil dihapus.`, severity:"success" });
      setActiveTable(prev => prev); 
    } catch {
      setSnackbar({ open:true, message:`Gagal menghapus ${endpoint}.`, severity:"error" });
    }
  };

  const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
  const filteredFacilities = facilities.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
    }
  }, []);
  return (
    
    <Container sx={{ my: 5, maxWidth: "xl" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" sx={{color:'#000000'}}>
        Dashboard Admin - {activeTable === "rooms" ? "Kamar" : "Fasilitas"}
      </Typography>
      <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  sx={{
    mb: 4,
    p: 2,
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    borderRadius: 2,
  }}
>
  <Typography variant="h5" fontWeight="bold" color="primary">
    Admin Dashboard
  </Typography>
  <Button
    variant="text"
    size="small"
    onClick={handleLogout}
    sx={{
      color: "#d32f2f",
      fontWeight: "bold",
      textTransform: "none",
      "&:hover": {
        backgroundColor: "transparent",
        color: "#b71c1c",
      },
    }}
  >
    Logout
  </Button>
</Box>


      <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Grid size={{xs:12 , sm:6}}>
          <TextField
            label="Cari berdasarkan nama"
            fullWidth
            variant="outlined"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Grid>
        <Grid size={{xs:12 , sm:3}}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push(`/admin/${activeTable}/create`)}
          >
            Tambah {activeTable === "rooms" ? "Kamar" : "Fasilitas"}
          </Button>
        </Grid>
        <Grid size={{xs:12 , sm:3}}>
          <Box display="flex" gap={1}>
            <Button
              variant={activeTable === "rooms" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setActiveTable("rooms")}
              fullWidth
            >
              Kamar
            </Button>
            <Button
              variant={activeTable === "facilities" ? "contained" : "outlined"}
              color="secondary"
              onClick={() => setActiveTable("facilities")}
              fullWidth
            >
              Fasilitas
            </Button>
          </Box>
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto" }} />
      ) : error ? (
        <Typography color="error" textAlign="center">{error}</Typography>
      ) : activeTable === "rooms" ? (
        filteredRooms.length > 0 ? (
          <Grid container spacing={4}>
            {filteredRooms.map(room => (
               <Grid size={{xs:12 , sm:6 , md:4}} key={room.id}>
                <Card elevation={4} sx={{ borderRadius: 3 }}>
                  {room.image && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={room.image}
                      alt={room.name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{room.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{room.description}</Typography>
                    <Typography sx={{ mt: 1 }} fontWeight="bold" color="primary">Rp {room.price.toLocaleString()}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => router.push(`/admin/rooms/${room.id}/edit`)}>Edit</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(room.id)}>Hapus</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography textAlign="center">Tidak ada kamar ditemukan.</Typography>
        )
      ) : (
        filteredFacilities.length > 0 ? (
          <Grid container spacing={4}>
            {filteredFacilities.map(f => (
              <Grid size={{xs:12 , sm:6 , md:4}} key={f.id}>
                <Card elevation={4} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{f.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{f.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => router.push(`/admin/facilities/${f.id}/edit`)}>Edit</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(f.id)}>Hapus</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography textAlign="center">Tidak ada fasilitas ditemukan.</Typography>
        )
      )}
      

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}