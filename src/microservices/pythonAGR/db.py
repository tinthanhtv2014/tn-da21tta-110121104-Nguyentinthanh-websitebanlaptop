# db.py
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def get_mysql_conn(
    host, port, user, password, database
):
    return mysql.connector.connect(
        host=host,
        port=int(port or 3306),
        user=user,
        password=(password or ""),
        database=database,
        autocommit=True,
    )

def get_order_conn():
    return get_mysql_conn(
        os.getenv("ORDER_DB_HOST", "localhost"),
        os.getenv("ORDER_DB_PORT", "3306"),
        os.getenv("ORDER_DB_USER", "root"),
        os.getenv("ORDER_DB_PASSWORD", ""),
        os.getenv("ORDER_DB_NAME", "orderdatabase"),
    )

def get_product_conn():
    return get_mysql_conn(
        os.getenv("PRODUCT_DB_HOST", "localhost"),
        os.getenv("PRODUCT_DB_PORT", "3306"),
        os.getenv("PRODUCT_DB_USER", "root"),
        os.getenv("PRODUCT_DB_PASSWORD", ""),
        os.getenv("PRODUCT_DB_NAME", "productdatabase"),
    )
