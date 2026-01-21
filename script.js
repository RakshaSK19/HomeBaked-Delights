let total = 0;
let count = 0;
let couponApplied = false;

const correctPassword = "raksha19"; // fixed password for demo

function login() {
    let password = document.getElementById("loginPassword").value;

    if (password === correctPassword) {
        // Hide login page
        document.getElementById("loginPage").style.display = "none";

        // Show navbar and logout link
        document.querySelector(".navbar").style.display = "flex";
        document.getElementById("logoutLink").style.display = "inline";

        // Clear error
        document.getElementById("loginError").innerText = "";
    } else {
        document.getElementById("loginError").innerText = "Incorrect password";
    }
}

function logout() {
    // Show login page
    document.getElementById("loginPage").style.display = "flex";

    // Hide navbar and logout link
    document.querySelector(".navbar").style.display = "none";
    document.getElementById("logoutLink").style.display = "none";
}

function changePrice(select, priceId) {
    document.getElementById(priceId).innerText = select.value;
}

function customCakeEnquiry() {
    let occasion = document.getElementById("cakeOccasion").value;
    alert("Thank you! We will contact you for a " + occasion + " cake.");
}

// Discounts on specific products (in percentage)
const DISCOUNTS = {
    "Donuts": 0,
    "Cookies": 0,
    "Muffins": 0
};

function addToCart(item, btn) {
    let card = btn.parentElement;
    let flavour = card.querySelector("select").selectedOptions[0].text;
    let unitPrice = parseInt(card.querySelector("span").innerText);

    // Get discount
    let discountPercent = DISCOUNTS[item] || 0;
    let discountedUnitPrice = Math.round(unitPrice - (unitPrice * discountPercent / 100));

    // Unique key for each flavour + item
    let key = flavour + " " + item;
    let cartItems = document.getElementById("cartItems");
    let existingItem = cartItems.querySelector(`[data-key="${key}"]`);

    if (existingItem) {
        // Increase quantity if already in cart
        let qtySpan = existingItem.querySelector(".qty");
        let qty = parseInt(qtySpan.innerText) + 1;
        qtySpan.innerText = qty;

        let priceSpan = existingItem.querySelector(".item-price");
        priceSpan.innerText = "₹" + (discountedUnitPrice * qty);

        total += discountedUnitPrice;
    } else {
        // Add new item to cart
        let li = document.createElement("li");
        li.setAttribute("data-key", key);
        li.setAttribute("data-unit-price", discountedUnitPrice);

        li.innerHTML = `
            <span class="cart-text">
                ${key} - 
                ${discountPercent > 0 ? `<s>₹${unitPrice}</s> ` : ``}
                <span class="item-price">₹${discountedUnitPrice}</span>
            </span>
            <div class="qty-controls">
                <button onclick="changeQty(this, -1)">−</button>
                <span class="qty">1</span>
                <button onclick="changeQty(this, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(this)">✖</button>
            </div>
        `;

        cartItems.appendChild(li);
        total += discountedUnitPrice;
        count++;
    }

    if (couponApplied) {
        total = Math.round(total - total * 0.10);
    }

    document.getElementById("totalPrice").innerText = total;
    document.getElementById("cartCount").innerText = count;

    showToast(key);
}

function changeQty(btn, change) {
    let li = btn.closest("li");
    let qtySpan = li.querySelector(".qty");
    let priceSpan = li.querySelector(".item-price");

    let unitPrice = parseInt(li.getAttribute("data-unit-price"));
    let qty = parseInt(qtySpan.innerText) + change;

    if (qty <= 0) {
        li.remove();
        total -= unitPrice;
        count--;
    } else {
        qtySpan.innerText = qty;
        priceSpan.innerText = "₹" + (unitPrice * qty);
        total += unitPrice * change;
    }

    if (couponApplied) {
        total = Math.round(total - total * 0.10);
    }

    document.getElementById("totalPrice").innerText = total;
    document.getElementById("cartCount").innerText = count;
}

function removeItem(button) {
    let li = button.closest("li");
    let unitPrice = parseInt(li.getAttribute("data-unit-price"));
    let qty = parseInt(li.querySelector(".qty").innerText);

    total -= unitPrice * qty;
    count--;

    if (couponApplied) {
        total = Math.round(total - total * 0.10);
    }

    li.remove();

    document.getElementById("totalPrice").innerText = total;
    document.getElementById("cartCount").innerText = count;
}

function showToast(itemName) {
    let toast = document.getElementById("toast");
    toast.innerText = "✔ " + itemName + " added to cart";
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 1500);
}

function toggleCart() {
    const cartBox = document.getElementById("cartBox");
    if (cartBox.style.display === "none" || cartBox.style.display === "") {
        cartBox.style.display = "block";
    } else {
        cartBox.style.display = "none";
    }
}

function clearCart() {
    document.getElementById("cartItems").innerHTML = "";
    total = 0;
    count = 0;
    couponApplied = false;

    document.getElementById("totalPrice").innerText = 0;
    document.getElementById("cartCount").innerText = 0;
    document.getElementById("couponInput").value = "";
}

document.addEventListener("click", function (event) {
    let cart = document.getElementById("cartBox");
    let cartIcon = document.querySelector(".cart-icon");

    if (
        cart.style.display === "block" &&
        !cart.contains(event.target) &&
        !cartIcon.contains(event.target)
    ) {
        cart.style.display = "none";
    }
});

function saveFeedback() {
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let email = document.getElementById("email").value.trim();
    let feedback = document.getElementById("feedbackText").value.trim();

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    let phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (feedback === "") {
        alert("Please write your feedback.");
        return;
    }

    let content =
        "HomeBaked Delights - Feedback\n\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Email: " + email + "\n\n" +
        "Feedback:\n" + feedback;

    let blob = new Blob([content], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "feedback.txt";
    link.click();

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("feedbackText").value = "";
}

/*function applyCoupon() {
    let code = document.getElementById("couponInput").value.trim().toUpperCase();

    if (code === "BAKE10" && !couponApplied) {
        let discount = total * 0.10;   // 10% of total
        total = total - discount;      // reduce total by 10%
        total = Math.round(total);

        document.getElementById("totalPrice").innerText = total;
        alert("BAKE10 applied! 10% discount given");

        couponApplied = true;
    }
    else if (couponApplied) {
        alert("Coupon already applied");
    }
    else {
        alert("Invalid coupon");
    }
}*/

/*function changePriceAndImage(select, priceId) {
    // change price
    document.getElementById(priceId).innerText = select.value;

    // change image
    let card = select.closest(".product-card");
    let img = card.querySelector("img");
    let selectedOption = select.selectedOptions[0];

    img.src = selectedOption.getAttribute("data-img");
}*/