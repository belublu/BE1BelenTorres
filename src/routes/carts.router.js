import express from "express";
import CartManager from "../dao/db/cart-manager-db.js";
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

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.status(201).json(newCart)
    } catch (error) {
        res.status(500).json({ error: "Error del servidor.", error })
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


router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid
    const product = req.params.pid
    const quantity = req.body.quantity || 1

    try {
        const updatedCart = await cartManager.addProductToCart(cartId, product, quantity);
        res.status(201).json(updatedCart.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error del servidor." });
    }
});


// TERMINAR DE DESARROLLAR EN CART-MANAGER ANTES DE SEGUIR
/* router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid
    const product = req.params.pid
    
    try {
        const deleteProductCart = await cartManager.
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ error: "Error del servidor." });
    }
}) */

export default router