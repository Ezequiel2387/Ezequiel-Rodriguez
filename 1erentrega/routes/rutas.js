const express=require("express")
const app=express()
const {Router}=express
const router=new Router()
const arr=require("../data/index")
app.use(express.json())
app.use(express.urlencoded({extended:false}))

router.get("/producto",(req,res)=>{                            //Veo todos los productos
    if(arr.length==0){
        res.render("vacio.ejs")
    }else{
        res.render("productoslistados",{data:arr})
    }   
})
router.get("/",(req,res)=>{                                    //Renderizo Formulario
    res.render("productos",{})
})
router.get("/:id",(req,res)=>{                                //Busco producto por /:id
    let arrnew=arr.filter((x)=> x.id==req.params.id )
    arrnew.length==0?res.send({ error : 'producto no encontrado'}):res.send(arrnew)
})
router.post("/",(req,res)=>{                                   //Cargo productos
    console.log(req.query.name)
    if(req.query.name=="admin")
    {    
        let {titulo,descripcion,codigo,url,precio,stock}=req.body
        let obj={
        titulo,
        descripcion,
        codigo,
        url,
        precio,
        stock
    }
    obj.hora=new Date()
    obj.id=arr.length+1
    arr.push(obj)
    res.redirect("/api/productos")
    }else{
        res.send("Usted no es dministrador")
    }

})
router.put("/:id",(req,res)=>{                                //Actualizo un producto segun su /:id
    if(req.query.name=="admin")
        {  
        let {titulo,descripcion,codigo,url,precio,stock}=req.body
        let obj={
            titulo,
            descripcion,
            codigo,
            url,
            precio,
            stock
        }
        obj.hora=new Date()
        obj.id=req.params.id
        arr[req.params.id-1]=obj
        res.send("Producto actualizado correctamente")  
    }else{
        res.send("Usted no es dministrador")
    }
    })
router.delete("/:id",(req,res)=>{                             //Borro un producto segun /:id
    arr.splice(req.params.id-1,1)
    arr.length==0?res.send("No hay productos para borrar"):res.send(`Producto borrado cuyo id es = ${req.params.id}`)
})
module.exports=router