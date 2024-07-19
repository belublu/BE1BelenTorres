import express from "express"
import CartManager from "../dao/db/cart-manager-db.js"
import CartModel from "../dao/models/cart.model.js"

const router = express.Router()
const cartManager = new CartManager()

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.json(carts)
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" })
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid
    try {
        const cart = await CartModel.findById(cartId)
        if (cart) {
            res.json(cart.products)
        } else {
            res.status(404).json({ error: "El carrito no ha sido encontrado." })
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito." })
    }
})

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.status(201).json(newCart)
    } catch (error) {
        res.status(500).json({ error: "Error del servidor.", error })
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid
    const product = req.params.pid
    const quantity = req.body.quantity || 1
    try {
        const updatedCart = await cartManager.addProductToCart(cartId, product, quantity)
        res.status(201).json(updatedCart.products)
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error)
        res.status(500).json({ error: "Error del servidor." })
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        const result = await cartManager.deleteProductFromCart(cid, pid)
        if (result) {
            res.status(200).json({ message: 'Producto eliminado del carrito con éxito' })
        } else {
            res.status(404).json({ message: 'Carrito o producto no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error })
    }
});

router.put("/:cid", async (req, res) => {
    const {cid} = req.params
    const {products} = req.body
    try {
        const result = await cartManager.updateCart(cid, products)
        if(result) {
            res.status(200).json({message: "El carrito se ha actualizado con éxito."})
        } else {
            res.status(404).json({message: "Carrito no encontrado."})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error al actualizar el carrito", error})
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    const {cid, pid} = req.params
    const {quantity} = req.body

    if(typeof quantity !== "number" || quantity <= 0){
        return res.status(400).json({message: "La cantidad a agregar debe ser un número positivo."})
    }

    try {
        const result = await cartManager.updateProdQuantity(cid, pid, quantity)
        if(result){
            res.status(200).json({message: "La cantidad de productos ha sido actualizada con éxito."})
        } else {
            res.status(404).json({message: "Carrito o producto no encontrado."})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error al actualizar la cantidad del producto solicitada.", error})
    }
})

router.delete("/:cid", async (req, res) => {
    const {cid} = req.params
    try {
        const result = await cartManager.emptyCart(cid)
        if(result){
            res.status(200).json({message: "El carrito se ha vaciado."})
        } else {
            res.status(400).json({message: "El carrito no se ha encontrado."})
        }
    } catch (error) {
        res.status(500).json({message: "Error al vaciar el carrito", error})
    }
})

export default router