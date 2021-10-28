const express=require("express")
const app=express()
const Port=process.env.Port || 8080
const rutas=require("./routes/rutas")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set("views",__dirname+"/views")
app.set("view engine","pug")

app.use("/",rutas)

app.listen(Port,()=>console.log(`Port is running on ${Port}`))
