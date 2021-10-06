const { application } = require("express")
const express=require("express")
const app=express()
const {Router}=express
const router=new Router()
app.use(express.json())

const data=[{
    title: "Tapa de cilindros",
    price: 1111,
    thumbnail: "url",
    id:"1"
    },
    {
    title: "Valvulas",
    price: 2222,
    thumbnail: "url",
    id:"2"
    },
    {
    title: "Pistones",
    price: 3333,
    thumbnail: "url",
    id:"3"
    }
]

router.get("/productosregister",(req,res)=>{
    res.sendFile(__dirname + "/public/index.html")    
})


router.get("/productos",(req,res)=>res.send({informacion: data}))   //Veo todos los productos

router.get("/productos/:id",(req,res)=>{                            //Busco producto por /:id
    let arrnew=data.filter((x)=> x.id==req.params.id )
    arrnew.length==0?res.send({ error : 'producto no encontrado'}):res.send(arrnew)
})
 
router.post("/productos",(req,res)=>{                               //Cargo productos
let {title, price, thumbnail,id} = req.body
    let obj={                               
         title,                          
         price,                  
         thumbnail,
         id
    }                            
    data.length==0?obj.id=1:obj.id=data.length+1
    data.push(obj)
    res.status(201).send(`El producto creado es ${obj.title}
    El precio es de ${obj.price}
    Su url es ${obj.thumbnail}
    Su id es ${obj.id}`)
})

 router.put("/productos/:id",(req,res)=>{                               //Actualizo un producto segun su /:id
    let {title, price, thumbnail,id} = req.body
    let obj={                               
         title,                          
         price,                  
         thumbnail,
         id
    }  
    obj.id=req.params.id
    let datanew=JSON.stringify(data,null,2)
    let objnew=JSON.stringify(obj,null,2)
    data[req.params.id-1]=obj
    console.log(`req params es igual a = ${req.params.id}`)
    console.log(obj)
    console.log("hola")
    console.log(data)
    res.send("Producto actualizado correctamente")  
 })
 
router.delete("/productos/:id",(req,res)=>{                             //Borro un producto segun /:id
    data.splice(req.params.id-1,1)
    res.send(`Producto borrado cuyo id es = ${req.params.id}`)
})
module.exports=router
