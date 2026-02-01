"""
Migration: Create orders table
Version: 002
Description: Creates the orders table with order details
"""

import sqlite3
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import DATABASE_PATH


def upgrade():
    """Apply the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Check if this migration has already been applied
    cursor.execute("SELECT 1 FROM _migrations WHERE name = ?", ("002_create_orders_table",))
    if cursor.fetchone():
        print("Migration 002_create_orders_table already applied. Skipping.")
        conn.close()
        return
    
    # Create orders table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            order_date TEXT NOT NULL,
            status TEXT NOT NULL,
            total_amount REAL NOT NULL,
            payment_status TEXT NOT NULL
        )
    """)
    
    # Insert some sample data
    sample_orders = [
        ("#ORD1008", "Esther Kiehn", "17 Dec 2024", "Pending", 10.50, "Unpaid"),
        ("#ORD1007", "Denise Kuhn", "16 Dec 2024", "Pending", 100.50, "Unpaid"),
        ("#ORD1006", "Clint Hoppe", "16 Dec 2024", "Completed", 60.50, "Paid"),
        ("#ORD1005", "Darin Deckow", "16 Dec 2024", "Refunded", 640.50, "Paid"),
        ("#ORD1004", "Jacquelyn Robel", "15 Dec 2024", "Completed", 39.50, "Paid"),
    ]
    cursor.executemany("""
        INSERT INTO orders (order_number, customer_name, order_date, status, total_amount, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?)
    """, sample_orders)
    
    # Record this migration
    cursor.execute("INSERT INTO _migrations (name) VALUES (?)", ("002_create_orders_table",))
    
    conn.commit()
    conn.close()
    print("Migration 002_create_orders_table applied successfully.")


def downgrade():
    """Revert the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Drop orders table
    cursor.execute("DROP TABLE IF EXISTS orders")
    
    # Remove migration record
    cursor.execute("DELETE FROM _migrations WHERE name = ?", ("002_create_orders_table",))
    
    conn.commit()
    conn.close()
    print("Migration 002_create_orders_table reverted successfully.")
