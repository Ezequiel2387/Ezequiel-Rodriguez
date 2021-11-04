const express=require("express")
const app=express()
const {Router}=express
const router=new Router()
const arr=require("../data/index")
app.use(express.json())
app.use(express.urlencoded({extended:false}))

 router.get("/productos",(req,res)=>{                                    //Renderizo Formulario
    if(arr.length==0){
        let arr=[{
            titulo:"No hay ningun titulo cargado",
            precio:"No hay ningun precio cargado",
            url:"https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-minus-empty-256.png"
        }]
        res.render("home",{layout:"main.hbs",data:arr})
    }
    res.render("home",{layout:"main.hbs",data:arr})
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
module.exports=router