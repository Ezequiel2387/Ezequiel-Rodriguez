const knex = require("knex")({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "",
        database: "desafio8"
    },
    pool:{min:2, max:8}         //Van a ver las consultas, o hilos de consultas, 
})                              //si se pasa de 8 empieza a leerlas en FIFO First In First Out
knex.schema.createTableIfNotExists("productos",(table)=>{
    table.increments("id").primary();
    table.string("titulo");
    table.string("precio");
    table.string("url")
})

.then(()=>{
    console.log("Tabla creada")
})
.catch(err=>{
    console.log(err)
})

module.exports = knex