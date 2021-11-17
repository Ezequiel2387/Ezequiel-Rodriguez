const express=require("express")
const app=express()
const {Router}=express
const router=new Router()
const arr=require("../data/index")
const carritocargado=require("../data/carritocargado")
const carrito=require("../data/carrito")
const { json } = require("express")
app.use(express.json())
app.use(express.urlencoded({extended:false}))

router.post("/",(req,res)=>{                                   //Creo carrito con su Id
    
    let obj={}
    obj.horacarr=new Date()

    const aux = carrito.map(carro=>carro.idcarr);
    console.log("aux",aux)
    uniq = [...new Set(aux)];
    console.log(uniq)
    obj.idcarr = uniq ? uniq.length+1 : 1
    carrito.push(obj)
    res.render("carritocreado",{data:obj})
})


    router.get("/",(req,res)=>{                                //Renderizo Formulario de id del carrito
    res.render("carrito",{})
    })

router.delete("/:id",(req,res)=>{                              //Borro un producto segun /:id
    carrito.splice(req.params.id-1,1)
    if(carrito.length+1<req.params.id){
        res.send("Id no existe")
    }
    carrito.length==0?res.send("No hay carritos para borrar"):res.send(`Producto borrado cuyo id es = ${req.params.id}`)
})
router.get("/:id/productos",(req,res)=>{                                    //Renderizo Formulario 
    res.render("carritolistado",{data:req.params.id})
})
router.post("/:id/:producto",(req,res)=>{                                   //Cargo productos
    
    if(carrito[req.params.id-1].producto){
        // console.log("Propiedad ya existe")
        // let aux=req.params.id-1
        // carrito.push(arr[req.params.producto-1])
        let obj={}
        obj.idcarr=carrito[0].idcarr
        obj.horacarr=carrito[0].horacarr
        Object.defineProperty(obj, "producto",{value:arr[req.params.producto-1] ,writable:true,enumerable:true})
        carrito.push(obj)
    }else{
        Object.defineProperty(carrito[req.params.id-1], "producto",{value:arr[req.params.producto-1] ,writable:true,enumerable:true})
    }
    
    
    let dato={
        nombre:"Eze",
        edad:34
    }
    res.send(carrito)

})
    // let obj=[
    //      idcar=req.params.id,
    //      horacarr=Date.now()
    //      ]
    // JSON.stringify(obj,null,2)
    // let prodbuscado=arr.filter((x)=> x.id==req.params.producto)
    // let idbuscado=carrito.filter((x)=> x.idcarr==req.params.id)
    // console.log(typeof(idbuscado[0].idcarr))
    // if(typeof(idbuscado)== false){
    //     res.send("No existe ese Id")
    // }
    // let aux=idbuscado[0].idcarr
    // JSON.stringify(prodbuscado,null,2)
    
    // if(carritocargado==0){
    //     obj.splice(2,0,prodbuscado)
    //     carritocargado.push(obj)
    //     res.send(carritocargado) 
    // }else{
    //     carritocargado.splice(2,0,prodbuscado)
    //     res.send(carritocargado)
    //     }
    // })

module.exports=router
