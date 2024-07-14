import express from "express";
import CartManager from "../dao/fs/cart-manager.js";

const router = express.Router()
const cartManager = new CartManager("./src/models/carts.json")

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.json(carts)
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" })
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid)

    try {
        const cart = await cartManager.getCartById(cartId)
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
        res.status(201).json({ id: newCart.id })
    } catch (error) {
        res.status(500).json({ error: "Error del servidor.", error })
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const product = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updatedCart = await cartManager.addProductToCart(cartId, product, quantity);
        res.status(201).json(updatedCart.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error del servidor." });
    }
});

export default router