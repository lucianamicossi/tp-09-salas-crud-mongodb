const express = require("express");

const {
  validarReservaApi,
  validarReemplazoReservaApi,
  validarActualizacionParcialReservaApi,
} = require("../middleware/api-reservas");

function crearRouterApiReservas(controlador) {
  const router = express.Router();

  router.get("/", controlador.listar);
  router.get("/:id", controlador.detalle);

  router.post("/", validarReservaApi, controlador.crear);

  router.put("/:id", validarReemplazoReservaApi, controlador.reemplazar);

  router.patch(
    "/:id",
    validarActualizacionParcialReservaApi,
    controlador.actualizarParcial,
  );

  router.delete("/:id", controlador.eliminar);

  return router;
}

module.exports = { crearRouterApiReservas };
