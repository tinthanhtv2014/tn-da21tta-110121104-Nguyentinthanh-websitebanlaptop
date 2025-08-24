# recommender.py
from collections import defaultdict
from itertools import combinations

def build_cooccurrence(baskets):
    """
    baskets: list[list[int]] (mỗi list là các product trong 1 đơn)
    return:
      - pair_count[(i,j)] = số lần i và j cùng xuất hiện
      - item_count[i] = số lần i xuất hiện
    """
    pair_count = defaultdict(int)
    item_count = defaultdict(int)

    for basket in baskets:
        # đếm số lần item xuất hiện
        for i in basket:
            item_count[i] += 1
        # đếm cặp
        for i, j in combinations(sorted(set(basket)), 2):
            pair_count[(i, j)] += 1
            pair_count[(j, i)] += 1  # make it symmetric

    return pair_count, item_count

def score_similar_items(target_id, pair_count, item_count, alpha=0.6):
    """
    Tính điểm similarity cho các item khác so với target_id.
    alpha ~ hệ số smoothing (PMI-lite).
    score(i -> j) ~ cooc(i,j) / (count(i)^alpha * count(j)^(1-alpha))
    Ở đây khi recommend cho target=t, ta xét score(t -> k) = cooc(t,k) / (count(t)^alpha * count(k)^(1-alpha))
    """
    scores = defaultdict(float)
    t_count = item_count.get(target_id, 0)
    if t_count == 0:
        return {}

    for (i, j), c in pair_count.items():
        if i == target_id and i != j:
            denom = (t_count ** alpha) * (item_count.get(j, 1) ** (1 - alpha))
            if denom > 0:
                scores[j] = c / denom

    return scores

def merge_signals(base_scores, groups, target_id, weight=0.5):
    """
    Kết hợp thêm tín hiệu từ wishlist/cart.
    groups: list[set(int)] — mỗi set là các sản phẩm cùng wishlist/cart 1 user.
    Khi target_id xuất hiện trong 1 set, cộng điểm 'weight' cho các item còn lại trong set.
    """
    for s in groups:
        if target_id in s:
            for pid in s:
                if pid != target_id:
                    base_scores[pid] = base_scores.get(pid, 0.0) + weight
    return base_scores

def recommend_for_product(
    target_id: int,
    order_baskets,
    wishlist_groups=None,
    cart_groups=None,
    top_k=10,
    alpha=0.6,
    wishlist_weight=0.5,
    cart_weight=0.4,
    exclude_ids=None
):
    """
    Trả về list[(product_id, score)]
    """
    wishlist_groups = wishlist_groups or []
    cart_groups = cart_groups or []
    exclude_ids = set(exclude_ids or [])

    pair_count, item_count = build_cooccurrence(order_baskets)
    scores = score_similar_items(target_id, pair_count, item_count, alpha=alpha)

    # trộn thêm tín hiệu wishlist & cart
    scores = merge_signals(scores, wishlist_groups, target_id, weight=wishlist_weight)
    scores = merge_signals(scores, cart_groups, target_id, weight=cart_weight)

    # loại target & exclude
    if target_id in scores:
        scores.pop(target_id, None)
    for ex in exclude_ids:
        scores.pop(ex, None)

    # sort theo điểm
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return ranked[:top_k]
