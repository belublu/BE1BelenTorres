import ProductModel from "../models/product.model.js"

class ProductManager {

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title, !description, !price, !img, !code, !stock, !category) {
                console.log("Todos los campos son obligatorios para agregar el producto.")
                return
            }

            const existProduct = await ProductModel.findOne({ code: code })
            if (existProduct) {
                console.log("El código del producto debe ser único.")
                return
            }

            const newProduct = new ProductModel(
                {
                    title,
                    description,
                    price,
                    img,
                    code,
                    stock,
                    category,
                    status: true,
                    thumbnail: []
                })

            await newProduct.save()
        } catch (error) {
            console.error("Error al leer el archivo", error)
            throw error
        }
    }

    async getProducts(query = {}, options = {}) {
        try {
            const arrayProducts = await ProductModel.paginate(query, { ...options, lean: true })
            return arrayProducts
        } catch (error) {
            console.log("Error al obtener los productos", error)
            throw error
        }
    }

    async getProductById(id) {
        try {
            const productToSearch = await ProductModel.findById(id)

            if (!productToSearch) {
                console.log("El producto no ha sido encontrado")
                return null
            } else {
                return productToSearch
            }
        } catch (error) {
            console.error("El producto referido a ese id no ha sido encontrado.", error)
            throw error
        }
    }

    async updateProduct(id, updateProd) {
        try {
            const update = await ProductModel.findByIdAndUpdate(id, updateProd)
            if (!update) {
                console.log("El producto a actualizar no ha sido encontrado.")
                return null
            } else {
                console.log("El producto ha sido actualizado correctamente.")
                return update
            }
        } catch (error) {
            console.error("Error al actualizar el producto", error)
            throw error
        }
    }

    async deleteProduct(id) {
        try {
            const deleteProd = await ProductModel.findByIdAndDelete(id)
            if (!deleteProd) {
                console.log("El producto no ha sido encontrado.")
                return null
            } else {
                console.log("El producto ha sido eliminado exitosamente.")
                return deleteProd
            }
        } catch (error) {
            console.error("Error al eliminar el producto.", error)
            throw error
        }
    }
}

export default ProductManager