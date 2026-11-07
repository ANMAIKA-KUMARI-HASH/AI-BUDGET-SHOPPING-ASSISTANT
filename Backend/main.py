import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    message: str


# ---------------- Product data ----------------


PRODUCTS = [
    {
        "id": 1,
        "name": "Samsung Galaxy A16 5G",
        "category": "smartphone",
        "price": 16499,
        "rating": 4.3,
        "reviews": 20000
    },
    {
        "id": 2,
        "name": "Redmi Note 14 5G",
        "category": "smartphone",
        "price": 16499,
        "rating": 4.7,
        "reviews": 432
    },
    {
        "id": 3,
        "name": "OnePlus Nord CE4 Lite 5G",
        "category": "smartphone",
        "price": 17809,
        "rating": 4.5,
        "reviews": 6
    },
    {
        "id": 4,
        "name": "HP 15-fd0682TU",
        "category": "laptop",
        "price": 72900,
        "rating": 3.7,
        "reviews": 32
    },
    {
        "id": 5,
        "name": "Lenovo IdeaPad Slim 3",
        "category": "laptop",
        "price": 55991,
        "rating": 4.0,
        "reviews": 8
    },
    {
        "id": 6,
        "name": "boAt Rockerz 450",
        "category": "headphones",
        "price": 1499,
        "rating": 4.4,
        "reviews": 608
    },
    {
        "id": 7,
        "name": "Sony WH-CH520",
        "category": "headphones",
        "price": 4176,
        "rating": 4.7,
        "reviews": 4000
    },
    {
        "id": 8,
        "name": "Noise ColorFit Pulse 4 Pro",
        "category": "smartwatch",
        "price": 7999,
        "rating": 4.8,
        "reviews": 12
    },
    {
        "id": 9,
        "name": "Amazfit Active 2",
        "category": "smartwatch",
        "price": 12999,
        "rating": 4.9,
        "reviews": 609
    },
    {
        "id": 10,
        "name": "Samsung Galaxy Tab A9+",
        "category": "tablet",
        "price": 17499,
        "rating": 4.6,
        "reviews": 7800
    },
    {
        "id": 11,
        "name": "OnePlus Pad Go",
        "category": "tablet",
        "price": 17659,
        "rating": 4.3,
        "reviews": 18
    },
    {
        "id": 12,
        "name": "ASICS JOLT 5",
        "category": "shoes",
        "price": 2999,
        "rating": 4.6,
        "reviews": 1000
    },
    {
        "id": 13,
        "name": "Nike Revolution 7",
        "category": "shoes",
        "price": 3695,
        "rating": 4.6,
        "reviews": 3900
    }
]


# ---------------- Category keywords ----------------

CATEGORY_KEYWORDS = {
    "smartphone": [
        "phone",
        "mobile",
        "smartphone"
    ],

    "laptop": [
        "laptop",
        "computer"
    ],

    "headphones": [
        "headphone",
        "headphones"
    ],

    "smartwatch": [
        "watch",
        "smartwatch"
    ],

    "tablet": [
        "tablet",
        "ipad"
    ],

    "shoes": [
        "shoe",
        "shoes",
        "sneaker",
        "sneakers"
    ]
}


# ---------------- Helper functions ----------------
def detect_category(message: str):
    message = message.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in message:
                return category
    return None


def detect_budget(message: str):
    numbers = re.findall(r"\d+", message.replace(",", ""))
    if numbers:
        return float(numbers[0])
    return None


def score_product(product, budget):
    price = product["price"]
    rating = product["rating"]
    reviews = product["reviews"]

    if price > budget:
        return -1

    affordability_score = (1 - (price / budget)) * 100
    rating_score = (rating / 5) * 100
    review_score = min(reviews / 1000, 1) * 100

    final_score = (
        rating_score * 0.4 +
        affordability_score * 0.3 +
        review_score * 0.3
    )

    return round(final_score, 2)


def get_recommendations(budget, category=None, top_n=3):
    scored = []
    for p in PRODUCTS:
        if category and p["category"] != category:
            continue
        score = score_product(p, budget)
        if score >= 0:
            item = dict(p)
            item["score"] = score
            scored.append(item)
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_n]


# ---------------- Routes ----------------
@app.get("/")
def home():
    return {"status": "Backend chal raha hai!"}


@app.post("/chat")
def chat(data: ChatMessage):
    user_msg = data.message

    budget = detect_budget(user_msg)
    category = detect_category(user_msg)

    if budget is None:
        return {
            "reply": "Aapka monthly budget kitna hai? (e.g. 'mera budget 2000 hai, shirt chahiye')",
            "recommendations": [],
        }

    results = get_recommendations(budget=budget, category=category)

    if not results:
        reply = f"Sorry, {int(budget)} budget mein koi product nahi mila."
        if category:
            reply += f" ({category} category mein)"
    else:
        product_lines = [f"- {p['name']} (₹{p['price']}, rating {p['rating']})" for p in results]
        reply = "Yeh products aapke budget mein sabse suitable hain:\n" + "\n".join(product_lines)

    return {"reply": reply, "recommendations": results}


@app.get("/products")
def list_products():
    return {"products": PRODUCTS}