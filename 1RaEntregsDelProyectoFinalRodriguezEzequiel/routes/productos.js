const express=require("express");
const app=express();
const {Router}=express;
const router=new Router();
const productosEnMemoria=require("../data/productos");
const fs = require("fs");
const { json } = require("express");

app.use(express.json())
app.use(express.urlencoded({extended:false}))

router.get("/main",(req,res)=>{                                 //Veo todos los productos
    fs.readFile("./data/productos.txt","utf-8",(err,data)=>{
        if (err)
        {
            res.render("mainSinProductos.ejs")
        }else{
            if(data==""|| data=="[]"){
                res.render("mainSinProductos.ejs")
            }else{
                let archivoProducto=JSON.parse(data,null,2);             //En Fromato Objeto
                res.render("productosCargados",{data:archivoProducto}); 
            }
        }
    })
})
router.get("/",(req,res)=>{                                     //Renderizo Formulario
    res.render("productoFormulario",{});
})
router.get("/:id",(req,res)=>{                                //Busco producto por /:id
        
    fs.readFile("./data/productos.txt","utf-8",(err,data)=>{
        if (err) throw "Hubo un error al leer"
        let objEnObj=JSON.parse(data,null,2)
        let arrnew=objEnObj.filter((x)=> x.id==req.params.id )
        arrnew.length==0?res.render("mainSinProductos.ejs"):res.render("productosCargados",{data:arrnew})
    })
})
router.post("/",(req,res)=>{                                   //Cargo productos
    
    fs.readFile("./data/productos.txt","utf-8",(err,data)=>{
        if (err) throw "Hubo un error al leer"
        let objEnObj=JSON.parse(data,null,2)
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
        obj.hora=new Date();
        obj.id=objEnObj.length+1;  
        objEnObj.push(obj);

        fs.writeFile("./data/productos.txt",JSON.stringify(objEnObj,null,2),"utf-8",(err)=>{
            if (err) throw "Hubo un error al escribir"
        })
        res.redirect("/api/productos");
        }else{
        res.send("Usted no es dministrador");
        }
    })
})
//     if(req.query.name=="admin")
//     {    
//         let {titulo,descripcion,codigo,url,precio,stock}=req.body
//         let obj={
//         titulo,
//         descripcion,
//         codigo,
//         url,
//         precio,
//         stock
//     }
//     obj.hora=new Date();
//     obj.id=productosEnMemoria.length+1;
//     productosEnMemoria.push(obj);

//     let objEnString=JSON.stringify(productosEnMemoria,null,2)

//     fs.writeFile("./data/productos.txt",objEnString,"utf-8",(err)=>{
//         if (err) throw "Hubo un error al escribir"
//         })

//     res.redirect("/api/productos");
//     }else{
//         res.send("Usted no es dministrador");
//     }
// })
router.put("/:id/:name",(req,res)=>{                                //Actualizo un producto segun su /:id
    if(req.params.name=="admin")
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
        obj.hora=new Date();
        obj.id=req.params.id;
        productosEnMemoria[req.params.id-1]=obj;
        console.log(obj)
        fs.readFile("./data/productos.txt","utf-8",(err,data)=>{
            if (err) throw "Hubo un error al leer"
            let objEnObj=JSON.parse(data,null,2)
            objEnObj[req.params.id-1]=obj
            console.log(objEnObj)
            fs.writeFile("./data/productos.txt",JSON.stringify(objEnObj,null,2),"utf-8",(err)=>{
                if (err) throw "Hubo un error al escribir"
            })
        })

        res.send("Producto actualizado correctamente");  
    }else{
        res.send("Usted no es dministrador");
    }
})
router.put("/:id",(req,res)=>{                                      //Aviso al PUT que no es admin
    res.send("Usted no es dministrador");
})
router.delete("/:id/:name",(req,res)=>{                             //Borro un producto segun /:id
    if(req.params.name=="admin")
    {  
        fs.readFile("./data/productos.txt","utf-8",(err,data)=>{
            if (err) throw "Hubo un error al leer"
            let objEnObj=JSON.parse(data,null,2);

            let soloIdDeProductos=objEnObj.map(x=>x.id);
            let posicionDelIdDelProducto=soloIdDeProductos.indexOf(parseInt(req.params.id));
            
            objEnObj.splice(posicionDelIdDelProducto,1);          
            if(objEnObj.length==0){
                res.send("No hay productos para borrar");
                fs.writeFile("./data/productos.txt",JSON.stringify(objEnObj,null,2),"utf-8",(err)=>{
                    if (err) throw "Hubo un error al escribir"
                })
            }else{
                fs.writeFile("./data/productos.txt",JSON.stringify(objEnObj,null,2),"utf-8",(err)=>{
                    if (err) throw "Hubo un error al escribir"
                })
                res.send(`Producto borrado cuyo id era = ${req.params.id}`);
            }

        })
    }else{res.send("Usted no es dministrador");}
})
router.delete("/:id",(req,res)=>{                                      //Aviso al DELETE que no es admin
    res.send("Usted no es dministrador");
})

module.exports=router;