"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress
} from "@mui/material";

export default function EditFacilityPage() {
  const { id } = useParams();
  const router = useRouter();
  const [facility, setFacility] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/facilities/${id}`)
      .then((res) => res.json())
      .then((data) => setFacility(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFacility({ ...facility, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:8000/api/facilities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(facility),
    });
    if (res.ok) router.push("/admin");
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Edit Fasilitas
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Nama"
        name="name"
        value={facility.name}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Deskripsi"
        name="description"
        value={facility.description}
        onChange={handleChange}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Simpan
      </Button>
    </Container>
  );
}
