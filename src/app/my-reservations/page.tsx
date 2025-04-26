"use client"

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface Order {
  id: number;
  check_in: string;
  check_out: string;
  jumlah_tamu: number;
  status: string;
  catatan: string | null;
}

export default function MyReservationsPage() {
  const { data: session, status } = useSession();
  const [reservations, setReservations] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'error' | 'success' | 'info' | 'warning' }>({ open: false, message: '', severity: 'info' });
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | null>(null);

  const showSnackbar = (message: string, severity: typeof snackbar.severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAccepted = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/menerima/order/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "confirmed" }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: data.status } : r))
        );
        showSnackbar("Berhasil menerima reservasi", "success");
      } else {
        showSnackbar(data.message || "Gagal menerima.", "error");
      }
    } catch {
      showSnackbar("Error saat menerima reservasi.", "error");
    }
  };
  const handleCancelReservation = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/cancel/order/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
      if (response.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
        );
        showSnackbar("Reservasi berhasil dibatalkan", "success");
      } else {
        showSnackbar(`Gagal membatalkan reservasi: ${data.message || JSON.stringify(data)}`, "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Terjadi kesalahan saat membatalkan reservasi.", "error");
    }
  };
  
  const handleDeleteOrder = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/delete/order/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
        showSnackbar("Pesanan berhasil dihapus", "success");
      } else {
        showSnackbar(`Gagal menghapus pesanan: ${data.message || JSON.stringify(data)}`, "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Terjadi kesalahan saat menghapus pesanan.", "error");
    }
  };
  

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8000/api/pemesanan/user/${session.user.id}`)
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(json => setReservations(Array.isArray(json.data) ? json.data : []))
      .catch(() => showSnackbar('Gagal memuat reservasi.', 'error'))
      .finally(() => setLoading(false));
  }, [session, status]);

  if (status === 'loading') return <Box display="flex" justifyContent="center" mt={10}><CircularProgress/></Box>;
  if (status !== 'authenticated') return (
    <Container sx={{ mt: 10, textAlign: 'center' }}><Typography variant="h6">Silakan login untuk melihat reservasi Anda.</Typography></Container>
  );

  return (
    <>
      <Navbar darkMode toggleDarkMode={() => {}} showAppBar />
      <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{color:'#000000'}}>
          Reservasi Saya
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}><CircularProgress/></Box>
        ) : reservations.length === 0 ? (
          <Typography color="warning.main">Tidak ada reservasi ditemukan.</Typography>
        ) : (
          <Stack spacing={3}>
            {reservations.map(resv => (
              <Card key={resv.id} variant="outlined">
                <CardContent>
                  <Typography>Check‑in: {new Date(resv.check_in).toLocaleDateString()}</Typography>
                  <Typography>Check‑out: {new Date(resv.check_out).toLocaleDateString()}</Typography>
                  <Typography>Jumlah Tamu: {resv.jumlah_tamu}</Typography>
                  {resv.catatan && <Typography>Catatan: {resv.catatan}</Typography>}
                  <Typography sx={{
                      color:
                        resv.status === "confirmed"
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                   status: {resv.status}
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CreditCardIcon />}
                      onClick={() => { setSelectedReservationId(resv.id); setOpenPaymentModal(true); }}
                      disabled={resv.status === 'confirmed' || resv.status === 'cancelled'}
                    >
                      Bayar
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleCancelReservation(resv.id)}
                      disabled={resv.status !== 'confirmed'}
                    >
                      Batalkan
                    </Button>

                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteOrder(resv.id)}
                    >
                      Hapus
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={openPaymentModal} onClose={() => setOpenPaymentModal(false)}>
        <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={4} justifyContent="center" sx={{ py: 2 }}>
            <IconButton
              onClick={() => setPaymentMethod('card')}
              sx={{
                border: paymentMethod === 'card' ? '2px solid' : '1px solid',
                borderColor: paymentMethod === 'card' ? 'primary.main' : 'divider',
                borderRadius: 2,
                '&:hover': { bgcolor: 'primary.light' }
              }}
            >
              <CreditCardIcon fontSize="large" />
            </IconButton>
            <IconButton
              onClick={() => setPaymentMethod('wallet')}
              sx={{
                border: paymentMethod === 'wallet' ? '2px solid' : '1px solid',
                borderColor: paymentMethod === 'wallet' ? 'secondary.main' : 'divider',
                borderRadius: 2,
                '&:hover': { bgcolor: 'secondary.light' }
              }}
            >
              <AccountBalanceWalletIcon fontSize="large" />
            </IconButton>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentModal(false)}>Batal</Button>
          <Button variant="contained" disabled={!paymentMethod} onClick={() => {
            if (selectedReservationId) handleAccepted(selectedReservationId);
            setOpenPaymentModal(false);
          }}>
            Bayar Sekarang
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
