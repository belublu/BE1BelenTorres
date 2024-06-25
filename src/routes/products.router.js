import express from "express";
import ProductManager from "../controllers/product-manager.js";

const router = express.Router()
const productManager = new ProductManager("src/models/products.json")


router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productManager.getProducts()
        if (limit) {
            res.json(products.slice(0, parseInt(limit)))
        } else {
            res.json(products)
        }
    } catch (error) {
        console.error("Ha ocurrido un error al obtener los productos.", error)
        res.status(500).json({error: "Error al obtener el producto"})
    }
})


router.get("/:pid", async (req, res) => {
    const id = req.params.pid

    try {
        const product = await productManager.getProductById(parseInt(id))
        if(!product){
            res.status(404).json({error: "El producto no ha sido encontrado."})
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({error: "Error al obtener el producto"})
    }
})


router.post("/", async (req, res) => {
    const newProduct = req.body
    
    try {
        await productManager.addProduct(newProduct)
        res.status(201).json({message: "El producto ha sido agregado correctamente."})
    } catch (error) {
        res.status(500).json({error: "Error del servidor."})
    }
})


router.put("/:pid", async (req, res) => {
    const id = req.params.pid
    const productUpdated = req.body
    
    try {
        await productManager.updateProduct(parseInt(id), productUpdated)
        if(productUpdated){
            res.status(201).json("El producto se ha actualizado correctamente.")
        }else{
            res.status(404).json({error: "Producto no encontrado"})
        }
    } catch (error) {
        res.status(500).json({error: "Error al actualizar el producto.", error})
    }
})


router.delete("/:pid", async (req, res) => {
    const id = req.params.pid
    const productDeleted = req.body
    
    try {
        await productManager.deleteProduct(parseInt(id), productDeleted)
        if(productDeleted){
            res.status(201).json("El producto se ha eliminado correctamente.")
        }else{
            res.status(404).json({error: "Producto no encontrado"})
        }
    } catch (error) {
        res.status(500).json({error: "Error al actualizar el producto.", error})
    }
})


export default router