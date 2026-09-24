// Casos de uso de citas: coordinan las reglas del dominio y los repositorios.
const reglas = require('../dominio/reglasDeAgenda');
const citaRepository = require('../persistencia/citaRepository');
const profesionalRepository = require('../persistencia/profesionalRepository');

async function consultarCitas() {
  return citaRepository.listarTodas();
}

async function consultarProfesionales() {
  return profesionalRepository.listarTodos();
}

async function reservarCita(datos) {
  reglas.validarDatosCompletos(datos);
  reglas.validarFechaFutura(datos.fecha_hora);

  try {
    const id = await citaRepository.guardar(datos);
    return { mensaje: 'Cita creada', id };
  } catch (error) {
    if (error.esConflictoDeAgenda) {
      // El dominio sigue siendo quien decide que esto es un error de negocio;
      // solo cambió quién detecta el conflicto (antes: 2 consultas; ahora: la BD).
      reglas.validarAgendaLibre(true);
    }
    throw error;
  }
}

module.exports = { consultarCitas, consultarProfesionales, reservarCita };
