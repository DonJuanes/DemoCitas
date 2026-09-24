// Acceso a datos de citas. Todo el SQL de la tabla citas vive en este módulo.
const pool = require('./db');

async function listarTodas() {
  const resultado = await pool.query(
    `SELECT c.id, c.paciente, c.fecha_hora, p.nombre AS profesional
       FROM citas c
       JOIN profesionales p ON p.id = c.profesional_id
      ORDER BY c.fecha_hora`
  );
  return resultado.rows;
}

// Antes esta función hacía un SELECT aparte para verificar el horario;
// ahora esa verificación la hace el índice único de la base de datos
// (ver db/migracion_semana8.sql) y guardar() la traduce en un solo viaje.
async function guardar({ paciente, profesional_id, fecha_hora }) {
  try {
    const resultado = await pool.query(
      `INSERT INTO citas (paciente, profesional_id, fecha_hora)
       VALUES ($1, $2, $3) RETURNING id`,
      [paciente, profesional_id, fecha_hora]
    );
    return resultado.rows[0].id;
  } catch (error) {
    if (error.code === '23505') { // unique_violation
      const conflicto = new Error('Ese profesional ya tiene una cita a esa hora');
      conflicto.esConflictoDeAgenda = true;
      throw conflicto;
    }
    throw error;
  }
}

module.exports = { listarTodas, guardar };
