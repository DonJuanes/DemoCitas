// Casos de uso de citas: coordinan las reglas del dominio y los repositorios.
// Los repositorios llegan por parámetro (inyección de dependencias); este
// módulo solo conoce el contrato, no la implementación PostgreSQL.
const reglas = require('../dominio/reglasDeAgenda');
const {
  asegurarRepositorioDeCitas,
  asegurarRepositorioDeProfesionales,
} = require('./contratos/repositorios');

function crearCitaService({ citaRepository, profesionalRepository }) {
  asegurarRepositorioDeCitas(citaRepository);
  asegurarRepositorioDeProfesionales(profesionalRepository);

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
        // El dominio sigue decidiendo que esto es un error de negocio.
        reglas.validarAgendaLibre(true);
      }
      throw error;
    }
  }

  return { consultarCitas, consultarProfesionales, reservarCita };
}

module.exports = { crearCitaService };
