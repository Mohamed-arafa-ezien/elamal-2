const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon')
    ? { rejectUnauthorized: false }
    : false,
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    res.json({
      success: true,
      message: 'Neon PostgreSQL connected successfully',
      currentTime: result.rows[0].current_time,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1 AS ok');
    res.json({ success: true, ok: result.rows[0].ok });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
