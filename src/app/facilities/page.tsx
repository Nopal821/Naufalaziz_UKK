"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  Box,
  Stack
} from "@mui/material";
import Navbar from "@/components/Navbar";
import { Facility } from "@/types"; // sesuaikan path tipe

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as "info" | "success" | "error" | "warning" });
  const [darkMode, setDarkMode] = useState(true);
  const [showAppBar, setShowAppBar] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/facilities");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Facility[] = await res.json();
      setFacilities(data);
    } catch (e) {
      setError("Gagal memuat data fasilitas.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = facilities.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} showAppBar={showAppBar} />
      <Container sx={{ pt: 4, pb: 6 }}>
        <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 3 }}>
          Fasilitas Kami
        </Typography>

        <Box maxWidth={400} mx="auto" sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Cari fasilitas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </Box>

        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", mt: 8 }} />
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {filtered.map(fac => (
              <Grid size={{xs:12, sm:6, md:4}} key={fac.id}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8
                    }
                  }}
                >
                  {fac.image && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={fac.image}
                      alt={fac.name}
                      sx={{ borderTopRadius: 3 }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {fac.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: 60 }}>
                      {fac.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {filtered.length === 0 && (
              <Grid size={{xs:12}}>
                <Typography align="center" color="text.secondary">
                  Tidak ada fasilitas sesuai pencarian.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}

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
    </Box>
  );
}