"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Container, TextField, Button, Typography, CircularProgress
} from "@mui/material";

export default function EditRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState({ name: "", description: "", price: "", image: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/rooms/${id}`)
      .then(res => res.json())
      .then(data => setRoom(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: any) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:8000/api/rooms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room)
    });
    if (res.ok) router.push("/admin");
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>Edit Kamar</Typography>
      <TextField fullWidth margin="normal" label="Nama" name="name" value={room.name} onChange={handleChange} />
      <TextField fullWidth margin="normal" label="Deskripsi" name="description" value={room.description} onChange={handleChange} />
      <TextField fullWidth margin="normal" label="Harga" name="price" type="number" value={room.price} onChange={handleChange} />
      <TextField fullWidth margin="normal" label="Image URL" name="image" value={room.image} onChange={handleChange} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Simpan</Button>
    </Container>
  );
}
