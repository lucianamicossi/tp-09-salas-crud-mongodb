const { salasPermitidas, turnosPermitidos } = require("./reservas");

const camposCreacion = [
  "estudiante",
  "email",
  "sala",
  "fecha",
  "turno",
  "personas",
];

const camposReemplazo = [...camposCreacion, "estado"];

const camposActualizacionParcial = ["personas", "estado"];

function validarObjeto(req, res) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({
      error: "El cuerpo de la solicitud debe ser un objeto JSON.",
    });

    return false;
  }

  return true;
}

function validarCamposPermitidos(cuerpo, camposPermitidos, errores) {
  for (const campo of Object.keys(cuerpo)) {
    if (!camposPermitidos.includes(campo)) {
      errores.push(`El campo ${campo} no está permitido.`);
    }
  }
}

function validarTexto(datos, campo, errores) {
  if (typeof datos[campo] !== "string") {
    errores.push(`El campo ${campo} debe ser texto.`);
    return;
  }

  datos[campo] = datos[campo].trim();

  if (!datos[campo]) {
    errores.push(`El campo ${campo} es obligatorio.`);
  }
}

function validarPersonas(valor, errores) {
  if (
    (typeof valor !== "number" && typeof valor !== "string") ||
    (typeof valor === "string" && !valor.trim())
  ) {
    errores.push("La cantidad de personas debe ser un número entre 1 y 6.");
    return undefined;
  }

  const personas = Number(valor);

  if (!Number.isFinite(personas) || !Number.isInteger(personas)) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
    return undefined;
  }

  if (personas < 1 || personas > 6) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
    return undefined;
  }

  return personas;
}

function validarEstado(valor, errores) {
  if (typeof valor !== "string") {
    errores.push("El estado debe ser texto.");
    return undefined;
  }

  const estado = valor.trim();

  if (!["pendiente", "confirmada"].includes(estado)) {
    errores.push("El estado debe ser pendiente o confirmada.");
    return undefined;
  }

  return estado;
}

function validarCamposReserva(cuerpo, campos, errores) {
  const datos = {};

  for (const campo of campos) {
    if (!Object.hasOwn(cuerpo, campo)) {
      errores.push(`El campo ${campo} es obligatorio.`);
      continue;
    }

    datos[campo] = cuerpo[campo];
  }

  for (const campo of ["estudiante", "email", "sala", "fecha", "turno"]) {
    if (Object.hasOwn(datos, campo)) {
      validarTexto(datos, campo, errores);
    }
  }

  if (
    typeof datos.email === "string" &&
    datos.email &&
    !datos.email.includes("@")
  ) {
    errores.push("El email debe contener @.");
  }

  if (
    typeof datos.sala === "string" &&
    datos.sala &&
    !salasPermitidas.includes(datos.sala)
  ) {
    errores.push("La sala seleccionada no es válida.");
  }

  if (
    typeof datos.turno === "string" &&
    datos.turno &&
    !turnosPermitidos.includes(datos.turno)
  ) {
    errores.push("El turno seleccionado no es válido.");
  }

  if (Object.hasOwn(datos, "personas")) {
    datos.personas = validarPersonas(datos.personas, errores);
  }

  if (Object.hasOwn(datos, "estado")) {
    datos.estado = validarEstado(datos.estado, errores);
  }

  return datos;
}

function validarReservaApi(req, res, next) {
  if (!validarObjeto(req, res)) {
    return;
  }

  const errores = [];

  validarCamposPermitidos(req.body, camposCreacion, errores);

  const datos = validarCamposReserva(req.body, camposCreacion, errores);

  if (errores.length > 0) {
    return res.status(400).json({
      error: "Los datos enviados no son válidos.",
      errores,
    });
  }

  req.reservaValidada = datos;
  next();
}

function validarReemplazoReservaApi(req, res, next) {
  if (!validarObjeto(req, res)) {
    return;
  }

  const errores = [];

  validarCamposPermitidos(req.body, camposReemplazo, errores);

  const datos = validarCamposReserva(req.body, camposReemplazo, errores);

  if (errores.length > 0) {
    return res.status(400).json({
      error: "Los datos enviados no son válidos.",
      errores,
    });
  }

  req.reemplazoReservaValidado = datos;
  next();
}

function validarActualizacionParcialReservaApi(req, res, next) {
  if (!validarObjeto(req, res)) {
    return;
  }

  const errores = [];

  validarCamposPermitidos(req.body, camposActualizacionParcial, errores);

  if (Object.keys(req.body).length === 0) {
    errores.push("Debe enviar al menos un campo para actualizar.");
  }

  const datos = {};

  if (Object.hasOwn(req.body, "personas")) {
    datos.personas = validarPersonas(req.body.personas, errores);
  }

  if (Object.hasOwn(req.body, "estado")) {
    datos.estado = validarEstado(req.body.estado, errores);
  }

  if (errores.length > 0) {
    return res.status(400).json({
      error: "Los datos enviados no son válidos.",
      errores,
    });
  }

  req.cambiosReservaValidados = datos;
  next();
}

module.exports = {
  validarReservaApi,
  validarReemplazoReservaApi,
  validarActualizacionParcialReservaApi,
};
