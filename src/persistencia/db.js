// Conexión a Postgres (Supabase). La cadena llega por variable de entorno
// para no versionar credenciales; ver .env.example.
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Supabase exige TLS
  max: 20,                     // pg usa 10 por defecto; con 100 conexiones
                                // concurrentes eso encolaba 90 en Node
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

module.exports = pool;
