const METODOS_CITAS = ['listarTodas', 'guardar'];
const METODOS_PROFESIONALES = ['listarTodos'];

function exigirMetodos(nombre, candidato, metodos) {
  if (!candidato) {
    throw new Error(`Contrato incumplido: no se recibió ${nombre}`);
  }
  const faltantes = metodos.filter((m) => typeof candidato[m] !== 'function');
  if (faltantes.length > 0) {
    throw new Error(
      `Contrato incumplido: ${nombre} no implementa ${faltantes.join(', ')}`
    );
  }
  return candidato;
}

function asegurarRepositorioDeCitas(repo) {
  return exigirMetodos('RepositorioDeCitas', repo, METODOS_CITAS);
}

function asegurarRepositorioDeProfesionales(repo) {
  return exigirMetodos('RepositorioDeProfesionales', repo, METODOS_PROFESIONALES);
}

module.exports = {
  asegurarRepositorioDeCitas,
  asegurarRepositorioDeProfesionales,
};
