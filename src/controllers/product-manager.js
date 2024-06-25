import { promises as fs } from "fs"

class ProductManager {
    constructor(path) {
        this.products = []
        this.path = path
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, "utf-8")
            const arrayProducts = JSON.parse(data)
            return arrayProducts
        } catch (error) {
            console.error("Error al leer los productos", error)
            return []
        }
    }

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            const arrayProducts = await this.loadProducts()

            /* if (!title, !description, !price, !img, !code, !stock, !category, !thumbnails) { */
            if (!title, !description, !price, !img, !code, !stock, !category) {
                console.log("Todos los campos son obligatorios para agregar el producto.")
                return
            }

            if (arrayProducts.some(item => item.code === code)) {
                console.log("El código del producto debe ser único")
            }

            const newProduct = {
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                /* status: true,
                thumbnails: thumbnails || [] */
            }

            if (arrayProducts.length > 0) {
                ProductManager.ultId = arrayProducts.reduce((maxId, product) => Math.max(maxId, product.id), 0)
            }

            newProduct.id = ++ProductManager.ultId
            arrayProducts.push(newProduct)

            await this.saveProduct(arrayProducts)
        } catch (error) {
            console.error("Error al leer el archivo", error)
            throw error
        }
    }

    async saveProduct(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2))
        } catch (error) {
            console.error("Error al guardar el producto", error)
        }
    }

    async getProducts() {
        const products = await this.loadProducts()
        return products
    }

    async getProductById(id) {
        try {
            const products = await this.loadProducts()
            const productToSearch = products.find(product => product.id === parseInt(id))

            if (!productToSearch) {
                console.log("El producto no ha sido encontrado")
            } else {
                return productToSearch
            }
        } catch (error) {
            console.error("Error al leer el archivo", error)
            throw error
        }
    }

    async updateProduct(id, updateProd) {
        try {
            const products = await this.loadProducts()
            const index = products.findIndex(product => product.id === parseInt(id))

            if (index !== -1) {
                products[index] = { ...products[index], ...updateProd }
                await this.saveProduct(products)
                console.log("El producto ha sido actualizado.")
                return products[index]
            } else {
                console.log("El producto no ha sido encontrado.")
            }
        } catch (error) {
            console.error("Error al actualizar el producto", error)
            throw error
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.loadProducts()
            const index = products.findIndex(product => product.id === parseInt(id))

            if (index !== -1) {
                products.splice(index, 1)
                await this.saveProduct(products)
                console.log("El producto ha sido eliminado")
            } else {
                console.log("El producto no ha sido encontrado")
            }
        } catch (error) {
            console.error("Error al eliminar el producto.", error)
            throw error
        }
    }
}

export default ProductManager