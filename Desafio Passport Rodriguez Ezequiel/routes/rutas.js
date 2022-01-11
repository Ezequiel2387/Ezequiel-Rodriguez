const express = require("express")
const app = express()
const { Router } = express
const router = new Router()
const arr = require("../data/index")
const faker = require("faker");
const { normalize, schema, denormalize } = require("normalizr");
require("../db");                                    //MongoDB
const mensajesmongodb = require("../models/Mensajes")  //MongoDB
const usuariomongodb = require("../models/Usuarios")
const util = require("util");
const session = require("express-session");

const passport = require("passport");
const configPassport = require("../index")
const LocalStrategy = require("passport-local").Strategy;
const data = require("../data/data")
//****************** MIDDLEWARE ****************

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const auth = (req, res, next) => {
    if (req.isAuthenticated()) return next()       //Devuelve False si no hay autenticacion o True si es validado
    res.redirect("/singup")
}
//****************** MIDDLEWARE ****************

//************************* PASSPORT ******************************

app.use(passport.initialize());
app.use(passport.session())

//***************** LOGIN *****************

passport.use("local-login", new LocalStrategy(async (username, password, done) => {
    const usuarios = await usuariomongodb.findOne({ username: username, password: password });
    if (usuarios) {
        done(null, usuarios)
        return;
    }
    done(null, false);
}))

//****************** REGISTER ******************

passport.use("local-singup", new LocalStrategy({
    username: "username",
    password: "password",
    passReqToCallback: true
}, async (req, username, password, done) => {
    const usuarios = await usuariomongodb.findOne({ username: username }); //******************* Leo Usuario en Mongo *******************
    if (usuarios) {
        console.log("El usuario ya existe")
        return done(null, false)
    }
    let obj = new usuariomongodb({                   //****************** Grabo Usuario en Mongo ******************
        username,
        password
    })
    await obj.save()
    return done(null, obj)
}))

//SERIALIZACION
passport.serializeUser((user, done) => {
    done(null, user.id)
})

//DESERIALIZACION
passport.deserializeUser(async (id, done) => {
    const user = await usuariomongodb.findOne({ "_id": id });
    done(null, user)
})

//************************* PASSPORT ******************************

router.post("/login", passport.authenticate("local-login", {
    successRedirect: "/productos",
    failureRedirect: "/faillogin",
}))

router.post("/singup", passport.authenticate("local-singup", {
    successRedirect: "/login",
    failureRedirect: "/failregister",
}))

router.get("/login", (req, res) => {
    res.render("login", { layout: "main.hbs" });
})

router.get("/singup", (req, res) => {
    res.render("singup", { layout: "main.hbs" });
})
router.get("/users", (req, res) => {
    res.send(data);
})

router.get("/faillogin", (req, res) => {
    res.render("faillogin", { layout: "main.hbs" })
})
router.get("/failregister", (req, res) => {
    res.render("failregister", { layout: "main.hbs" })
})

router.get("/api/productos-test", auth, (req, res) => {
    let arr
    for (let i = 1; i <= 5; i++) {
        arr.push(
            {
                titulo: faker.commerce.product(),
                precio: faker.commerce.price(),
                url: faker.image.image()
            }
        )
    }
    res.render("faker", { layout: "main.hbs", data: arr })
})

router.get("/productos", auth, (req, res) => {                                    //Renderizo Formulario
    const getAllProduct = async () => {                            //Muestra todos los Productos
        const products = await mensajesmongodb.find().lean();
        return products;
    }
    getAllProduct().then(response => {
        console.log(req.user)
        let objParaNormalizar = {
            id: "999",

        }
        objParaNormalizar.mensajes = response
        const porcentaje = normalizarObjeto(objParaNormalizar)
        console.log("El porcentaje al cual ha sido reducido es a %", porcentaje.toFixed(2))
        const porcentajeAcotado = porcentaje.toFixed(2)
        res.render("home", { layout: "main.hbs", data: response, por: porcentajeAcotado, datos: arr, usuario: req.user.username })
    }).catch((err) => {
        console.log(err)
    })
})

router.post("/productos", (req, res) => {                                   //Cargo productos
    let { titulo, precio, url } = req.body;
    let obj = {
        titulo,
        precio,
        url
    }
    obj.id = arr.length + 1;
    arr.push(obj);
    res.redirect("/productos");
})


router.get("/logout", (req, res) => {

    req.session.destroy((err) => {
        if (err) console.log("Error en logout");
        res.render("logout", { layout: "main.hbs", usuario: req.user.username });
    })
})


function normalizarObjeto(objParaNormalizar) {
    const authorSchema = new schema.Entity("authoresss", {}, { idAttribute: "mailDelUsuario" })
    const commentsSchema = new schema.Entity("mensajesss", {
        author: authorSchema,
        mensajes: [authorSchema]
    })

    const normaLIizePost = normalize(objParaNormalizar, commentsSchema)
    //console.log(util.inspect(normaLIizePost,false,12,true));          
    const desnormalizePost = denormalize(normaLIizePost.result, commentsSchema, normaLIizePost.entities)
    //console.log(util.inspect(desnormalizePost,false,12,true));     
    console.log("Tamaño Normalizado = ", JSON.stringify(normaLIizePost).length)
    console.log("Tamaño Desnormailizado", JSON.stringify(desnormalizePost).length)
    const porcentaje = ((JSON.stringify(normaLIizePost).length) / (JSON.stringify(desnormalizePost).length)) * 100
    return porcentaje
}


module.exports = router