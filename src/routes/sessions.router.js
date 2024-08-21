import { Router } from "express"
import { createHash, isValidPassword } from "../util/hashbcrypt.js"
import UserModel from "../dao/models/users.models.js"
import passport from "passport"
import jwt from "jsonwebtoken"
const router = Router()

// Registro
router.post("/register", async(req, res) => {
    const {user, first_name, last_name, email, age, password, rol} = req.body
    try {
        const userExist = await UsuarioModel.findOne({user})
        if(userExist) {
            return res.status(400).json({ error: "El usuario ya existe", error })
        }

        const newUser = new UserModel({
            user,
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            rol
        })

        await newUser.save()

        const token = jwt.sign({user: newUser.user, role: newUser.rol}, "pepita", {expiresIn: "1h"})

        res.cookie("pepitaCookieToken", token, {
            maxAge: 360000,
            httpOnly: true
        })

        res.redirect("/api/sessions/current")
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor"})
    }
})

// Login
router.post("/login", async(req, res) => {
    const {user, password} = req.body
    try {
        const userFind = await UserModel.findOne({user})

        if(!userFind){
            return res.status(401).json({error: "Usuario no válido"})
        }

        if(!isValidPassword(password, userFind)) {
            return res.status(401).json("La contraseña es incorrecta")
        }

        const token = jwt.sign({user: userFind.user, rol: userFind.rol}, "pepita", {expiresIn: "1h"})

        res.cookie("pepitaCookieToken", token, {
            maxAge: 360000,
            httpOnly: true
        })

        res.redirect("/api/sessions/current")
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor"})
    }
})

// Current
router.get("/current", passport.authenticate("jwt", {session: false}), (req, res) => {
    if(req.user){
        res.render("home", {user: req.user.usuario})
    }else {
        res.status(401).json({error: "Usuario no autorizado"})
    }
})

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("pepitaCookieToken")

    res.redirect("/login")
})

// Ruta para admins
router.get("/admin", passport.authenticate("jwt", {session: false}), (req, res) => {
    if(req.user.rol != "admin") {
        return res.status(403).json({error: "Acceso denegado"})
    }
    res.render("admin", {user: req.user.user})
})

export default router