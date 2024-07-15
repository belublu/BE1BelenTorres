const socket = io()

socket.on("products", (data) => {
    console.log("Conectado al servidor Socket.io")
    renderProducts(data)
})

const renderProducts = (data) => {

 const productsList = document.getElementById("productsList")
    productsList.innerHTML = ""

    data.forEach((product) => {
        const cardCol = document.createElement("div")
        cardCol.classList.add("col-4", "mb-4")
        const card = document.createElement("div")
        card.classList.add("card")
        card.innerHTML = `
                            <img src="${product.img}" class="card-img-top" alt="FotoProducto">
                            <div class="card-body">
                            <h5 class="card-title text-center">${product.title}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">Precio: $${product.price}</p>
                            <p class="card-text">Código: ${product.code}</p>
                            <p class="card-text">Stock: ${product.stock}</p>
                            <p class="card-text">Categoría: ${product.category}</p>
                            <button class="btnDelete btn btn-danger">Eliminar</button>
                        `
        cardCol.appendChild(card)
        productsList.appendChild(cardCol)
        card.querySelector(".btnDelete").addEventListener("click", () => {
            deleteProduct(product.id)
        })
    });

}

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id)
}

document.getElementById("productForm").addEventListener("submit", (e) => {
   
    addProduct()
})

const addProduct = () => {
    const titleProduct = document.getElementById("title").value.trim()
    const descriptionProduct = document.getElementById("description").value.trim()
    const priceProduct = document.getElementById("price").value.trim()
    const codeProduct = document.getElementById("code").value.trim()
    const stockProduct = document.getElementById("stock").value.trim()
    const categoryProduct = document.getElementById("category").value.trim()

    const product = {
        title: titleProduct,
        description: descriptionProduct,
        price: parseFloat(priceProduct),
        code: codeProduct,
        stock: parseInt(stockProduct),
        category: categoryProduct,
    }
    socket.emit("addProduct", product);
}


