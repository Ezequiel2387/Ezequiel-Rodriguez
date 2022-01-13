const {Schema, model} = require("mongoose");

const usuarioSchema = new Schema({
    username:String,
    password:String,
    

});

module.exports = model("usuario",usuarioSchema);

