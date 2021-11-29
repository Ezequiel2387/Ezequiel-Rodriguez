
exports.up = function(knex) {
    knex.schema.createTableIfNotExists("ecommerce",(table)=>{
        table.string("nombre");
        table.string("msn");
        table.string("fecha")
    })
    
    .then(()=>{
        console.log("Tabla creada")
    })
    .catch(err=>{
        console.log(err)
    })
    
};

exports.down = function(knex) {
  
};
