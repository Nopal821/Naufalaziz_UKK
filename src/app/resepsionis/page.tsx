"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import Link from "next/link";

interface reservasi {
  id: number;
  check_in: string;
  check_out: string;
  jumlah_tamu: number;
  status: string;
  catatan: string | null;
}

export default function MyReservationsPage() {
  const { data: session, status } = useSession();
  const [reservations, setReservations] = useState<reservasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "error" | "success" | "info" | "warning"; }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [darkMode, setDarkMode] = useState(true);
  const [showAppBar, setShowAppBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleClose = () => setOpen(false);

  const showSnackbar = (message: string, severity: typeof snackbar.severity) => {
    setSnackbar({ open: true, message, severity });
  };


  const handleAccepted = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/menerima/order/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "confirmed",
          }),
        });
      const data = await response.json();
      if (response.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: data.status } : r))
        );
        showSnackbar("Berhasil menerima reservasi", "success");
      } else {
        console.error(data);
        showSnackbar(`Gagal: ${data.message || JSON.stringify(data)}`, "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Error saat menerima reservasi.", "error");
    }
  };
  



  useEffect(() => {
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);
  
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) {
      setLoading(false);
      return;
    }
  
    fetch(`http://localhost:8000/api/pemesanan`, {
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        setReservations(Array.isArray(json.data) ? json.data : []);
      })
      .catch(err => {
        console.error(err);
        setSnackbar({ open: true, message: 'Gagal memuat reservasi.', severity: 'error' });
      })
      .finally(() => setLoading(false));
  }, [session, status]);
  

 
  if (status === "loading") {
    return (
      <>
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </>
    );
  }
  if (status !== "authenticated") {
    return (
      <>
    
        <Container sx={{ mt: 10, textAlign: "center" }}>
          <Typography variant="h6">Silakan login untuk melihat reservasi Anda.</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Reservasi
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : reservations.length === 0 ? (
          <Typography>Tidak ada reservasi ditemukan.</Typography>
        ) : (
          reservations.map((resv) => (
            <Card key={resv.id} sx={{ mb: 3 }}>
              <CardContent>
                {resv ? (
                  <>
                   
                    <Typography>
                      Check‑in: {new Date(resv.check_in).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      Check‑out: {new Date(resv.check_out).toLocaleDateString()}
                    </Typography>
                    <Typography>Jumlah Tamu: {resv.jumlah_tamu}</Typography>
                    {resv.catatan && <Typography>Catatan: {resv.catatan}</Typography>}
                    <Typography sx={{color: "#bf0808",}}>Status: {resv.status}</Typography>
                  </>
                ) : (
                  <Typography color="error">Data kamar tidak tersedia.</Typography>
                )}
           <Button onClick={() => handleAccepted(resv.id)}>
    Receive
  </Button>


              </CardContent>
            </Card>
          ))
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}


