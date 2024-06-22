import express from "express"
import ProductManager from "../controllers/product-manager.js" 


const router = express.Router()

const productManager = new ProductManager("src/models/products.json") // Acá creo una instancia de la clase ProductManager que gestionará las operaciones relacionadas
                                                                      // con los productos. Le pasamos como argumento la ruta al archivo JSON que contiene la información
                                                                      // de los productos.


router.get("/", async (req, res) => { // En el bloque tryCatch intento obtener todos los productos utilizando el método getProducts() de productManager.
    try {
        const products = await productManager.getProducts()
        res.render("home", { products })
    } catch (error) {
        res.status(500).json({error: "Error al cargar los productos", error})
    }
    
}) 

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.render("realtimeproducts", { products })
    } catch (error) {
        res.status(500).json({error: "Error al cargar los productos", error})
    }
})



export default router

