const socket = io()

socket.on("products", (data) => {
    console.log("Conectado al servidor Socket.io")
    renderProducts(data)
})

const renderProducts = (data) => {
/*     console.log("Datos recibidos para renderizar", data)
 */    const productsList = document.getElementById("productsList")
    productsList.innerHTML = ""

    data.forEach((product) => {
        const card = document.createElement("div")
        card.classList.add("productCard")
        card.innerHTML = `
                            <h2>${product.title}</h2>
                            <p>${product.description}</p>
                            <p>Precio: ${product.price}</p>
                            <img src="${product.img}" alt="">
                            <p> Código: ${product.code}</p>
                            <p>Stock: ${product.stock}</p>
                            <p> Categoría: ${product.category}</p>
                            <button class="btnDelete"> Eliminar </button>
                        `
        productsList.appendChild(card)
        card.querySelector(".btnDelete").addEventListener("click", () => {
            deleteProduct(product.id)
        })
    });

}

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id)
}

document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault()
    addProduct()
})

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    }

    socket.emit("addProduct", product);
}


