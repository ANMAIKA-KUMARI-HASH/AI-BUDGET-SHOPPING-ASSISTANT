/* =========================================
   BUDGETWISE AI
   Product Data
========================================= */


const products = [

    {
        id: 1,
        name: "Samsung Galaxy A16 5G",
        category: "smartphone",
        price: 16499,
        rating: 4.3,
        reviews: 20000,
        icon: "📱",
        features: "50MP Camera, 5000mAh Battery, 90Hz Super AMOLED"
    },

    {
        id: 2,
        name: "Redmi Note 14 5G",
        category: "smartphone",
        price: 16499,
        rating: 4.7,
        reviews: 432,
        icon: "📱",
        features: "5G, AMOLED Display, High-resolution Camera"
    },

    {
        id: 3,
        name: "OnePlus Nord CE4 Lite 5G",
        category: "smartphone",
        price: 17809,
        rating: 4.5,
        reviews: 6,
        icon: "📱",
        features: "5G, AMOLED Display, Fast Charging"
    },

    {
        id: 4,
        name: "HP 15-fd0682TU",
        category: "laptop",
        price: 72900,
        rating: 3.7,
        reviews: 32,
        icon: "💻",
        features: "15.6-inch Display, Intel Processor, Windows"
    },

    {
        id: 5,
        name: "Lenovo IdeaPad Slim 3",
        category: "laptop",
        price: 55991,
        rating: 4.0,
        reviews: 8,
        icon: "💻",
        features: "Intel Core i5, 16GB RAM, 512GB SSD"
    },

    {
        id: 6,
        name: "boAt Rockerz 450",
        category: "headphones",
        price: 1499,
        rating: 4.4,
        reviews: 608,
        icon: "🎧",
        features: "Wireless, On-Ear, Microphone"
    },

    {
        id: 7,
        name: "Sony WH-CH520",
        category: "headphones",
        price: 4176,
        rating: 4.7,
        reviews: 4000,
        icon: "🎧",
        features: "Wireless, Microphone, Up to 50 Hours Battery"
    },

    {
        id: 8,
        name: "Noise ColorFit Pulse 4 Pro",
        category: "smartwatch",
        price: 7999,
        rating: 4.8,
        reviews: 12,
        icon: "⌚",
        features: "Fitness Tracking, Heart Rate, Smart Notifications"
    },

    {
        id: 9,
        name: "Amazfit Active 2",
        category: "smartwatch",
        price: 12999,
        rating: 4.9,
        reviews: 609,
        icon: "⌚",
        features: "AMOLED Display, GPS, Fitness Tracking"
    },

    {
        id: 10,
        name: "Samsung Galaxy Tab A9+",
        category: "tablet",
        price: 17499,
        rating: 4.6,
        reviews: 7800,
        icon: "📲",
        features: "11-inch Display, 90Hz, 128GB Storage"
    },

    {
        id: 11,
        name: "OnePlus Pad Go",
        category: "tablet",
        price: 17659,
        rating: 4.3,
        reviews: 18,
        icon: "📲",
        features: "11.35-inch Display, 2.4K Resolution, 8GB RAM"
    },

    {
        id: 12,
        name: "ASICS JOLT 5",
        category: "shoes",
        price: 2999,
        rating: 4.6,
        reviews: 1000,
        icon: "👟",
        features: "Running Shoes, Lightweight, Cushioned"
    },

    {
        id: 13,
        name: "Nike Revolution 7",
        category: "shoes",
        price: 3695,
        rating: 4.6,
        reviews: 3900,
        icon: "👟",
        features: "Running Shoes, Cushioned, Lightweight"
    },

    {
        id: 14,
        name: "Universal SIM Ejector Tool & Pin",
        category: "smartphone",
        price: 49,
        rating: 4.8,
        reviews: 14200,
        icon: "📱",
        features: "Stainless Steel, Keychain Loop, All Phones"
    },

    {
        id: 15,
        name: "Apple MacBook Air M1",
        category: "laptop",
        price: 67990,
        rating: 4.8,
        reviews: 24850,
        icon: "💻",
        features: "Apple M1 Chip, 8GB RAM, 256GB SSD, Retina Display"
    },

    {
        id: 16,
        name: "Silicone Earbuds Replacement Tips",
        category: "headphones",
        price: 99,
        rating: 4.5,
        reviews: 5400,
        icon: "🎧",
        features: "Soft Silicone, Noise Isolation, Universal Fit"
    },

    {
        id: 17,
        name: "Smartwatch Screen Protector Film",
        category: "smartwatch",
        price: 149,
        rating: 4.4,
        reviews: 4300,
        icon: "⌚",
        features: "HD Clear, Anti-Scratch, Curved TPU"
    },

    {
        id: 18,
        name: "Shoe Care Cleaning Sponge Pad",
        category: "shoes",
        price: 99,
        rating: 4.5,
        reviews: 6700,
        icon: "👟",
        features: "Instant Polish, Dust Repellent, Portable"
    },

    {
        id: 19,
        name: "Universal Capacitive Stylus Touch Pen",
        category: "tablet",
        price: 149,
        rating: 4.6,
        reviews: 8200,
        icon: "📲",
        features: "Dual Tip, Precision Touch, No Battery Required"
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

    if (!category || category === "") {

        result.innerHTML = `
            <div class="recommend-card">
                <h3>⚠️ Please select a product category first (e.g. Smartphone, Laptop, Headphones).</h3>
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
        (product.rating / 5) * 100;

    const priceScore =
        (1 - product.price / budget) * 100;

    const reviewScore =
        Math.min(product.reviews / 1000, 1) * 100;

    product.aiScore =
        Math.round(
            ratingScore * 0.4 +
            Math.max(priceScore, 0) * 0.3 +
            reviewScore * 0.3
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
            

            <p>
            👥 Reviews: ${best.reviews}
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
   INITIAL LOAD & LIVE API SYNC
========================================= */

displayProducts();
displayWishlist();
displayComparison();

// Asynchronously load all 240+ products from live Backend API if active
async function loadProductsFromBackendAPI() {
    try {
        const res = await fetch("http://localhost:5000/api/products");
        if (res.ok) {
            const data = await res.json();
            if (data && data.data && data.data.length > 0) {
                const apiItems = data.data.map((item, idx) => ({
                    id: item.id || idx + 1,
                    name: item.name,
                    category: item.category,
                    price: item.price,
                    rating: item.rating,
                    reviews: item.reviews || 1000,
                    icon: item.category === 'smartphone' ? '📱' : item.category === 'laptop' ? '💻' : item.category === 'headphones' ? '🎧' : item.category === 'smartwatch' ? '⌚' : item.category === 'tablet' ? '📲' : item.category === 'shoes' ? '👟' : '🛍️',
                    features: Array.isArray(item.specs) ? item.specs.slice(0, 2).join(', ') : (item.description ? item.description.slice(0, 60) : 'Verified specs')
                }));
                products.length = 0;
                products.push(...apiItems);
                displayProducts();
                console.log(`🌐 Loaded ${products.length} products dynamically from API!`);
            }
        }
    } catch (err) {
        // Fallback to built-in product items
    }
}
loadProductsFromBackendAPI();