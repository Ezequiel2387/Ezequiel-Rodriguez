const express=require("express")
const app=express()
const Port=process.env.Port || 8080

app.use(express.json())

const productos=require("./routes/productos")

app.use("/api",productos)

app.listen(Port,()=>{
    console.log("Port is running on 8080")
})