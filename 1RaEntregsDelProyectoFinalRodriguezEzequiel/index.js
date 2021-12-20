const express=require("express");
const app=express();
const Port=process.env.Port || 8080;
const carrito=require("./routes/carrito");
const productos=require("./routes/productos");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set("views",__dirname+"/views");
app.set("view engine", "ejs");

app.use("/api/productos",productos);
app.use("/api/carrito",carrito);

app.listen(Port,()=>console.log(`Port is running on ${Port}`));
