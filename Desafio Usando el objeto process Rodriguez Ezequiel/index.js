const express = require("express");
const app = express();
const Port = process.env.Port || 8080                  //Puerto
const rutas = require("./routes/rutas");
const handlebars = require("express-handlebars");
const util = require("util");
const mongoose = require("mongoose")
const http = require("http");                          //Servidor HTTP
const server = http.createServer(app);                 //
const { normalize, schema, denormalize } = require("normalizr");
require("./db");                                    //MongoDB
const mensajesmongodb = require("./models/Mensajes")  //MongoDB

const session = require("express-session");
const Filestore = require("session-file-store")(session)

const MongoStore = require("connect-mongo")
const advancedOptioonss = { useNewUrlParser: true, useUnifiedTopology: true }

const passport = require("passport");

const dotenv = require("dotenv");
const parseArgs=require("minimist");

dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//******************* SESSION ************************* 

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.DB/*"mongodb+srv://Chopo:coder2020@clusterlogin.2taai.mongodb.net/login?retryWrites=true&w=majority"*/,
        mongoOptions: advancedOptioonss
    }),
    secret: "mysecret",
    resave: true,
    saveUninitialized: false,

}))

//******************* SESSION *************************

app.use(express.static(__dirname + "/public"))        //Usamos archivos estaticos
app.use(passport.initialize());
app.use(passport.session())

//******************* MOTOR DE PLANTILLA **************************

app.engine("hbs", handlebars({
    layoutsDir: __dirname + "/views/layouts"
}))
app.set("views", __dirname + "/views")
app.set("view engine", "hbs")

//******************* MOTOR DE PLANTILLA **************************


const msn = []
app.use("/", rutas)                                  //Rutas

const { Server } = require("socket.io");                 //Servidor de socket
const { Console } = require("console");
const io = new Server(server)


io.on("connection", (socket) => {                      //Servidor escuchando un evento
    socket.on("data_client", (data) => {
        msn.push(data)
        //console.log(data)
        const msj = new mensajesmongodb(data);
        //console.log(msj)
        msj.save((err, document) => {
            if (err) console.log(err)
            console.log(document)
        })
        io.sockets.emit("message_back", msn)
    })
})

server.listen(Port, () => {
    console.log(`Port is running on ${process.env.HOST}:${Port}`)

})


module.exports = passport;