const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.DB/*"mongodb+srv://Chopo:coder2020@clusterlogin.2taai.mongodb.net/login?retryWrites=true&w=majority"*/);

mongoose.connection.on("open",()=>{
    console.log("Base de datos conectada con exito")
})

mongoose.connection.on("error",()=>{
    console.log("Error al conectarce a la base de datos!!")
})