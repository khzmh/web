const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001; // Port untuk backend

// Gunakan middleware CORS agar frontend bisa mengakses backend
app.use(cors());

// Serve file statis (gambar, dll.) dari folder 'public'
// Ketika ada request ke '/images', Express akan mencarinya di folder 'public/images'
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Endpoint untuk mendapatkan semua data album
app.get('/api/albums', (req, res) => {
  const albumsPath = path.join(__dirname, 'albums.json');
  fs.readFile(albumsPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading albums.json:", err);
      return res.status(500).send('Gagal membaca data album');
    }
    try {
      const albums = JSON.parse(data);
      res.json(albums); // Kirim data album dalam format JSON
    } catch (parseErr) {
      console.error("Error parsing albums.json:", parseErr);
      res.status(500).send('Gagal mem-parse data album');
    }
  });
});

// Endpoint opsional untuk mendapatkan satu album berdasarkan ID (tidak dipakai di frontend sederhana ini tapi bisa berguna nanti)
app.get('/api/albums/:id', (req, res) => {
  const albumId = req.params.id;
  const albumsPath = path.join(__dirname, 'albums.json');

  fs.readFile(albumsPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading albums.json:", err);
      return res.status(500).send('Gagal membaca data album');
    }
    try {
      const albums = JSON.parse(data);
      const album = albums.find(alb => alb.id === albumId);

      if (album) {
        res.json(album);
      } else {
        res.status(404).send('Album tidak ditemukan');
      }
    } catch (parseErr) {
      console.error("Error parsing albums.json:", parseErr);
      res.status(500).send('Gagal mem-parse data album');
    }
  });
});


// Jalankan server
app.listen(port, () => {
  console.log(`Backend server berjalan di http://localhost:${port}`);
});
