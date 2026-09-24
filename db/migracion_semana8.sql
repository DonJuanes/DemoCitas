-- Migración Semana 8: índice único sobre (profesional_id, fecha_hora).
-- Reemplaza el SELECT de existeEnHorario por una restricción a nivel de datos:
-- resuelve la condición de carrera que el refactor en capas dejó pendiente
-- (ver "Nota sobre concurrencia" en README.md) y de paso ahorra un viaje de
-- red por reserva, porque guardar() ya no necesita consultar antes de insertar.
CREATE UNIQUE INDEX IF NOT EXISTS idx_citas_unicidad
  ON citas (profesional_id, fecha_hora);
