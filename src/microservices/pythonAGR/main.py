# main.py
import argparse
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
app = FastAPI(title="Recommendation API")

# Cho phép tất cả origin (nếu chỉ test dev thì ok, production thì nên giới hạn domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc ["http://localhost:3000"] nếu chỉ muốn cho React local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Python API is running!"}

from data_sources import (
    fetch_orders_list_products,
    fetch_wishlist_pairs,
    fetch_cart_pairs,
    fetch_product_details,
)
from recommender import recommend_for_product
from utils import vnd



def get_recommendations(product_id: int, top_k: int = 8):
    order_baskets = fetch_orders_list_products()
    wishlist_groups = fetch_wishlist_pairs()
    cart_groups = fetch_cart_pairs()

    if not order_baskets and not wishlist_groups and not cart_groups:
        return []

    ranked = recommend_for_product(
        target_id=product_id,
        order_baskets=order_baskets,
        wishlist_groups=wishlist_groups,
        cart_groups=cart_groups,
        top_k=top_k
    )

    if not ranked:
        return []

    rec_ids = [pid for pid, _ in ranked]
    products = fetch_product_details(rec_ids)

    # ✅ Không map lại nữa, chỉ thêm score
    for p in products:
        pid = p["id"]
        score = next((s for (rid, s) in ranked if rid == pid), 0.0)
        p["score"] = round(score, 3)

    return products

@app.get("/recommend")
def recommend_api(product_id: int, top_k: int = 8):
    recs = get_recommendations(product_id, top_k)
    if not recs:
        return JSONResponse(
            status_code=404,
            content={"message": "Không tìm thấy gợi ý cho sản phẩm này"}
        )
    return {"recommendations": recs}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--product_id", type=int, required=True)
    parser.add_argument("--top_k", type=int, default=8)
    args = parser.parse_args()

    print("🔌 Đang tải dữ liệu từ DB...")
    recs = get_recommendations(args.product_id, args.top_k)

    if not recs:
        print("😶 Không tìm thấy sản phẩm liên quan.")
        return

    print(f"\n🔮 Gợi ý cho sản phẩm #{args.product_id}:")
    for p in recs:
        print(f"- [{p['id']}] {p['name']} | {p['price']} | score={p['score']} | {p['imageUrl']}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        # chạy CLI
        main()
    else:
        # chạy API
        uvicorn.run("main:app", host="0.0.0.0", port=5006, reload=True)
