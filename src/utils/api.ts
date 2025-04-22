export const fetchRooms = async (userid?: string)=> {
  try {
    const endpoint = userid
    ? 'http://127.0.0.1:8000/api/rooms?userId=${userId}'
    : 'http://127.0.0.1:8000/api/rooms';

    const response = await fetch(endpoint);

    if(!response.ok){
        throw new Error("Gagal mengambil data kamar");
    }
    return await response.json();
}catch(error){
    console.error("Error fetching rooms:", error);
    throw error;
}
  }
