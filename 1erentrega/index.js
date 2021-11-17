const express=require("express")
const app=express()
const Port=process.env.Port || 8080
const rutas=require("./routes/rutas")
const rutascarrito=require("./routes/rutascarrito")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set("views",__dirname+"/views")
app.set("view engine", "ejs")

app.use("/api/productos",rutas)
app.use("/api/carrito",rutascarrito)

app.listen(Port,()=>console.log(`Port is running on ${Port}`))
