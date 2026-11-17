# Trabajo práctico 09 – Salas con CRUD HTTP y MongoDB

## 1. Punto de partida y objetivo

Este proyecto parte de una copia del Trabajo práctico 08 – Salas con HTTP y MongoDB.

Se conservaron la estructura, las vistas HTML, la API REST, la conexión con MongoDB Atlas y la organización por capas. Sobre esa base se incorporaron las operaciones necesarias para completar el CRUD de reservas.

El objetivo de esta unidad es implementar las operaciones de creación, consulta, reemplazo, actualización parcial y eliminación de reservas mediante HTTP, utilizando MongoDB como almacenamiento persistente.

Tanto la aplicación web como la API trabajan con la misma colección de MongoDB a través de un servicio compartido.

La aplicación utiliza Node.js, Express, Mongoose y MongoDB Atlas.

## 2. Versiones y tecnologías utilizadas

Versiones del entorno de desarrollo:

- **Node.js:** v24.11.1
- **npm:** 11.6.2
- **Express:** 5.2.1
- **Mongoose:** 9.11.2
- **EJS:** 6.0.1
- **Morgan:** 1.12.1
- **Prettier:** 3.9.9
- **ESLint:** 10.11.0

Base de datos: MongoDB Atlas, clúster gratuito M0.

El proyecto utiliza CommonJS (`require` y `module.exports`) y variables de entorno para mantener las credenciales fuera del código fuente.

Se conservaron el manifiesto `package.json`, el archivo `package-lock.json`, la plantilla `.env.example` y el archivo `.gitignore` del proyecto de origen, actualizando el nombre del paquete para identificar TP09.

## 3. Preparación del proyecto

### 3.1. Instalar dependencias

Desde la carpeta raíz del proyecto, ejecutar: npm ci

Este comando instala las dependencias utilizando las versiones registradas en `package-lock.json`.

### 3.2. Configurar MongoDB Atlas

El proyecto utiliza MongoDB Atlas con un clúster gratuito M0.

Para configurar la conexión se necesita:

1. Disponer de un clúster en MongoDB Atlas.
2. Contar con un usuario de base de datos y su contraseña.
3. Configurar el acceso de red desde Network Access.
4. Obtener la URI de conexión del clúster.

La base de datos utilizada es `reservas_salas_u8` y la colección es `reservas`, de acuerdo con la configuración de conexión heredada del proyecto anterior.

La conexión se realiza mediante Mongoose.

### 3.3. Configurar las variables de entorno

El proyecto incluye una plantilla `.env.example`.

En Windows PowerShell, desde la carpeta raíz: Copy-Item .env.example .env

Completar el archivo `.env` con los datos reales del entorno local.

Ejemplo:

PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@cluster0.hprxnnu.mongodb.net/reservas_salas_u8?retryWrites=true&w=majority

Los valores de usuario y contraseña deben reemplazarse únicamente en el archivo local `.env`.

No publicar el archivo `.env`, contraseñas ni la URI completa de conexión.

### 3.4. Comprobar la conexión

Ejecutar: npm run comprobardb

También se puede ejecutar directamente: node --env-file=.env scripts/comprobar-conexion.js

Si la conexión es correcta, se muestra un mensaje de confirmación.

### 3.5. Ejecutar los controles de calidad

Para aplicar el formato: npm run format

Para comprobar el formato y ejecutar ESLint: npm run check

Los controles se aplican sobre los archivos JavaScript de las carpetas `src` y `scripts`.

### 3.6. Iniciar la aplicación

Ejecutar: npm start

Por defecto, el servidor se inicia en:

`http://localhost:3000`

El puerto puede modificarse mediante la variable `PORT`.

## 4. Arquitectura y estructura del proyecto

El proyecto mantiene una organización por capas:

- **Configuración:** lectura de variables de entorno y conexión a MongoDB.
- **Modelos:** definición del esquema de reservas.
- **Servicios:** operaciones de acceso a los documentos de MongoDB.
- **Controladores:** procesamiento de solicitudes y respuestas.
- **Rutas:** definición de endpoints HTTP.
- **Middlewares:** validación de datos y gestión de solicitudes y errores.

Estructura principal:

tp-09-salas-crud-mongodb/
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── package-lock.json
├── README.md
│
├── scripts/
│   ├── comprobar-conexion.js
│   ├── crear-reserva.js
│   └── listar-reservas.js
│
├── src/
│   ├── index.js
│   ├── app.js
│   │
│   ├── config/
│   │   ├── entorno.js
│   │   └── base-datos.js
│   │
│   ├── modelos/
│   │   └── reserva.js
│   │
│   ├── servicios/
│   │   └── reservas.js
│   │
│   ├── controladores/
│   │   ├── reservas.js
│   │   └── api-reservas.js
│   │
│   ├── rutas/
│   │   ├── reservas.js
│   │   └── api-reservas.js
│   │
│   └── middleware/
│       ├── solicitudes.js
│       ├── reservas.js
│       └── api-reservas.js
│
├── public/
│   └── css/
│       └── estilos.css
│
└── views/
    ├── layouts/
    │   └── main.ejs
    ├── reservas/
    │   ├── detalle.ejs
    │   ├── lista.ejs
    │   └── nueva.ejs
    ├── inicio.ejs
    └── no-encontrado.ejs

### Responsabilidades principales

- `src/config/entorno.js`: lee y valida las variables de entorno.
- `src/config/base-datos.js`: establece y finaliza la conexión con MongoDB mediante Mongoose.
- `src/modelos/reserva.js`: define el esquema y el modelo de reserva.
- `src/servicios/reservas.js`: contiene las operaciones de consulta, creación, reemplazo, actualización parcial, eliminación y conteo de reservas.
- `src/controladores/reservas.js`: gestiona las solicitudes de las vistas HTML.
- `src/controladores/api-reservas.js`: gestiona las solicitudes y respuestas JSON de la API.
- `src/rutas/reservas.js`: define las rutas de la aplicación web.
- `src/rutas/api-reservas.js`: define los endpoints de la API.
- `src/middleware/reservas.js`: valida los datos recibidos desde el formulario HTML.
- `src/middleware/api-reservas.js`: valida los datos recibidos por la API.
- `src/middleware/solicitudes.js`: gestiona información de las solicitudes HTTP.
- `src/app.js`: configura Express, los middlewares, las vistas y las rutas.
- `src/index.js`: conecta con MongoDB e inicia el servidor.
- `scripts/`: contiene programas independientes para comprobar la conexión y realizar operaciones de consola.

## 5. Modelo de datos y validaciones

El modelo `Reserva` utiliza Mongoose y almacena documentos en la colección `reservas`.

Los campos son:

| Campo        | Tipo     | Reglas                                                              |
|--------------|----------|---------------------------------------------------------------------|
| `estudiante` | String   | Obligatorio; elimina espacios exteriores mediante `trim`.           |
| `email`      | String   | Obligatorio; elimina espacios exteriores y debe contener `@`.       |
| `sala`       | String   | Obligatoria; Sala Norte, Sala Sur o Sala Multimedia.                |
| `fecha`      | String   | Obligatoria; elimina espacios exteriores.                           |
| `turno`      | String   | Obligatorio; Mañana, Tarde o Noche.                                 |
| `personas`   | Number   | Obligatorio; número entero entre 1 y 6 inclusive.                   |
| `estado`     | String   | Valores permitidos: pendiente o confirmada. Por defecto: pendiente. |
| `_id`        | ObjectId | Identificador generado por MongoDB/Mongoose.                        |

El campo `estado` se establece automáticamente como `pendiente` al crear una reserva. El cliente no puede establecerlo durante la creación mediante POST.

Para modificar el estado se requiere una operación PATCH o PUT válida.

La validación del email es mínima: comprobar que contenga `@` no garantiza que la dirección exista ni que tenga un formato completo válido.

La fecha se almacena como texto. No se comprueba que corresponda a un día futuro ni que exista disponibilidad asociada.

Tampoco se comprueba la superposición de horarios entre reservas.

## 6. Funcionamiento de la aplicación web y de la API

La aplicación utiliza un servicio compartido de reservas que consulta y modifica MongoDB.

Tanto el formulario HTML como la API trabajan con la misma colección. Las operaciones de lectura y escritura se realizan de forma asíncrona.

### 6.1. Rutas de la aplicación web

| Método | Ruta              | Función                                                   |
|--------|-------------------|-----------------------------------------------------------|
| GET    | `/`               | Muestra la página principal.                              |
| GET    | `/estado`         | Informa el estado del servicio y la cantidad de reservas almacenadas. |
| GET    | `/reservas`       | Muestra el listado de reservas.                           |
| GET    | `/reservas/nueva` | Muestra el formulario de creación.                        |
| POST   | `/reservas`       | Valida y crea una reserva en MongoDB.                     |
| GET    | `/reservas/:id`   | Muestra el detalle de una reserva.                        |

El formulario conserva los datos ingresados cuando hay errores de validación y responde con HTTP 400. Cuando la creación es correcta, redirige al listado.

### 6.2. Endpoints de la API REST

La API utiliza el prefijo `/api/reservas` y trabaja con formato JSON.

| Método | Endpoint           | Función                              | Respuesta correcta |
|--------|--------------------|--------------------------------------|--------------------|
| GET    | `/api/reservas`    | Lista las reservas.                  | 200 OK             |
| GET    | `/api/reservas/:id`| Consulta una reserva por ID.         | 200 OK             |
| POST   | `/api/reservas`    | Crea una reserva.                    | 201 Created        |
| PUT    | `/api/reservas/:id`| Reemplaza todos los campos editables.| 200 OK             |
| PATCH  | `/api/reservas/:id`| Modifica parcialmente una reserva.   | 200 OK             |
| DELETE | `/api/reservas/:id`| Elimina físicamente una reserva.     | 204 No Content     |

### 6.3. Lectura simple

La operación GET `/api/reservas` devuelve directamente un arreglo JSON con las reservas almacenadas, sin agregar metadatos adicionales.

También se puede consultar una reserva individual mediante GET `/api/reservas/:id`.

Se conserva el filtro por sala mediante el parámetro `sala`.

Ejemplo: GET /api/reservas?sala=Sala%20Norte

La búsqueda utiliza coincidencia exacta. Si no hay resultados, devuelve un arreglo vacío.

No se admiten valores repetidos del parámetro `sala`.

### 6.4. Creación de reservas: POST

Endpoint: POST /api/reservas

El cuerpo debe contener los seis campos originales:

{
  "estudiante": "Ana Ejemplo",
  "email": "ana.ejemplo@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-11-20",
  "turno": "Mañana",
  "personas": 2
}

El cliente debe enviar el encabezado: Content-Type: application/json

La respuesta correcta es HTTP 201 Created e incluye el recurso creado y el encabezado `Location` con la dirección del nuevo recurso.

El identificador se representa mediante el campo `id` como texto.

El campo `estado` se establece automáticamente como `pendiente`. No se admite que el cliente envíe `estado` ni `_id` durante la creación.

### 6.5. Reemplazo completo: PUT

Endpoint: PUT /api/reservas/:id

PUT reemplaza todos los campos editables de una reserva.

Se requieren los siete campos:

- `estudiante`
- `email`
- `sala`
- `fecha`
- `turno`
- `personas`
- `estado`

Ejemplo:

{
  "estudiante": "Ana Ejemplo",
  "email": "ana.ejemplo@example.com",
  "sala": "Sala Sur",
  "fecha": "2026-11-21",
  "turno": "Tarde",
  "personas": 3,
  "estado": "confirmada"
}

La respuesta correcta es HTTP 200 OK y devuelve el recurso actualizado con el mismo identificador.

Si falta alguno de los campos requeridos, la solicitud se rechaza con HTTP 400 Bad Request.

No se permite modificar el identificador ni enviar campos desconocidos.

### 6.6. Actualización parcial: PATCH

Endpoint: PATCH /api/reservas/:id

PATCH permite modificar únicamente los siguientes campos:

- `personas`
- `estado`

Ejemplo para modificar la cantidad de personas:

{
  "personas": 3
}

Ejemplo para modificar el estado:

{
  "estado": "pendiente"
}

Se admite enviar uno o ambos campos permitidos.

La respuesta correcta es HTTP 200 OK y devuelve el recurso actualizado, conservando los demás datos.

Se rechaza con HTTP 400:

- Un cuerpo vacío.
- La ausencia de campos permitidos.
- Campos desconocidos.
- Valores inválidos.
- Intentos de modificar campos no habilitados mediante PATCH.

### 6.7. Eliminación física: DELETE

Endpoint: DELETE /api/reservas/:id

DELETE elimina físicamente el documento de MongoDB correspondiente al identificador indicado.

La respuesta correcta es: 204 No Content

La respuesta no contiene cuerpo.

Si el identificador es válido pero el documento no existe, devuelve HTTP 404 Not Found.

Una segunda solicitud DELETE sobre el mismo identificador también devuelve 404.

Después de eliminar una reserva, una consulta GET por ese mismo identificador devuelve 404.

La eliminación no modifica el estado de la reserva: elimina el documento.

## 7. Validaciones y manejo de errores

La API utiliza los siguientes códigos HTTP:

| Código | Significado                                                    |
|--------|----------------------------------------------------------------|
| 200    | Operación de consulta o actualización realizada correctamente. |
| 201    | Reserva creada correctamente.                                  |
| 204    | Reserva eliminada correctamente, sin contenido de respuesta.   |
| 400    | Datos inválidos, JSON mal formado o identificador incorrecto.  |
| 404    | Reserva o ruta inexistente.                                    |
| 500    | Error inesperado del servidor.                                 |

Las validaciones se realizan antes de ejecutar las operaciones correspondientes en MongoDB.

Se comprueba que:

- Los cuerpos recibidos sean objetos JSON válidos.
- Los campos permitidos correspondan a cada operación.
- Los campos obligatorios estén presentes en POST y PUT.
- `personas` sea un número entero entre 1 y 6.
- `estado` sea `pendiente` o `confirmada`.
- Los identificadores tengan un formato válido.
- PATCH reciba al menos un campo permitido.

Para las actualizaciones se utilizan validaciones de Mongoose mediante `runValidators: true`.

Las actualizaciones parciales se construyen con los campos expresamente permitidos, sin enviar directamente el cuerpo completo del cliente al modelo.

Las respuestas de error de la API se envían en formato JSON.

El middleware centralizado evita exponer trazas internas, credenciales o información sensible.

Las rutas inexistentes bajo `/api` responden en JSON. Las rutas web inexistentes muestran la página HTML correspondiente.

## 8. Persistencia y conexión con MongoDB

La conexión se establece al iniciar el servidor. Express comienza a escuchar solicitudes después de que la conexión con MongoDB se establece correctamente.

Las operaciones de consulta, creación, actualización y eliminación se realizan mediante Mongoose y son asíncronas.

La aplicación no utiliza un arreglo en memoria como almacenamiento principal ni inserta reservas automáticamente al arrancar.

El servicio compartido permite:

- Crear reservas.
- Listar reservas.
- Buscar una reserva por identificador.
- Contar documentos almacenados.
- Reemplazar una reserva.
- Actualizar parcialmente una reserva.
- Eliminar una reserva.

El servidor mantiene la conexión mientras está funcionando y contempla su cierre ordenado al recibir señales de finalización.

Los scripts de consola son independientes del servidor y finalizan su conexión una vez completada cada operación.

### Diagnóstico de DNS y conectividad

Durante el desarrollo del proyecto de origen se realizaron comprobaciones de resolución DNS y conectividad con Atlas.

Comandos utilizados en Windows PowerShell:

slookup -type=SRV _mongodb._tcp.cluster0.hprxnnu.mongodb.net

Resolve-DnsName -Type SRV _mongodb._tcp.cluster0.hprxnnu.mongodb.net

También se comprobó la conectividad TCP al puerto 27017 mediante `Test-NetConnection`, utilizando un host del clúster obtenido de los registros SRV.

Durante el diagnóstico se configuraron resolutores DNS públicos en el proceso de Node.js mediante:

dns.setServers(["8.8.8.8", "1.1.1.1"]);

La conexión se verificó posteriormente con el script `comprobar-conexion.js`.

Ante problemas de conexión, se deben revisar la URI, las credenciales, la lista de acceso de Atlas y la resolución DNS.

## 9. Pruebas realizadas con Postman

Las pruebas se realizaron utilizando la aplicación en ejecución y Postman.

### 9.1. Pruebas CRUD

Se creó una reserva ficticia para probar las operaciones de modificación y eliminación.

Datos iniciales:

- Estudiante: `Ana Ejemplo`.
- Email: `ana.ejemplo@example.com`.
- Sala: `Sala Norte`.
- Fecha: `2026-11-20`.
- Turno: `Mañana`.
- Personas: `2`.

Identificador observado:

6afbafa7ee61ca487182e4b1

Se realizaron las siguientes pruebas:

| Prueba                                  | Resultado observado                             |
|-----------------------------------------|-------------------------------------------------|
| GET `/api/reservas`                     | HTTP 200; devuelve el listado.                  |
| POST `/api/reservas` válido             | HTTP 201; crea la reserva.                      |
| PUT `/api/reservas/:id` completo        | HTTP 200; reemplaza los campos y conserva el ID.|
| PATCH `/api/reservas/:id` con `personas`| HTTP 200; actualiza la cantidad.                |
| PATCH `/api/reservas/:id` con `estado`  | HTTP 200; actualiza el estado.                  |
| DELETE `/api/reservas/:id`              | HTTP 204; elimina el documento.                 |
| GET posterior al DELETE                 | HTTP 404; la reserva ya no existe.              |
| GET del listado posterior al DELETE     | HTTP 200; no incluye la reserva eliminada.      |

La reserva de prueba fue eliminada mediante DELETE para comprobar el borrado físico.

### 9.2. Pruebas de validación

| Prueba                                   | Resultado observado                         |
|------------------------------------------|---------------------------------------------|
| PUT sin el campo `estado`                | HTTP 400; rechaza el reemplazo incompleto.  |
| PATCH con cuerpo vacío `{}`              | HTTP 400; exige al menos un campo permitido.|
| PATCH con el campo `estudiante`          | HTTP 400; rechaza campos no permitidos.     |
| GET con identificador válido inexistente | HTTP 404.                                   |
| GET con identificador mal formado (`123`)| HTTP 400.                                   |

Las pruebas permitieron comprobar que la API diferencia los identificadores inválidos de los identificadores válidos que no corresponden a documentos existentes.

### 9.3. Persistencia después del reinicio

Se comprobó el funcionamiento de la persistencia realizando los siguientes pasos:

1. Se consultó el listado de reservas mediante GET.
2. Se anotó el contenido obtenido.
3. Se detuvo el servidor con `Ctrl + C`.
4. Se inició nuevamente mediante `npm start`.
5. Se repitió la consulta GET `/api/reservas`.

El resultado fue el mismo antes y después del reinicio: las reservas existentes continuaron almacenadas y disponibles.

Esta comprobación demuestra que los datos se mantienen en MongoDB y no dependen de la memoria del proceso de Node.js.

### 9.4. Controles de calidad

Se ejecutaron los controles desde la carpeta raíz del proyecto.

| Comando         | Resultado observado                       |
|-----------------|-------------------------------------------|
| `npm run format`| Formato aplicado correctamente.           |
| `npm run check` | Prettier y ESLint finalizaron sin errores.|

El último control `npm run check` mostró:

Checking formatting...
All matched files use Prettier code style!

ESLint finalizó sin informar errores.

## 10. Seguridad y archivos que no deben publicarse

El proyecto utiliza `.gitignore` para excluir archivos locales y sensibles.

Se excluyen, entre otros:

gitignore
node_modules/
.env

El archivo `.env.example` se mantiene como plantilla para configurar un entorno local.

Antes de publicar el repositorio, comprobar que no se incluyan:

- El archivo `.env`.
- Contraseñas.
- URI de conexión con credenciales.
- Tokens u otros secretos.
- Archivos personales o locales que no formen parte del proyecto.

La información de conexión debe mantenerse fuera del repositorio, especialmente si es público.

## 11. Alcance del trabajo

Este trabajo completa las operaciones CRUD de reservas mediante una API HTTP conectada a MongoDB.

No forma parte del alcance de esta unidad:

- Implementar autenticación de usuarios.
- Realizar un despliegue público.
- Incorporar consultas avanzadas.
- Implementar relaciones entre datos.
- Controlar disponibilidad o superposición de horarios.

Las consultas avanzadas y las relaciones de datos quedan planificadas para la Unidad 10.

## 12. Conclusión

En este trabajo se amplió la aplicación desarrollada en TP08 incorporando las operaciones completas de CRUD para las reservas.

Se implementaron GET, POST, PUT, PATCH y DELETE, manteniendo la persistencia en MongoDB Atlas y el uso de un servicio compartido por la aplicación web y la API.

También se incorporaron validaciones específicas para cada operación, respuestas HTTP apropiadas, manejo centralizado de errores y eliminación física de documentos.

Las pruebas realizadas con Postman permitieron comprobar la creación, consulta, reemplazo, actualización parcial y eliminación de reservas, además de las respuestas ante datos inválidos e identificadores inexistentes.

Finalmente, se comprobó que los documentos existentes permanecen almacenados después de reiniciar el servidor y que los controles de calidad finalizan correctamente.
