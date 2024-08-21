import { Router } from "express"
import { createHash, isValidPassword } from "../util/hashbcrypt.js"
import UserModel from "../dao/models/users.models.js"
import passport from "passport"
import jwt from "jsonwebtoken"
const router = Router()

// Registro
router.post("/register", async (req, res) => {
    console.log("Datos recibidos:", req.body);

    const { user, first_name, last_name, email, age, password, role } = req.body
    try {
        const userExist = await UserModel.findOne({ user })
        if (userExist) {
            console.log("Usuario ya existe");

            return res.status(400).json({ error: "El usuario ya existe", error })
        }

        console.log("Creando nuevo usuario");

        const newUser = new UserModel({
            user,
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role
        })

        console.log("Usuario guardado exitosamente");

        await newUser.save()

        const token = jwt.sign({
            user: newUser.user,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            age: newUser.age,
            role: newUser.role
        }, "pepita", { expiresIn: "1h" })

        res.cookie("pepitaCookieToken", token, {
            maxAge: 360000,
            httpOnly: true
        })
        console.log("Redirigiendo a /api/sessions/current");

        res.redirect("/api/sessions/current")
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor", details: error.message })
    }
})

// Login
router.post("/login", async (req, res) => {
    const { user, password } = req.body
    console.log("el usuario es", user)
    try {
        const userFind = await UserModel.findOne({ user })

        if (!userFind) {
            console.log("Usuario no encontrado:", user);
            return res.status(401).json({ error: "Usuario no válido" })
        }

        if (!isValidPassword(password, userFind)) {
            console.log("Contraseña incorrecta para el usuario:", user);

            return res.status(401).json("La contraseña es incorrecta")
        }

        const token = jwt.sign({
            user: userFind.user,
            first_name: userFind.first_name,
            last_name: userFind.last_name,
            age: userFind.age,
            email: userFind.email,
            role: userFind.role
        }, "pepita", { expiresIn: "1h" })

        res.cookie("pepitaCookieToken", token, {
            maxAge: 360000,
            httpOnly: true
        })

        res.redirect("/api/sessions/current")
    } catch (error) {
        console.error("Error durante el login:", error);

        return res.status(500).json({ error: "Error interno del servidor" })
    }
})

// Current
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        console.log(req.user)
        res.render("home", {
            user: req.user.user,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        })
    } else {
        res.status(401).json({ error: "Usuario no autorizado" })
    }
})

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("pepitaCookieToken")

    res.redirect("/login")
})

// Ruta para admins
router.get("/admin", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user.role != "Admin") {
        return res.status(403).send("Acceso sólo para administradores")
    }
    console.log(req.user.user)
    res.render("admin", { user: req.user.user })
})

export default router