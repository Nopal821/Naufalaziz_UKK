"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
} from "@mui/material";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface ReservasiButtonProps {
  roomId: number;
  checkIn: string;
  checkOut: string;
}

export default function ReservasiButton({
  roomId,
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
}: ReservasiButtonProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [jumlahTamu, setJumlahTamu] = useState(1);
  const [catatan, setCatatan] = useState("");
const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "info" | "warning" | "error" | "success",
  });
  const handleOpen = () => {
    setCheckIn(initialCheckIn);
    setCheckOut(initialCheckOut);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const showSnackbar = (message: string, severity: typeof snackbar.severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleReservasi = async () => {
   
    if (!session?.user?.id) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

   
    const userId = Number(session.user.id);

    try {
      const response = await fetch("http://localhost:8000/api/reservasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
          jumlah_tamu: jumlahTamu,
          status: "pending",
          catatan,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        
        handleClose();
        showSnackbar("Berhasil melakukan reservasi ", "success");
      return;
      } else {
        console.error(data);
        alert(`Gagal: ${data.message || JSON.stringify(data.errors)}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saat mengirim reservasi.");
    }
  };

  return (
    <>
      <Button
        variant="contained"
        fullWidth
        onClick={handleOpen}
        disabled={!session?.user?.id}   
        sx={{ mt: 2 }}
      >
        Reservasi Sekarang
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            Formulir Reservasi
          </Typography>
          <TextField
            label="Check-in"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <TextField
            label="Check-out"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
          <TextField
            label="Jumlah Tamu"
            type="number"
            fullWidth
            margin="normal"
            value={jumlahTamu}
            onChange={(e) => setJumlahTamu(Number(e.target.value))}
          />
          <TextField
            label="Catatan"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleReservasi}
            sx={{ mt: 2 }}
          >
            Kirim Reservasi
          </Button>
          
        </Box>
        
      </Modal>
      
    </>
    
  );
}
