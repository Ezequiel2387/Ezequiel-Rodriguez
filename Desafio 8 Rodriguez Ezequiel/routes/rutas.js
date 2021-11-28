const express=require("express")
const app=express()
const {Router}=express
const router=new Router()
const arr=require("../data/index")
const knex = require("../src/db")                                       //importe Knex
const db=require("../knexfile")
 
app.use(express.json())
app.use(express.urlencoded({extended:false}))

 router.get("/productos",(req,res)=>{                                    //Renderizo Formulario
    
    knex.from("productos")
    .select("*")
    .then(data=>{
        if (data==""){
            let arr=[{
                titulo:"No hay ningun titulo cargado",
                precio:"No hay ningun precio cargado",
                url:"https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-minus-empty-256.png"
            }]
            res.render("home",{layout:"main.hbs",data:arr})
        }else{
            res.render("home",{layout:"main.hbs",data:data})
        }
        
    }).catch(err=>{
        throw err; 
    })
    /*
    if(arr.length==0){
        let arr=[{
            titulo:"No hay ningun titulo cargado",
            precio:"No hay ningun precio cargado",
            url:"https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-minus-empty-256.png"
        }]
        res.render("home",{layout:"main.hbs",data:arr})
    }
    res.render("home",{layout:"main.hbs",data:arr})*/
 })

router.post("/productos",(req,res)=>{                                   //Cargo productos
    let {titulo,precio,url}=req.body
    let obj={
        titulo,
        precio,
        url
    };
    //obj.id=arr.length+1;
    //arr.push(obj);
    knex("productos").insert(obj)
    .then(res=>{
        console.log(knex.id)
        console.log("Se cargo un producto correctamente")
    }).catch(err=>{
        throw err;
    })
    console.log(arr)
    res.redirect("/productos")
})
module.exports=router