const { Router } = require("express");
const {
  registrarUsuario,
  login,
  actualizarUsuario,
  traerUsuarioPorId,
  peticion,
} = require("../controllers/Usuario");
const usuario_router = Router();

usuario_router.post("/registrar", registrarUsuario);
usuario_router.post("/login", login);
usuario_router.get("/getusuario/:id_usuario", traerUsuarioPorId);
usuario_router.put("/actualizarusuario/:id_usuario", actualizarUsuario);
usuario_router.post("/compra",peticion)

module.exports = {
  usuario_router,
};
