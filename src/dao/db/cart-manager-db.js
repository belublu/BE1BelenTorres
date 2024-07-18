import CartModel from "../models/cart.model.js"

class CartManager {
    async getCarts() {
        try {
            const carts = await CartModel.find().populate("products.product")
            return carts
        } catch (error) {
            console.log("Error al obtener los carritos", error);
            throw error;
        }
    }

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

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return false;
            }

            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
            if (productIndex === -1) {
                return false;
            }

            cart.products.splice(productIndex, 1);
            await cart.save();
            return true;
        } catch (error) {
            throw new Error('Error al eliminar el producto del carrito');
        }
    }

    async updateCart(cartId, products){
        try {
            const cart = await CartModel.findById(cartId)
            if(!cart){
                return false
            }

            cart.products = products
            await cart.save()
            return true
        } catch (error) {
            console.log(error)
            throw new Error("Error al actualizar el carrito.")
        }
    }

    async updateProdQuantity(cartId, productId, quantity){
        try {
            const cart = await CartModel.findById(cartId)
            if(!cart){
                return false
            }

            // Acá busco el producto en el carrito usando el id correcto
            const product = cart.products.find(p => p.product._id.toString() === productId)
            if(!product){
                return false
            }

            // Acá actualizo la cantidad solicitada
            product.quantity = quantity
            await cart.save()
            return true
        } catch (error) {
            console.log(error)
            throw new Error("Error al actualizar la cantidad del producto.")
        }
    }

}





export default CartManager