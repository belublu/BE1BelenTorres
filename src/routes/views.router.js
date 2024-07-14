import express from "express"
import ProductManager from "../dao/fs/product-manager.js" 

const router = express.Router()
const productManager = new ProductManager("src/models/products.json") 

router.get("/", async (req, res) => {
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

