const express=require("express")
const app=express()
const Port=process.env.Port || 8080
const rutas=require("./routes/rutas")
const handlebars=require("express-handlebars")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.engine("hbs",handlebars({
    layoutsDir:__dirname+"/views/layouts"
}))
app.set("views",__dirname+"/views")
app.set("view engine", "hbs")

app.use("/",rutas)

app.listen(Port,()=>console.log(`Port is running on ${Port}`))
