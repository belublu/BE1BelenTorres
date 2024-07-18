import express from "express"
import { Router } from "express"
import ProductManager from "../dao/db/product-manager-db.js"
import CartManager from "../dao/db/cart-manager-db.js"

const router = express.Router()
const productManager = new ProductManager()
const cartManager = new CartManager()

/* router.get("/", async (req, res) => {
    const products = await productManager.getProducts()
    res.render("home", {products})
}) */



router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = "asc", query = "" } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
        };
        const queryObject = query ? { category: query } : {};
        const products = await productManager.getProducts(queryObject, options);

        

        res.render("products", {
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            prevLink: products.hasPrevPage ? `?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query || ''}` : null,
            nextLink: products.hasNextPage ? `?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query || ''}` : null
        });
    } catch (error) {
        console.error("Ha ocurrido un error al obtener los productos.", error);
        res.status(500).json({ error: "Error al obtener los productos", details: error.message });
    }
});

/* router.get("/", async (req, res) => {
    const { page = 1, limit = 10, sort = "asc", query } = req.query
    const products = await productManager.getProducts({
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort,
        query
    })
    console.log(products)
    try {
        const listProducts = await ProductManager.paginate({ page, limit, sort, query})

        let newArrayProducts = listProducts.docs.map(product => {
            const { _id, ...rest } = product.toObject()
            return rest
        })

        res.render("home", {
            products: newArrayProducts,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
        })
    } catch (error) {
        res.status(500).json({ error: "Error al cargar los productos", error })
    }
}) */

    router.get("/carts/:cid", async (req, res) => {
        const cartId = req.params.cid;
        console.log("Solicitando carrito con ID:", cartId); // Log para ver el ID del carrito
    
        try {
            const cart = await cartManager.getCartById(cartId);
            console.log("Carrito encontrado:", cart); // Log para ver el carrito encontrado
    
            if (!cart) {
                return res.status(404).json({ error: "El carrito solicitado no ha sido encontrado" });
            }

            if (cart.products.length === 0) {
                return res.render("carts", {message: "El carrito está vacío"})
            }
    
            const prodsCart = cart.products.map(item => ({
                product: item.product.toObject(),
                quantity: item.quantity
            }));
    
            console.log("Productos del carrito:", prodsCart); // Log para ver los productos del carrito
    
            res.render("carts", { products: prodsCart });
        } catch (error) {
            console.error("Error en el servidor:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    });

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.render("realtimeproducts", { products })
    } catch (error) {
        res.status(500).json({ error: "Error al cargar los productos", error })
    }
})


export default router

