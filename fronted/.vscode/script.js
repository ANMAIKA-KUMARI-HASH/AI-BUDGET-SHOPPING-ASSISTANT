/* =========================================
   BUDGETWISE AI
   Product Data
========================================= */

const products = [

    {
        id: 1,
        name: "SmartPhone Pro",
        category: "smartphone",
        price: 18999,
        rating: 4.5,
        icon: "📱",
        features: "50MP Camera, 5000mAh Battery"
    },

    {
        id: 2,
        name: "SmartPhone Lite",
        category: "smartphone",
        price: 14999,
        rating: 4.3,
        icon: "📱",
        features: "48MP Camera, 5000mAh Battery"
    },

    {
        id: 3,
        name: "SmartPhone Max",
        category: "smartphone",
        price: 22999,
        rating: 4.7,
        icon: "📱",
        features: "108MP Camera, 6000mAh Battery"
    },

    {
        id: 4,
        name: "Student Laptop",
        category: "laptop",
        price: 39999,
        rating: 4.4,
        icon: "💻",
        features: "8GB RAM, 512GB SSD"
    },

    {
        id: 5,
        name: "Power Laptop",
        category: "laptop",
        price: 49999,
        rating: 4.6,
        icon: "💻",
        features: "16GB RAM, 512GB SSD"
    },

    {
        id: 6,
        name: "Budget Headphones",
        category: "headphones",
        price: 1999,
        rating: 4.2,
        icon: "🎧",
        features: "Wireless, 30 Hours Battery"
    },

    {
        id: 7,
        name: "Premium Headphones",
        category: "headphones",
        price: 3999,
        rating: 4.6,
        icon: "🎧",
        features: "ANC, Wireless, 40 Hours Battery"
    },

    {
        id: 8,
        name: "Smart Watch Fit",
        category: "smartwatch",
        price: 2499,
        rating: 4.3,
        icon: "⌚",
        features: "Fitness Tracking, Heart Rate"
    },

    {
        id: 9,
        name: "Smart Watch Pro",
        category: "smartwatch",
        price: 4999,
        rating: 4.7,
        icon: "⌚",
        features: "GPS, Fitness Tracking"
    },

    {
        id: 10,
        name: "Study Tablet",
        category: "tablet",
        price: 12999,
        rating: 4.4,
        icon: "📲",
        features: "10 Inch Display, 128GB Storage"
    },

    {
        id: 11,
        name: "Premium Tablet",
        category: "tablet",
        price: 19999,
        rating: 4.6,
        icon: "📲",
        features: "11 Inch Display, 256GB Storage"
    },

    {
        id: 12,
        name: "Running Shoes",
        category: "shoes",
        price: 2499,
        rating: 4.3,
        icon: "👟",
        features: "Lightweight, Running"
    },

    {
        id: 13,
        name: "Sports Shoes Pro",
        category: "shoes",
        price: 3999,
        rating: 4.7,
        icon: "👟",
        features: "Cushioned, Sports"
    }

];


/* =========================================
   BACKEND CONFIG
========================================= */

// FastAPI backend must be running (uvicorn main:app --reload) before
// the chatbot below will get real replies.
const BACKEND_URL = "http://127.0.0.1:8000";


/* =========================================
   WISHLIST
========================================= */

let wishlist = [];

let compareProducts = [];


/* =========================================
   SHOW PRODUCTS
========================================= */

function displayProducts(list = products) {

    const productList =
        document.getElementById("productList");

    productList.innerHTML = "";

    list.forEach(product => {

        productList.innerHTML += `

            <div class="product-card">

                <div class="product-icon">
                    ${product.icon}
                </div>

                <h3>${product.name}</h3>

                <p>${product.features}</p>

                <div class="price">
                    ₹${product.price.toLocaleString("en-IN")}
                </div>

                <div class="rating">
                    ⭐ ${product.rating}
                </div>

                <button
                    onclick="addToWishlist(${product.id})">
                    ❤️ Wishlist
                </button>

                <button
                    onclick="addToCompare(${product.id})">
                    ⚖️ Compare
                </button>

            </div>

        `;
    });
}


/* =========================================
   RECOMMENDATION
========================================= */

function getRecommendation() {

    const budget =
        Number(document.getElementById("budget").value);

    const category =
        document.getElementById("category").value;

    const priority =
        document.getElementById("priority").value;

    const result =
        document.getElementById("recommendationResult");


    if (!budget || budget <= 0) {

        result.innerHTML = `
            <div class="recommend-card">
                <h3>⚠️ Please enter a valid budget.</h3>
            </div>
        `;

        return;
    }


    let available = products.filter(product => {

        const categoryMatch =
            category === "all" ||
            product.category === category;

        const budgetMatch =
            product.price <= budget;

        return categoryMatch && budgetMatch;

    });


    if (available.length === 0) {

        result.innerHTML = `
            <div class="recommend-card">

                <h3>❌ No product found.</h3>

                <p>
                    Try increasing your budget
                    or selecting another category.
                </p>

            </div>
        `;

        return;
    }


    /* Calculate AI-like score */

    available.forEach(product => {

        const ratingScore =
            product.rating / 5 * 100;

        const priceScore =
            (1 - product.price / budget) * 100;

        product.aiScore =
            Math.round(
                ratingScore * 0.6 +
                Math.max(priceScore, 0) * 0.4
            );

    });


    /* Sort according to priority */

    if (priority === "rating") {

        available.sort(
            (a, b) => b.rating - a.rating
        );

    }

    else if (priority === "price") {

        available.sort(
            (a, b) => a.price - b.price
        );

    }

    else {

        available.sort(
            (a, b) => b.aiScore - a.aiScore
        );

    }


    const best = available[0];


    result.innerHTML = `

        <div class="recommend-card">

            <div class="best-badge">
                🏆
            </div>

            <h2>
                Best Recommendation
            </h2>

            <h3>
                ${best.icon} ${best.name}
            </h3>

            <p>
                ${best.features}
            </p>

            <div class="price">
                ₹${best.price.toLocaleString("en-IN")}
            </div>

            <p>
                ⭐ Rating: ${best.rating}
            </p>

            <div class="ai-score">
                🤖 AI Score: ${best.aiScore}%
            </div>

            <p>
                💰 Remaining Budget:
                ₹${(budget - best.price)
                    .toLocaleString("en-IN")}
            </p>

            <p>
                <strong>
                    Why recommended?
                </strong>
            </p>

            <p>
                This product fits your budget
                and provides a good combination
                of price and rating.
            </p>

        </div>

    `;

}


/* =========================================
   WISHLIST
========================================= */

function addToWishlist(id) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;


    const alreadyAdded =
        wishlist.some(p => p.id === id);


    if (alreadyAdded) {

        alert("Product already in wishlist!");

        return;
    }


    wishlist.push(product);

    displayWishlist();

    alert("❤️ Added to wishlist!");

}


function removeFromWishlist(id) {

    wishlist =
        wishlist.filter(p => p.id !== id);

    displayWishlist();

}


function displayWishlist() {

    const list =
        document.getElementById("wishlistList");

    if (wishlist.length === 0) {

        list.innerHTML = `
            <p>
                Your wishlist is empty ❤️
            </p>
        `;

        return;
    }


    list.innerHTML = "";


    wishlist.forEach(product => {

        list.innerHTML += `

            <div class="wishlist-item">

                <div>

                    <strong>
                        ${product.icon}
                        ${product.name}
                    </strong>

                    <p>
                        ₹${product.price.toLocaleString("en-IN")}
                        | ⭐ ${product.rating}
                    </p>

                </div>

                <button
                    onclick="removeFromWishlist(${product.id})">
                    Remove
                </button>

            </div>

        `;

    });

}


/* =========================================
   COMPARE
========================================= */

function addToCompare(id) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;


    if (compareProducts.length >= 3) {

        alert("You can compare maximum 3 products.");

        return;
    }


    if (
        compareProducts.some(
            p => p.id === id
        )
    ) {

        alert("Product already selected.");

        return;
    }


    compareProducts.push(product);

    displayComparison();

}


function removeFromCompare(id) {

    compareProducts =
        compareProducts.filter(
            p => p.id !== id
        );

    displayComparison();

}


function displayComparison() {

    const container =
        document.getElementById("compareList");


    if (compareProducts.length === 0) {

        container.innerHTML = `
            <p>
                No products selected for comparison.
            </p>
        `;

        return;
    }


    let html = `

        <div class="compare-card">

            <table class="compare-table">

                <tr>
                    <th>Feature</th>
    `;


    compareProducts.forEach(product => {

        html += `
            <th>
                ${product.icon}
                ${product.name}
            </th>
        `;

    });


    html += `
                </tr>

                <tr>
                    <td>Price</td>
    `;


    compareProducts.forEach(product => {

        html += `
            <td>
                ₹${product.price.toLocaleString("en-IN")}
            </td>
        `;

    });


    html += `
                </tr>

                <tr>
                    <td>Rating</td>
    `;


    compareProducts.forEach(product => {

        html += `
            <td>
                ⭐ ${product.rating}
            </td>
        `;

    });


    html += `
                </tr>

                <tr>
                    <td>Features</td>
    `;


    compareProducts.forEach(product => {

        html += `
            <td>
                ${product.features}
            </td>
        `;

    });


    html += `
                </tr>

                <tr>
                    <td>Action</td>
    `;


    compareProducts.forEach(product => {

        html += `

            <td>

                <button
                    onclick="removeFromCompare(${product.id})">

                    Remove

                </button>

            </td>

        `;

    });


    html += `
                </tr>

            </table>

        </div>
    `;


    container.innerHTML = html;

}


/* =========================================
   BUDGET TRACKER
========================================= */

function calculateBudget() {

    const budget =
        Number(
            document.getElementById("monthlyBudget").value
        );

    const spent =
        Number(
            document.getElementById("spentAmount").value
        );

    const result =
        document.getElementById("budgetResult");


    if (
        budget <= 0 ||
        spent < 0
    ) {

        result.innerHTML = `
            <p>
                ⚠️ Please enter valid amounts.
            </p>
        `;

        return;
    }


    const remaining =
        budget - spent;


    if (remaining >= 0) {

        result.innerHTML = `

            <div class="budget-result">

                <h3>✅ Budget Status</h3>

                <p>
                    Monthly Budget:
                    ₹${budget.toLocaleString("en-IN")}
                </p>

                <p>
                    Spent:
                    ₹${spent.toLocaleString("en-IN")}
                </p>

                <p>
                    Remaining:
                    ₹${remaining.toLocaleString("en-IN")}
                </p>

            </div>

        `;

    }

    else {

        result.innerHTML = `

            <div class="budget-result">

                <h3>⚠️ Budget Exceeded</h3>

                <p>
                    You have exceeded your budget by
                    ₹${Math.abs(remaining)
                        .toLocaleString("en-IN")}
                </p>

            </div>

        `;

    }

}


/* =========================================
   AI CHATBOT - CONNECTED TO FASTAPI BACKEND
========================================= */

async function sendMessage() {

    const input =
        document.getElementById("chatInput");

    const messages =
        document.getElementById("chatMessages");


    const question =
        input.value.trim();


    if (!question) return;


    messages.innerHTML += `

        <div class="user-message">
            ${question}
        </div>

    `;

    input.value = "";

    // Show a temporary "typing" message while we wait for the backend
    messages.innerHTML += `
        <div class="bot-message" id="typingIndicator">
            🤖 Typing...
        </div>
    `;

    messages.scrollTop = messages.scrollHeight;


    let answer;

    try {

        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: question })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        // Backend reply may contain \n for line breaks - convert to <br>
        answer = data.reply.replace(/\n/g, "<br>");

    } catch (error) {

        console.error("Backend not reachable:", error);

        // Fallback to local canned responses if the backend is not running
        answer = getAIResponse(question) +
            "<br><br>⚠️ (Backend se connect nahi ho paya, ye ek default reply hai. " +
            "Check karein ki 'uvicorn main:app --reload' chal raha hai.)";
    }


    document.getElementById("typingIndicator").remove();

    messages.innerHTML += `

        <div class="bot-message">
            ${answer}
        </div>

    `;

    messages.scrollTop =
        messages.scrollHeight;

}


function getAIResponse(question) {

    const text =
        question.toLowerCase();


    if (
        text.includes("budget") ||
        text.includes("paise")
    ) {

        return `
            💰 Enter your budget in the
            recommendation section and I will
            help you find suitable products.
        `;

    }


    if (
        text.includes("phone") ||
        text.includes("mobile") ||
        text.includes("smartphone")
    ) {

        return `
            📱 For smartphones, enter your budget
            and select Smartphone. The system will
            find suitable products and calculate
            a recommendation score.
        `;

    }


    if (
        text.includes("laptop")
    ) {

        return `
            💻 For laptops, select Laptop and enter
            your maximum budget. You can compare
            the available options.
        `;

    }


    if (
        text.includes("compare")
    ) {

        return `
            ⚖️ Click the Compare button on products.
            You can compare up to 3 products.
        `;

    }


    if (
        text.includes("wishlist")
    ) {

        return `
            ❤️ Click Wishlist on any product to
            save it for later.
        `;

    }


    return `
        🤖 I can help you with budget,
        smartphones, laptops, comparison,
        wishlist and shopping recommendations.
    `;

}


/* =========================================
   INITIAL LOAD
========================================= */

displayProducts();

displayWishlist();

displayComparison();