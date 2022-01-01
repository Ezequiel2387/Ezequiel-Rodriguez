const express=require("express")
const app=express()
const {Router}=express
const router=new Router()
const arr=require("../data/index")
const faker=require("faker");
const {normalize,schema,denormalize}=require("normalizr");
require("../db");                                    //MongoDB
const mensajesmongodb=require("../models/Mensajes")  //MongoDB
const util=require("util");
app.use(express.json())
app.use(express.urlencoded({extended:false}))

router.get("/api/productos-test",(req,res)=>{
    let arr=[]
for(let i=1;i<=5;i++){

    arr.push(
        {
            titulo:faker.commerce.product(),
            precio:faker.commerce.price(),
            url:faker.image.image()
        }
    )

}

res.render("faker",{layout:"main.hbs",data:arr})
})


 router.get("/productos",(req,res)=>{                                    //Renderizo Formulario
    
    const getAllProduct =async ()=>{                            //Muestra todos los Productos
        const products= await mensajesmongodb.find().lean();
        return products;
    }
    
    getAllProduct().then(response =>{
        //console.log("Lo que obtengo de Mb es =",response)
        
        let objParaNormalizar={
            id:"999",
            
        }
        objParaNormalizar.mensajes=response
        const porcentaje = normalizarObjeto(objParaNormalizar)
        console.log("El porcentaje al cual ha sido reducido es a %",porcentaje.toFixed(2))
        const porcentajeAcotado=porcentaje.toFixed(2)


        function normalizarObjeto (objParaNormalizar){
            const authorSchema=new schema.Entity("authoresss",{},{idAttribute:"mailDelUsuario"})
            const commentsSchema=new schema.Entity("mensajesss",{
              author:authorSchema,    
              mensajes:[authorSchema]
            })
            
            const normaLIizePost=normalize(objParaNormalizar,commentsSchema)
            //console.log(util.inspect(normaLIizePost,false,12,true));          
            const desnormalizePost= denormalize(normaLIizePost.result,commentsSchema,normaLIizePost.entities)
            //console.log(util.inspect(desnormalizePost,false,12,true));     
            console.log("Tamaño Normalizado = ",JSON.stringify(normaLIizePost).length)
            console.log("Tamaño Desnormailizado",JSON.stringify(desnormalizePost).length)   
            const porcentaje=((JSON.stringify(normaLIizePost).length)/(JSON.stringify(desnormalizePost).length))*100
            return porcentaje
          }

        res.render("home",{layout:"main.hbs",data:response,por:porcentajeAcotado})
    }).catch((err)=>{
        console.log(err)
    })
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
    //console.log(arr)
    res.redirect("/productos")
})
module.exports=router