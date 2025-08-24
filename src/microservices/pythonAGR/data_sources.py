# data_sources.py
import os
import json
import pandas as pd
from db import get_order_conn, get_product_conn
import warnings
warnings.filterwarnings("ignore")
def fetch_orders_list_products():
    """
    Lấy tất cả listProducts từ order DB.
    Mỗi listProducts là 1 JSON string của mảng object có field 'id'.
    Return: list[list[int]] (mỗi phần tử là danh sách product_id trong 1 đơn)
    """
    table = os.getenv("ORDER_TABLE", "order")
    col   = os.getenv("ORDER_LIST_PRODUCTS_COLUMN", "listProducts")

    sql = f"SELECT `{col}` FROM `{table}` WHERE `{col}` IS NOT NULL AND `{col}` != ''"

    conn = get_order_conn()
    cur = conn.cursor()
    cur.execute(sql)

    baskets = []
    for (json_str,) in cur.fetchall():
        try:
            arr = json.loads(json_str)
            # listProducts có dạng [{id: 1, ...}, ...]
            ids = []
            for item in arr:
                # an toàn: chấp nhận 'id' dạng int/str
                pid = item.get("id")
                if pid is not None:
                    try:
                        ids.append(int(pid))
                    except:
                        pass
            if ids:
                # unique trong 1 đơn để tránh đếm trùng
                baskets.append(sorted(list(set(ids))))
        except Exception:
            # bỏ qua record lỗi JSON
            pass

    cur.close()
    conn.close()
    return baskets

def fetch_wishlist_pairs():
    """
    Lấy co-occurrence từ wishlist: các sản phẩm xuất hiện chung trong wishlist 1 user.
    Trả về list[set(int)] — mỗi phần tử là 1 set các productId trong cùng 1 wishlist của user.
    """
    table = os.getenv("WISHLIST_TABLE", "wishlist")
    user_col = os.getenv("WISHLIST_USER_COLUMN", "userId")
    product_col = os.getenv("WISHLIST_PRODUCT_COLUMN", "productId")

    sql = f"""
        SELECT {user_col}, {product_col}
        FROM {table}
        WHERE {product_col} IS NOT NULL
    """
    conn = get_product_conn()
    df = pd.read_sql(sql, conn)
    conn.close()

    # nhóm theo userId => mỗi user có 1 set product
    groups = []
    if not df.empty:
        for _, g in df.groupby(user_col):
            pids = set()
            for pid in g[product_col].dropna().tolist():
                try:
                    pids.add(int(pid))
                except:
                    pass
            if len(pids) >= 2:
                groups.append(pids)
    return groups

def fetch_cart_pairs():
    """
    Lấy co-occurrence từ cart: các sản phẩm xuất hiện chung trong cart của 1 user.
    Return tương tự wishlist.
    """
    table = os.getenv("CART_TABLE", "cart")
    user_col = os.getenv("CART_USER_COLUMN", "userId")
    product_col = os.getenv("CART_PRODUCT_COLUMN", "productId")

    sql = f"""
        SELECT {user_col}, {product_col}
        FROM {table}
        WHERE {product_col} IS NOT NULL
    """
    conn = get_product_conn()
    df = pd.read_sql(sql, conn)
    conn.close()

    groups = []
    if not df.empty:
        for _, g in df.groupby(user_col):
            pids = set()
            for pid in g[product_col].dropna().tolist():
                try:
                    pids.add(int(pid))
                except:
                    pass
            if len(pids) >= 2:
                groups.append(pids)
    return groups

def fetch_product_details(product_ids):
    """
    Lấy thông tin sản phẩm để hiển thị.
    """
    if not product_ids:
        return []

    tbl = os.getenv("PRODUCTS_TABLE", "product")
    id_col = os.getenv("PRODUCTS_ID_COLUMN", "id")
    name_col = os.getenv("PRODUCTS_NAME_COLUMN", "name")
    price_col = os.getenv("PRODUCTS_PRICE_COLUMN", "price")
    img_col = os.getenv("PRODUCTS_IMAGE_COLUMN", "image")

    placeholders = ",".join(["%s"] * len(product_ids))
    sql = f"""
        SELECT *
        FROM {tbl}
        WHERE {id_col} IN ({placeholders})
    """

    conn = get_product_conn()
    cur = conn.cursor(dictionary=True)
    cur.execute(sql, tuple(product_ids))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # giữ thứ tự theo ranking input
    order_map = {pid: i for i, pid in enumerate(product_ids)}
    rows.sort(key=lambda r: order_map.get(r["id"], 10**9))
    return rows
