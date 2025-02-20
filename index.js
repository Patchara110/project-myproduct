document.addEventListener("DOMContentLoaded", function () {
    const productTableBody = document.getElementById("productTableBody");
    const productForm = document.getElementById("productForm");
    const productIdInput = document.getElementById("productId");
    const productNameInput = document.getElementById("productName");
    const productPriceInput = document.getElementById("productPrice");
    const productCostInput = document.getElementById("productCost");
    const productImageInput = document.getElementById("productImage");
    const modal = document.getElementById("editModal");
    const closeModal = document.getElementById("closeModal");

    // ฟังก์ชันในการดึงข้อมูลสินค้าจาก API
    function fetchProducts() {
        fetch("http://localhost:5000/product-bee")
            .then(response => response.json())
            .then(data => {
                productTableBody.innerHTML = "";
                data.forEach(product => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${product.id}</td>
                        <td>${product.product_name}</td>
                        <td>${product.product_price}</td>
                        <td>${product.product_cost}</td>
                        <td><img src="${product.product_image}" alt="${product.product_name}" width="50"></td>
                        <td>
                            <button onclick="editProduct(${product.id}, '${product.product_name}', ${product.product_price}, ${product.product_cost}, '${product.product_image}')">Edit</button>
                            <button onclick="deleteProduct(${product.id})">Delete</button>
                        </td>
                    `;
                    productTableBody.appendChild(row);
                });
            });
    }

    // ฟังก์ชันในการส่งข้อมูลการเพิ่มหรือแก้ไขสินค้า
    productForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const productId = productIdInput.value;
        const productName = productNameInput.value;
        const productPrice = productPriceInput.value;
        const productCost = productCostInput.value;
        const productImage = productImageInput.value;

        const url = productId ? `http://localhost:5000/product-bee/update/${productId}` : "http://localhost:5000/product-bee/create";
        const method = productId ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                product_name: productName,
                product_price: productPrice,
                product_cost: productCost,
                product_image: productImage
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            productForm.reset();
            fetchProducts();
            closeModal.click();  // ปิด modal หลังจากบันทึกข้อมูล
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });

    // ฟังก์ชันในการแก้ไขสินค้า (เปิด Modal)
    window.editProduct = function(id, name, price, cost, image) {
        // กรอกข้อมูลที่แก้ไขไปยัง input field
        productIdInput.value = id;
        productNameInput.value = name;
        productPriceInput.value = price;
        productCostInput.value = cost;
        productImageInput.value = image;

        modal.style.display = "block";  // แสดง Modal เมื่อคลิกแก้ไข
    };

    // ฟังก์ชันในการลบสินค้า พร้อมยืนยัน
    window.deleteProduct = function(id) {
        if (window.confirm("Are you sure you want to delete this product?")) {
            fetch(`http://localhost:5000/product-bee/${id}`, {
                method: "DELETE"
            }).then(() => fetchProducts());
        }
    };

    // ฟังก์ชันในการปิด Modal
    closeModal.addEventListener("click", function() {
        modal.style.display = "none"; // ปิด modal เมื่อคลิกปุ่ม Close
    });

    // ดึงข้อมูลสินค้าเมื่อโหลดหน้า
    fetchProducts();
});
