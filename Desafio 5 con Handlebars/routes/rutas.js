const express=require("express")
const app=express()
const {Router}=express
const router=new Router()
const arr=require("../data/index")
app.use(express.json())
app.use(express.urlencoded({extended:false}))

router.get("/producto",(req,res)=>{                                      //Veo todos los productos
    if(arr.length==0){
        res.render("vacio",{layout:"layoutproductos.hbs", data:arr})    
    }else{
        res.render("productos",{layout:"layoutproductos.hbs", data:arr})
    }
    

})
 router.get("/productos",(req,res)=>{                                    //Renderizo Formulario
    res.render("home",{layout:"main.hbs"})
 })
router.get("/productos/:id",(req,res)=>{                                //Busco producto por /:id
    let arrnew=arr.filter((x)=> x.id==req.params.id )
    arrnew.length==0?res.send({ error : 'producto no encontrado'}):res.send(arrnew)
})
router.post("/productos",(req,res)=>{                                   //Cargo productos
    let {titulo,precio,url}=req.body
    let obj={
        titulo,
        precio,
        url
    }
    obj.id=arr.length+1
    arr.push(obj)
    console.log(arr)
    res.redirect("/productos")
    //res.send(`El producto ingresado posee un id de ${obj.id}`)
})
router.put("/productos/:id",(req,res)=>{                                //Actualizo un producto segun su /:id
    let {titulo,precio,url}=req.body
    let obj={
        titulo,
        precio,
        url
        } 
    obj.id=req.params.id
    arr[req.params.id-1]=obj
    res.send("Producto actualizado correctamente")  
 })
router.delete("/productos/:id",(req,res)=>{                             //Borro un producto segun /:id
    arr.splice(req.params.id-1,1)
    arr.length==0?res.send("No hay productos para borrar"):res.send(`Producto borrado cuyo id es = ${req.params.id}`)
})
module.exports=router