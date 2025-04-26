// src/app/resepsionis/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { withAuthResepsionis } from "../../lib/withAuthResepsionis";
import { useRouter } from "next/navigation";

interface Reservasi {
  id: number;
  check_in: string;
  check_out: string;
  jumlah_tamu: number;
  status: string;
  catatan: string | null;
}

function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "success" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });
   const router = useRouter();
    const handleLogout = () => {
      localStorage.removeItem("admin_token");
      router.push("/resepsionis/login");
    };
  
    useEffect(() => {
      if (!localStorage.getItem("admin_token")) router.push("/resepsionis/login");
    }, [router]);
  const showSnackbar = (message: string, severity: typeof snackbar.severity) =>
    setSnackbar({ open: true, message, severity });

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

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/pemesanan")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => setReservations(json.data || []))
      .catch(() => showSnackbar("Gagal memuat reservasi.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reservations.filter((r) =>
    searchDate
      ? new Date(r.check_in).toISOString().slice(0, 10) === searchDate
      : true
  );

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 12,
        mb: 4,
        backgroundColor: "#fff",
        boxShadow: 3,
        borderRadius: 2,
        p: 4,
        minHeight: "100vh",
      }}
    >
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
         Resepsionis Dashboard
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
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{color:'#000000'}}>
        Daftar Reservasi
      </Typography>

      <Box mb={3}>
        <TextField
          label="Cari Berdasarkan Tanggal Check-in"
          type="date"
          fullWidth
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Typography textAlign="center">Tidak ada reservasi ditemukan.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Jumlah Tamu</TableCell>
                <TableCell>Catatan</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((resv) => (
                <TableRow key={resv.id}>
                  <TableCell>{resv.id}</TableCell>
                  <TableCell>
                    {new Date(resv.check_in).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(resv.check_out).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{resv.jumlah_tamu}</TableCell>
                  <TableCell>{resv.catatan || "-"}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        resv.status === "confirmed"
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {resv.status}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAccepted(resv.id)}
                      disabled={resv.status === "confirmed"}
                    >
                      Receive
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

// ─── wrap it with your auth‐check HOC ──────────────────────────────────────
export default withAuthResepsionis(MyReservationsPage);
