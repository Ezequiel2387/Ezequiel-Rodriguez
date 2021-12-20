const socket=io()
//const knex = require("../knexfile")
var hoy = new Date();

socket.on("message_back",(data)=>{
    console.log(data)
    render(data)
    socket.emit("message_client","Hola Servidor")
})

const render= (data)=>{
    let html=data.map(x=>{
        var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear()+` `+hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds()

        return `
            <font size="5">
            <p>    <strong  style="color:#0000FF">${x.nombre}</strong> 
            <font style="color:#8D4925">${fecha}</font>  
            <i style="color:#008000"> : ${x.msn}</i></p>
            </font>
            `
    }).join(" ")
    document.querySelector("#caja").innerHTML=html
}

const addMsn= ()=>{

    let obj={
        nombre:document.querySelector("#nb").value,
        msn:document.querySelector("#msn").value,
    }

    document.querySelector("#msn").value=""
    socket.emit("data_client",obj)

    return false
}