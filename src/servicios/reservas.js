const Reserva = require("../modelos/reserva");

function crearServicioReservas() {
  async function listar(criterio = {}) {
    return Reserva.find(criterio).exec();
  }

  async function buscarPorId(id) {
    return Reserva.findById(id).exec();
  }

  async function contar() {
    return Reserva.countDocuments().exec();
  }

  async function crear(datos) {
    return Reserva.create(datos);
  }

  async function reemplazar(id, datos) {
    const reemplazo = {
      estudiante: datos.estudiante,
      email: datos.email,
      sala: datos.sala,
      fecha: datos.fecha,
      turno: datos.turno,
      personas: datos.personas,
      estado: datos.estado,
    };

    return Reserva.findByIdAndUpdate(
      id,
      { $set: reemplazo },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    ).exec();
  }

  async function actualizarParcial(id, cambios) {
    const cambiosPermitidos = {};

    if (Object.hasOwn(cambios, "personas")) {
      cambiosPermitidos.personas = cambios.personas;
    }

    if (Object.hasOwn(cambios, "estado")) {
      cambiosPermitidos.estado = cambios.estado;
    }

    return Reserva.findByIdAndUpdate(
      id,
      { $set: cambiosPermitidos },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    ).exec();
  }

  async function eliminar(id) {
    return Reserva.findByIdAndDelete(id).exec();
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
    reemplazar,
    actualizarParcial,
    eliminar,
  };
}

module.exports = {
  crearServicioReservas,
};
