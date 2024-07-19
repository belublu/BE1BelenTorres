import express from "express"
import ProductManager from "../dao/db/product-manager-db.js"

const router = express.Router()
const productManager = new ProductManager()

router.get("/", async (req, res) => {
    try {
        const {page = 1, sort= "asc", query, limit = 10} = req.query
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
            query,
        }
        const products = await productManager.getProducts(query ? {category: query} : {}, options)
        console.log("Productos obtenidos:", products.docs)

        const prevLink = products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null;
        const nextLink = products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null;

        res.json({
            status: "sucess",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink,
            nextLink
        })
    } catch (error) {
        console.error("Ha ocurrido un error al obtener los productos.", error)
        res.status(500).json({ error: "Error al obtener el producto", details: error.message })

    }
})

router.get("/:pid", async (req, res) => {
    const id = req.params.pid
    try {
        const product = await productManager.getProductById(id)
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
        await productManager.updateProduct(id, productUpdated)
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
        await productManager.deleteProduct(id, productDeleted)
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