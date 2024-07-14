import mongoose from "mongoose";

mongoose.connect("mongodb+srv://blupelusa:MongoCoder2020@cluster0.xc6zvs5.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexión exitosa"))
    .catch((error) => console.log("Error en la conexión", error))