"""
Migration: Add more order seed data
Version: 003
Description: Adds additional sample orders for testing pagination and filters
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
    cursor.execute("SELECT 1 FROM _migrations WHERE name = ?", ("003_add_more_seed_data",))
    if cursor.fetchone():
        print("Migration 003_add_more_seed_data already applied. Skipping.")
        conn.close()
        return
    
    # Insert additional sample orders (50 more orders for pagination testing)
    sample_orders = [
        # Pending Orders
        ("#ORD1009", "Alice Johnson", "18 Dec 2024", "Pending", 125.00, "Unpaid"),
        ("#ORD1010", "Bob Smith", "18 Dec 2024", "Pending", 89.99, "Unpaid"),
        ("#ORD1011", "Carol Williams", "19 Dec 2024", "Pending", 234.50, "Unpaid"),
        ("#ORD1012", "David Brown", "19 Dec 2024", "Pending", 45.75, "Unpaid"),
        ("#ORD1013", "Emma Davis", "20 Dec 2024", "Pending", 178.20, "Unpaid"),
        ("#ORD1014", "Frank Miller", "20 Dec 2024", "Pending", 99.99, "Unpaid"),
        ("#ORD1015", "Grace Wilson", "21 Dec 2024", "Pending", 312.40, "Unpaid"),
        ("#ORD1016", "Henry Moore", "21 Dec 2024", "Pending", 67.80, "Unpaid"),
        ("#ORD1017", "Ivy Taylor", "22 Dec 2024", "Pending", 156.30, "Unpaid"),
        ("#ORD1018", "Jack Anderson", "22 Dec 2024", "Pending", 203.15, "Unpaid"),
        
        # Completed Orders
        ("#ORD1019", "Kate Thomas", "15 Dec 2024", "Completed", 445.00, "Paid"),
        ("#ORD1020", "Liam Jackson", "15 Dec 2024", "Completed", 78.50, "Paid"),
        ("#ORD1021", "Mia White", "16 Dec 2024", "Completed", 189.99, "Paid"),
        ("#ORD1022", "Noah Harris", "16 Dec 2024", "Completed", 523.75, "Paid"),
        ("#ORD1023", "Olivia Martin", "17 Dec 2024", "Completed", 91.20, "Paid"),
        ("#ORD1024", "Peter Thompson", "17 Dec 2024", "Completed", 267.40, "Paid"),
        ("#ORD1025", "Quinn Garcia", "18 Dec 2024", "Completed", 134.60, "Paid"),
        ("#ORD1026", "Rachel Martinez", "18 Dec 2024", "Completed", 398.80, "Paid"),
        ("#ORD1027", "Sam Robinson", "19 Dec 2024", "Completed", 56.90, "Paid"),
        ("#ORD1028", "Tina Clark", "19 Dec 2024", "Completed", 712.30, "Paid"),
        ("#ORD1029", "Uma Rodriguez", "20 Dec 2024", "Completed", 145.50, "Paid"),
        ("#ORD1030", "Victor Lewis", "20 Dec 2024", "Completed", 289.00, "Paid"),
        ("#ORD1031", "Wendy Lee", "21 Dec 2024", "Completed", 423.75, "Paid"),
        ("#ORD1032", "Xavier Walker", "21 Dec 2024", "Completed", 98.40, "Paid"),
        ("#ORD1033", "Yara Hall", "22 Dec 2024", "Completed", 567.20, "Paid"),
        
        # Refunded Orders
        ("#ORD1034", "Zoe Allen", "14 Dec 2024", "Refunded", 234.00, "Paid"),
        ("#ORD1035", "Aaron Young", "14 Dec 2024", "Refunded", 156.50, "Paid"),
        ("#ORD1036", "Bella King", "15 Dec 2024", "Refunded", 89.99, "Paid"),
        ("#ORD1037", "Chris Wright", "15 Dec 2024", "Refunded", 345.60, "Paid"),
        ("#ORD1038", "Diana Lopez", "16 Dec 2024", "Refunded", 123.45, "Paid"),
        
        # More Pending
        ("#ORD1039", "Ethan Hill", "23 Dec 2024", "Pending", 278.90, "Unpaid"),
        ("#ORD1040", "Fiona Scott", "23 Dec 2024", "Pending", 167.30, "Unpaid"),
        ("#ORD1041", "George Green", "24 Dec 2024", "Pending", 445.80, "Unpaid"),
        ("#ORD1042", "Hannah Adams", "24 Dec 2024", "Pending", 92.15, "Unpaid"),
        ("#ORD1043", "Ian Baker", "25 Dec 2024", "Pending", 356.70, "Unpaid"),
        
        # More Completed
        ("#ORD1044", "Julia Nelson", "13 Dec 2024", "Completed", 678.40, "Paid"),
        ("#ORD1045", "Kevin Carter", "13 Dec 2024", "Completed", 234.90, "Paid"),
        ("#ORD1046", "Laura Mitchell", "14 Dec 2024", "Completed", 145.20, "Paid"),
        ("#ORD1047", "Mike Perez", "14 Dec 2024", "Completed", 523.60, "Paid"),
        ("#ORD1048", "Nina Roberts", "15 Dec 2024", "Completed", 89.75, "Paid"),
        ("#ORD1049", "Oscar Turner", "15 Dec 2024", "Completed", 412.30, "Paid"),
        ("#ORD1050", "Paula Phillips", "16 Dec 2024", "Completed", 198.50, "Paid"),
        ("#ORD1051", "Quincy Campbell", "16 Dec 2024", "Completed", 756.80, "Paid"),
        ("#ORD1052", "Rita Parker", "17 Dec 2024", "Completed", 334.20, "Paid"),
        ("#ORD1053", "Steve Evans", "17 Dec 2024", "Completed", 167.90, "Paid"),
        
        # Additional Mixed Status
        ("#ORD1054", "Tara Edwards", "25 Dec 2024", "Pending", 289.40, "Unpaid"),
        ("#ORD1055", "Umar Collins", "25 Dec 2024", "Completed", 445.70, "Paid"),
        ("#ORD1056", "Vera Stewart", "26 Dec 2024", "Pending", 123.80, "Unpaid"),
        ("#ORD1057", "Will Sanchez", "26 Dec 2024", "Completed", 567.30, "Paid"),
        ("#ORD1058", "Xena Morris", "27 Dec 2024", "Refunded", 234.50, "Paid"),
    ]
    
    cursor.executemany("""
        INSERT INTO orders (order_number, customer_name, order_date, status, total_amount, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?)
    """, sample_orders)
    
    # Record this migration
    cursor.execute("INSERT INTO _migrations (name) VALUES (?)", ("003_add_more_seed_data",))
    
    conn.commit()
    conn.close()
    print("Migration 003_add_more_seed_data applied successfully.")


def downgrade():
    """Revert the migration."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Delete the orders added by this migration
    order_numbers = [f"#ORD{i}" for i in range(1009, 1059)]
    placeholders = ", ".join(["?"] * len(order_numbers))
    cursor.execute(f"DELETE FROM orders WHERE order_number IN ({placeholders})", order_numbers)
    
    # Remove migration record
    cursor.execute("DELETE FROM _migrations WHERE name = ?", ("003_add_more_seed_data",))
    
    conn.commit()
    conn.close()
    print("Migration 003_add_more_seed_data reverted successfully.")
