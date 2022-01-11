const {Schema, model} = require("mongoose");

const mensajesSchema = new Schema({
    author: {
        mailDelUsuario:String,
        nombreDelUsuario:String,
        apellidoDelUsuario:String,
        edadDelUsuario:String,
        aliasDelUsuario:String,
        avatar:String,
        fech:String
      },
      mensaje:String,
      mailDelUsuario:String,

});

module.exports = model("Mensajes",mensajesSchema);

