const { Usuarios } = require("../config/Sequelize");
const axios = require("axios");

const registrarUsuario = async (req, res) => {
  try {
    let rpta = await Usuarios.findOne({
      where: { usu_email: req.body.usu_email },
    });
    if (rpta) {
      res.status(200).json({
        ok: false,
        mensaje: "Este correo ya esta en uso",
      });
    } else {
      let usuarioCreado = Usuarios.build(req.body);
      usuarioCreado.setearPassword(req.body.password);
      let nuevoUsuario = await usuarioCreado.save();
      res.status(201).json({
        ok: true,
        contenido: nuevoUsuario,
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: error,
    });
  }
};

const login = async (req, res) => {
  let { email, password, nickname } = req.body;
  let respuesta;
  if (email) {
    respuesta = await Usuarios.findOne({
      where: {
        usu_email: email,
      },
    });
  }
  if (nickname) {
    respuesta = await Usuarios.findOne({
      where: {
        usu_nickname: nickname,
      },
    });
  }
  if (!respuesta) {
    res.status(404).json({
      ok: false,
      mensaje: "Usuario o contraseña incorrectos",
    });
  } else {
    // let rptabooleano = respuesta.validarPassword(password);
    // if(rptabooleano){

    // }
    if (respuesta.validarPassword(password)) {
      let token = respuesta.generarJWT();
      res.status(200).json({
        ok: true,
        mensaje: "Usuario correctamente validado",
        token: token,
      });
    } else {
      res.status(404).json({
        ok: false,
        mensaje: "Usuario o contraseña incorrectos",
      });
    }
  }
};

const actualizarUsuario = (req, res) => {
  console.log(req.params, req.body);
  let { id_usuario } = req.params;
  let { nombre, apellido, facebook, twitter } = req.body;
  Usuarios.findByPk(id_usuario)
    .then((usuariorpta) => {
      if (usuariorpta) {
        return Usuarios.update(
          {
            usu_nombre: nombre,
            usu_apellido: apellido,
            usu_facebook: facebook,
            usu_twitter: twitter,
          },
          { where: { usu_id: id_usuario } }
        );
      } else {
        res.status(404).json({
          mensaje: "No se encontro el usuario",
        });
      }
    })
    .then((usuarioActualizado) => {
      if (usuarioActualizado) {
        res.status(201).json({
          ok: true,
          contenido: usuarioActualizado,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        error: error,
      });
    });
};

const traerUsuarioPorId = (req, res) => {
  let { id_usuario } = req.params;
  Usuarios.findByPk(id_usuario).then((usuariorpta) => {
    if (usuariorpta) {
      res.json({
        ok: true,
        mensaje: usuariorpta,
      });
    } else {
      res.status(404).json({
        ok: false,
        mensaje: "No se encontro el Usuario",
      });
    }
  });
};

const peticion = (req, res) => {
  // console.log("comprapet",req.params)
  // let compra = req.params.compra
  console.log("body", req.body);
  let compra = req.body;
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${compra.token.id}`,
      "Content-Type": "application/json",
    },
  };

  const bodyParameters = {
    amount: compra.precio,
    currency_code: compra.moneda,
    email: compra.email,
    source_id: "sk_test_2958d8ed40fb79f5",
  };
  // functions.logger.log("config", config);
  // functions.logger.log("config", bodyParameters);
  axios
    .post("https://api.culqi.com/v2/charges", bodyParameters, config)
    .then((data) => {
      console.log("fasfasfsa"), console.log("peticion", data);
      // functions.logger.log("hacercompra:", data);
      res.json({ message: "ok", data: data });
    })
    .catch((err) => err);
};

module.exports = {
  registrarUsuario,
  login,
  actualizarUsuario,
  traerUsuarioPorId,
  peticion,
};
