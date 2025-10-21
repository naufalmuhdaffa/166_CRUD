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