const express=require("express");
const app=express();
const {Router}=express;
const router=new Router();
const carritoEnMemoria=require("../data/carrito");
const productosEnMemoria=require("../data/productos");
const fs = require("fs");
const { count } = require("console");
const { send } = require("process");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

router.get("/",(req,res)=>{                                         //Renderizo Formulario de id del carrito
    res.render("crearCarrito",{});
    })
router.get("/carritos",(req,res)=>{                                 //Renderizo Todos los Carritos
    
    fs.readFile("./data/carrito.txt","utf-8",(err,data)=>{
        if (err)
        {
            res.render("mainSinCarritos.ejs")
        }else{
            if(data==""|| data=="[]"){
                res.render("mainSinCarritos.ejs")
            }else{
                let archivoCarrito=JSON.parse(data,null,2);             //En Fromato Objeto
                res.render("carritosListados",{data:archivoCarrito}); 
            }
        }
    })
})
router.post("/",(req,res)=>{                                        //Creo carrito con su Id
   
    fs.readFile("./data/carrito.txt","utf-8",(err,data)=>{
        if (err)
        {
            throw "Hubo un error al leer"
        }else
        {
            console.log(data)
            let objEnObj=JSON.parse(data,null,2)
            let obj={};

            obj.horaCarritoCreado=new Date();
            const aux = objEnObj.map(carro=>carro.idCarrito);

            if(aux==""){
                uniq = [...new Set(aux)];
                obj.idCarrito = uniq ? uniq.length+1 : 1
            }else
            {        
                let ultimoId= Math.max.apply(null,aux)+1;                   //Ultimo Id del Array
                obj.idCarrito=ultimoId  
            }
            objEnObj.push(obj);
    
            let objEnString=JSON.stringify(objEnObj,null,2)

            fs.writeFile("./data/carrito.txt",objEnString,"utf-8",(err)=>{
            if (err) throw "Hubo un error al escribir"})
            res.render("carritoCreado",{data:obj});
        }
    })
})
router.delete("/:id",(req,res)=>{                                   //Borro un Carrito segun /:id
    
    fs.readFile("./data/carrito.txt","utf-8",(err,data)=>{
        if (err){
            throw "Hubo un error al leer"
        }else{
            let objEnObj=JSON.parse(data,null,2);
            let soloIdDeCarrito=objEnObj.map(x=>x.idCarrito);
            let posicionDelIdDelCarrito=soloIdDeCarrito.indexOf(parseInt(req.params.id));
            objEnObj.splice(posicionDelIdDelCarrito,1);          
            if(objEnObj.length==0){
                fs.writeFile("./data/carrito.txt",JSON.stringify(objEnObj,null,2),"utf-8",(err)=>{
                    if (err) throw "Hubo un error al escribir"
                })
                res.send(`Carrito borrado cuyo id era = ${req.params.id}
                Ya no hay mas Caritos para borrar`);
            }else{
                fs.writeFile("./data/carrito.txt",JSON.stringify(objEnObj,null,2),"utf-8",(err)=>{
                    if (err) throw "Hubo un error al escribir"
                })
                res.send(`Carrito borrado cuyo id era = ${req.params.id}`);
            }
        }
    })
})
router.get("/:id/productos",(req,res)=>{                            //Muestro los productos cargados de "x"carrito
    
    fs.readFile("./data/carrito.txt","utf-8",(err,data)=>{
        if (err){
            throw "Hubo un error al leer el carrito"
        }else{            
            let objEnObj=JSON.parse(data,null,2);
            let soloIdDeCarritos=objEnObj.map(x=>x.idCarrito)       //soloIdDeCarritos es un array con solo IdCarrito
            let posicionDelIdDelCarrito=soloIdDeCarritos.indexOf(parseInt(req.params.id))
            console.log(`objEnObj= ${objEnObj} 
            soloIdDeCarritos= ${soloIdDeCarritos}
            posicionDelIdDelCarrito= ${posicionDelIdDelCarrito}`)

  

            if(objEnObj[posicionDelIdDelCarrito]){
                res.send(objEnObj[posicionDelIdDelCarrito])
            }else{
                res.send("El carrito seleccionado no existe")
            }
        }
    })
})   
router.post("/:id/:producto",(req,res)=>{                                   //Cargo productos
    
    fs.readFile("./data/carrito.txt","utf-8",(err,data)=>{
        if (err){
            throw "Hubo un error al leer el carrito"
        }else{
        fs.readFile("./data/productos.txt","utf-8",(err,prod)=>{
            if (err){
                throw "Hubo un error al leer el producto"
            }else{
                let objEnObj=JSON.parse(data,null,2);
                let soloIdDeCarritos=objEnObj.map(x=>x.idCarrito)       //soloIdDeCarritos es un array con solo IdCarrito
                let posicionDelIdDelCarrito=soloIdDeCarritos.indexOf(parseInt(req.params.id))
            if(posicionDelIdDelCarrito=="-1"){
                res.send("No existe el carrito seleccionado")
            }
            let objEnObjprod=JSON.parse(prod,null,2);

            if(objEnObj[posicionDelIdDelCarrito].producto){
                let obj={}
                obj.idCarrito=objEnObj[posicionDelIdDelCarrito].idCarrito
                obj.horaCarritoCreado=objEnObj[posicionDelIdDelCarrito].horaCarritoCreado

                Object.defineProperty(obj, "producto",{value:objEnObjprod[req.params.producto-1] ,writable:true,enumerable:true})
                objEnObj.push(obj)
            }else{
                Object.defineProperty(objEnObj[posicionDelIdDelCarrito], "producto",{value:objEnObjprod[req.params.producto-1] ,writable:true,enumerable:true})
            }
            fs.writeFile("./data/carrito.txt",JSON.stringify(objEnObj,null,2),"utf-8",(err)=>{
                if (err) throw "Hubo un error al escribir"
            })
            res.send(objEnObj)
        }})
    }
})
})

router.delete("/:id/productos/:id_prod",(req,res)=>{                //Borro un "x" Producto de un "x" Carrito segun /:id
    fs.readFile("./data/carrito.txt","utf-8",(err,data)=>{
        if (err){
            throw "Hubo un error al leer"
        }else{    
            let objEnObj=JSON.parse(data,null,2);
            let eliminoProductos=objEnObj.map(x=>{
                if (x.producto){
                    if(x.producto.id==req.params.id_prod && x.idCarrito==req.params.id)
                    return x.idCarrito   
                }
            })
            let posicionDelProductoABorrar=eliminoProductos.indexOf(parseInt(req.params.id))
            if(posicionDelProductoABorrar==-1){res.send("No se puede borrar lo que usted selecciono")}
            else{
                console.log(posicionDelProductoABorrar)
                removed=objEnObj.splice(posicionDelProductoABorrar,1)
                console.log(objEnObj)
                fs.writeFile("./data/carrito.txt",JSON.stringify(objEnObj,null,2),"utf-8",(err)=>{
                    if (err) throw "Hubo un error al escribir"
                    })
                res.send("Producto borrado con exito")  
            }
 }
    })
})

module.exports=router;