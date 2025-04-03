import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCpuwAn6zyArQpxGOzVldLtGca-Xro811g",
    authDomain: "proyecto-inventario-japp.firebaseapp.com",
    projectId: "proyecto-inventario-japp",
    storageBucket: "proyecto-inventario-japp.firebasestorage.app",
    messagingSenderId: "1068467625926",
    appId: "1:1068467625926:web:d6201e0c1989a8d71edcc7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const modal = document.getElementById("productModal");
const addProductBtn = document.querySelector(".add-product");
const closeModalBtn = document.querySelector(".close");
const saveProductBtn = document.getElementById("saveProduct");
const totalProductsElement = document.querySelector(".overall-inventory p");
const productTable = document.querySelector(".product-table table");

const updateTotalProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "productos"));
    totalProductsElement.textContent = `Total Products: ${querySnapshot.size}`;
};

const loadProducts = () => {
    onSnapshot(collection(db, "productos"), (snapshot) => {
        productTable.innerHTML = `
            <tr>
                <th>Products</th>
                <th>Buying Price</th>
                <th>Quantity</th>
                <th>Availability</th>
            </tr>
        `;

        snapshot.forEach((doc) => {
            const product = doc.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.quantity}</td>
                <td>${product.availability}</td>
            `;

            productTable.appendChild(row);
        });

        updateTotalProducts();
    });
};

addProductBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

saveProductBtn.addEventListener("click", async () => {
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productQuantity = document.getElementById("productQuantity").value;
    const productAvailability = document.getElementById("productAvailability").value;

    if (productName && productPrice && productQuantity) {
        try {
            await addDoc(collection(db, "productos"), {
                name: productName,
                price: Number(productPrice),
                quantity: Number(productQuantity),
                availability: productAvailability
            });

            alert("Producto agregado correctamente.");
            modal.style.display = "none"; // Cerrar el modal
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    } else {
        alert("Por favor, llena todos los campos.");
    }
});

loadProducts();
