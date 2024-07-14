import CartModel from "../models/cart.model.js"

class CartManager {
    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id)
            if (!cart) {
                throw new Error(`No existe un carrito con id ${id}`)
            }
            return cart
        } catch (error) {
            console.error("No se ha encontrado el carrito con ese id.", error)
            throw error
        }
    }

    async createCart() {
        try {
            const newCart = new CartModel({ product: [] })
            await newCart.save()
            return newCart
        } catch (error) {
            console.error("No se ha podido crear el carrito.", error)
            throw error
        }
    }

    async addProductToCart(id, product, quantity = 1) {
        try {
            const cart = await this.getCartById(id)
            const productExist = cart.products.find(prod => prod.product.toString() === product)

            if (productExist) {
                productExist.quantity += quantity
            } else {
                cart.products.push({ product: product, quantity })
            }

            cart.markModified("products")
            await cart.save()
            return cart
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error)
            throw error
        }
    }
}

export default CartManager