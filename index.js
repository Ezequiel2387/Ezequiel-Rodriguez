const express=require("express")
const app=express()
const Port=process.env.Port || 8080
const rutas=require("./routes/rutas")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

// app.use("/api",rutas)

app.set("views",__dirname+"/views")
app.set("view engine", "ejs")

app.use("/api",rutas)

app.listen(Port,()=>console.log(`Port is running on ${Port}`))