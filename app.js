// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCpuwAn6zyArQpxGOzVldLtGca-Xro811g",
  authDomain: "proyecto-inventario-japp.firebaseapp.com",
  projectId: "proyecto-inventario-japp",
  storageBucket: "proyecto-inventario-japp.firebasestorage.app",
  messagingSenderId: "1068467625926",
  appId: "1:1068467625926:web:d6201e0c1989a8d71edcc7",
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para agregar un producto a Firestore
async function addProduct(name, price, quantity, availability) {
  try {
    await addDoc(collection(db, "productos"), {
      name: name,
      price: price,
      quantity: quantity,
      availability: availability,
    });
    console.log("Producto agregado con éxito");
    loadProducts(); // Recargar los productos después de agregar uno nuevo
  } catch (e) {
    console.error("Error al agregar producto: ", e);
  }
}

// Función para cargar los productos desde Firestore
async function loadProducts() {
  const table = document.querySelector(".product-table table");
  table.innerHTML = `
            <tr>
                <th>Products</th>
                <th>Buying Price</th>
                <th>Quantity</th>
                <th>Availability</th>
            </tr>
        `;

  const querySnapshot = await getDocs(collection(db, "productos"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const row = `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.price}</td>
                    <td>${data.quantity}</td>
                    <td>${data.availability}</td>
                </tr>
            `;
    table.innerHTML += row;
  });
}

document.getElementById("saveProduct").addEventListener("click", () => {
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const quantity = document.getElementById("productQuantity").value;
    const availability = document.getElementById("productAvailability").value;

    if (name && price && quantity) {
        addProduct(name, parseFloat(price), parseInt(quantity), availability);
    } else {
        alert("Por favor, llena todos los campos.");
    }
});

// Cargar los productos al cargar la página
document.addEventListener("DOMContentLoaded", loadProducts);
