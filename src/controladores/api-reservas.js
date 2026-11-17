const mongoose = require("mongoose");

function crearControladorApiReservas(servicio) {
  function representarReserva(reserva) {
    return {
      id: reserva._id.toString(),
      estudiante: reserva.estudiante,
      email: reserva.email,
      sala: reserva.sala,
      fecha: reserva.fecha,
      turno: reserva.turno,
      personas: reserva.personas,
      estado: reserva.estado,
    };
  }

  function validarId(id, res) {
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        error: "El ID de la reserva no tiene un formato válido.",
      });

      return false;
    }

    return true;
  }

  async function listar(req, res) {
    const criterio = {};

    if (Object.hasOwn(req.query, "sala")) {
      if (typeof req.query.sala !== "string") {
        return res.status(400).json({
          error: "El filtro sala debe ser un único texto.",
        });
      }

      criterio.sala = req.query.sala;
    }

    const reservas = await servicio.listar(criterio);

    res.json(reservas.map(representarReserva));
  }

  async function detalle(req, res) {
    const { id } = req.params;

    if (!validarId(id, res)) {
      return;
    }

    const reserva = await servicio.buscarPorId(id);

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.json(representarReserva(reserva));
  }

  async function crear(req, res) {
    const reserva = await servicio.crear(req.reservaValidada);
    const recurso = representarReserva(reserva);

    res.location(`/api/reservas/${recurso.id}`);

    res.status(201).json(recurso);
  }

  async function reemplazar(req, res) {
    const { id } = req.params;

    if (!validarId(id, res)) {
      return;
    }

    const reserva = await servicio.reemplazar(id, req.reemplazoReservaValidado);

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.json(representarReserva(reserva));
  }

  async function actualizarParcial(req, res) {
    const { id } = req.params;

    if (!validarId(id, res)) {
      return;
    }

    const reserva = await servicio.actualizarParcial(
      id,
      req.cambiosReservaValidados,
    );

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.json(representarReserva(reserva));
  }

  async function eliminar(req, res) {
    const { id } = req.params;

    if (!validarId(id, res)) {
      return;
    }

    const reserva = await servicio.eliminar(id);

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.status(204).end();
  }

  return {
    listar,
    detalle,
    crear,
    reemplazar,
    actualizarParcial,
    eliminar,
  };
}

module.exports = { crearControladorApiReservas };
