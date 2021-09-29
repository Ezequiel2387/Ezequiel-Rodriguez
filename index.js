const express = require ("express")
const app = express()
const fs = require("fs")
const PORT = process.env.PORT || 8080


class Contenedor {
    constructor(datos){
        this.datos=datos
    } 
    async queande(){
        let fileread= await fs.promises.readFile(this.datos,"utf-8")         
        let datosdearchivo=JSON.parse(fileread)
        return datosdearchivo
    }
    async random(){    
        let fileread= await fs.promises.readFile(this.datos,"utf-8")        
        let datosdearchivo=JSON.parse(fileread)
        let cualquiera = Math.round((Math.random() * 2)) + 1
        let resultado=datosdearchivo.filter(objeto=>objeto.id==cualquiera)
        return resultado  
    }
}

let usuario =new Contenedor ("Productos.txt")

app.get("/",(req,res)=>{
    res.status(200).send("Escriba /productos o /productosRandom")
})

app.get("/productos",(req,resp)=>{
        usuario.queande().then((res)=> {
                    resp.json(res)
                })   
    })

app.get("/productoRandom",(req,resp)=>{
        usuario.random().then((res)=> resp.json(res))   
    })

app.listen(PORT,()=>{
    console.log("Server is running on Port 8080")
})
    