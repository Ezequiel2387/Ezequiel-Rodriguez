const socket=io()
var hoy = new Date();

socket.on("message_back",(data)=>{
    render(data)
})

const render= (data)=>{
    let html=data.map(x=>{
        var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear()+` `+hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds()
        return `
            <font size="5">
            <p>    <strong  style="color:#0000FF">${x.author.mailDelUsuario}</strong> 
            <font style="color:#8D4925">${fecha}</font>  
            <i style="color:#008000"> : ${x.mensaje}</i>
            <td><img  src=${x.author.avatar} hight="70" width="70" /></td><br>
            </p>
            </font>
            `
    })//join(" ")
    document.querySelector("#caja").innerHTML=html
}

const addMsn= ()=>{
    var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear()+` `+hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds()
    let objeto={
        mailDelUsuario:document.querySelector("#mailDelUsuario").value,
        nombreDelUsuario:document.querySelector("#nombreDelUsuario").value,
        apellidoDelUsuario:document.querySelector("#apellidoDelUsuario").value,
        edadDelUsuario:document.querySelector("#edadDelUsuario").value,
        aliasDelUsuario:document.querySelector("#aliasDelUsuario").value,
        avatar:document.querySelector("#avatar").value,
    }
    objeto.fech=fecha
    let obj={
        author:objeto,
        mensaje:document.querySelector("#mensaje").value,
        mailDelUsuario:document.querySelector("#mailDelUsuario").value,
    }
    document.querySelector("#mensaje").value=""
    socket.emit("data_client",obj)

    return false
}