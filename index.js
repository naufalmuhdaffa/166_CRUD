const express = require('express');
let mysql = require('mysql2');
require('dotenv').config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'mahasiswa',
  port: 3309
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:' + err.stack);
    return;
  }
  console.log('Koneksi Berhasil!');
});

app.get('/api/mahasiswa', (req, res) => {
    db.query('SELECT * FROM biodata', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).send('Error executing query');
            return;
        }
        res.json(results);
    });
});

app.post('/api/mahasiswa', (req, res) => {
    const { nama, agama, alamat } = req.body || {};
    
    if (!nama || !agama || !alamat) {
        return res.status(400).json({ message: 'Nama, agama, alamat wajib diisi' });
    }

    db.query(
        'INSERT INTO biodata (nama, agama, alamat) VALUES (?, ?, ?)',
        [nama, agama, alamat],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'User created successfully' });
        }
    );
});

app.put('/api/mahasiswa/:id', (req, res) => {
    const userId = req.params.id;
    const { nama, agama, alamat } = req.body;
    db.query(
        'UPDATE biodata SET nama = ?, agama = ?, alamat = ? WHERE id = ?',
        [nama, agama, alamat, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database Error' });
            }
            res.json({ message: 'User updated successfully' });
        }
    );
});

app.delete('/api/mahasiswa/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM biodata WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database Error' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});