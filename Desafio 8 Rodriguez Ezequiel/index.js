const express=require("express")
const app=express()
const Port=process.env.Port || 8080                 //Puerto
const rutas=require("./routes/rutas")
const handlebars=require("express-handlebars")
const knex = require("./knexfile")
var hoy = new Date();
const fecha= hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear()+` `+hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds()

const http=require("http")                          //Servidor HTTP
const server=http.createServer(app)                 //

app.use(express.static(__dirname+"/public"))        //Usamos archivos estaticos

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.engine("hbs",handlebars({
    layoutsDir:__dirname+"/views/layouts"
}))
app.set("views",__dirname+"/views")
app.set("view engine", "hbs")

const msn=[ ]
app.use("/",rutas)                                  //Rutas

const {Server}=require("socket.io")                 //Servidor de socket
const { json } = require("express")
const io=new Server(server)              

io.on("connection",(socket)=>{                      //Servidor escuchando un evento
    console.log("Usuario conectado")
    socket.emit("message_back",msn)
    socket.on("message_client",(data)=>{
        //console.log(data)
    })
    socket.on("data_client",(data)=>{
        data.fecha=fecha    
        msn.push(data)
        console.log(data)
            
        knex("ecommerce").insert(data)
        .then(res=>{
            console.log("Se cargo un mensaje correctamente")
        }).catch(err=>{
            throw err;
        })

        io.sockets.emit("message_back",msn)
    })
})
server.listen(Port,()=>{
    console.log(`Port is running on ${Port}`)
})
