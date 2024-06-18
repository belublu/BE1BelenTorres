import { promises as fs } from "fs"

class CartManager {
    constructor(path) {
        this.carts = []
        this.path = path
        this.ultId = 0
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8")
            this.carts = JSON.parse(data)
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id))
            }
            return this.carts
        } catch (error) {
            console.error("Error al cargar el carrito", error)
            return []
        }
    }

    async saveCart() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        } catch (error) {
            console.error("Error al escribir el carrito", error)
        }
    }

    async getCarts() {
        try {
            return await this.loadCarts()
        } catch (error) {
            console.error("Error al obtener los carritos:", error);
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.loadCarts()
            const cart = carts.find(cart => cart.id === id)
            if (!carts) {
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
            await this.loadCarts()
            const newCart = {
                id: ++this.ultId,
                products: []
            }
            this.carts.push(newCart)
            await this.saveCart()
            return newCart
        } catch (error) {
            console.error("No se ha podido crear el carrito.", error)
        }
    }

    async addProductToCart(id, product, quantity = 1) {
        try {
            await this.loadCarts()
            const cart = this.carts.find(cart => cart.id === parseInt(id))
            if (!cart) {
                throw new Error(`No existe un carrito con el id ${id}`)
            }
            const productExist = cart.products.find(p => p.product === product)
            if (productExist) {
                productExist.quantity += quantity
            } else {
                cart.products.push({ product, quantity })
            }

            await this.saveCart()
            return cart
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error)
            throw error
        }
    }
}

export default CartManager