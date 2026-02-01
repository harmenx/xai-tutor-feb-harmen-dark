from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.database import get_db

router = APIRouter(prefix="/orders", tags=["orders"])


# --- Pydantic Models ---

class Customer(BaseModel):
    name: str
    email: str
    avatar: Optional[str] = None

class OrderBase(BaseModel):
    order_number: str
    customer: Customer
    order_date: str
    status: str
    total_amount: float
    payment_status: str

class OrderCreate(BaseModel):
    customer: Customer
    total_amount: float
    status: str = "pending"
    payment_status: str = "unpaid"

class OrderUpdate(BaseModel):
    customer: Optional[Customer] = None
    status: Optional[str] = None
    total_amount: Optional[float] = None
    payment_status: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer: Customer
    order_date: str
    status: str
    total_amount: float
    payment_status: str
    created_at: str
    updated_at: str

class BulkStatusRequest(BaseModel):
    order_ids: List[str]
    status: str

class BulkIdsRequest(BaseModel):
    order_ids: List[str]


# --- Helper Functions ---

def row_to_order(row) -> dict:
    """Convert database row to order dict matching contract."""
    return {
        "id": str(row["id"]),
        "order_number": row["order_number"],
        "customer": {
            "name": row["customer_name"],
            "email": row["customer_email"],
            "avatar": row["customer_avatar"]
        },
        "order_date": row["order_date"],
        "status": row["status"],
        "total_amount": row["total_amount"],
        "payment_status": row["payment_status"],
        "created_at": row.get("created_at", datetime.utcnow().isoformat()),
        "updated_at": row.get("updated_at", datetime.utcnow().isoformat())
    }


# --- Routes ---

@router.get("", response_model=dict)
def list_orders(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by customer name or order number"),
    sort_by: Optional[str] = Query("id", description="Sort by field"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc or desc)")
):
    """
    Fetch all orders with optional filtering, pagination, and sorting.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Base query
            base_query = "FROM orders"
            params = []
            conditions = []
            
            # Map status filter values
            if status:
                status_map = {
                    "incomplete": "Pending",
                    "finished": "Completed",
                    "pending": "Pending",
                    "completed": "Completed",
                    "refunded": "Refunded"
                }
                mapped_status = status_map.get(status.lower(), status)
                conditions.append("status = ?")
                params.append(mapped_status)
                
            if search:
                conditions.append("(customer_name LIKE ? OR order_number LIKE ?)")
                search_term = f"%{search}%"
                params.append(search_term)
                params.append(search_term)
            
            if conditions:
                base_query += " WHERE " + " AND ".join(conditions)
                
            # Count total matching rows
            count_query = f"SELECT COUNT(*) {base_query}"
            cursor.execute(count_query, params)
            total_items = cursor.fetchone()[0]
            
            # Validate and sanitize sort parameters
            allowed_sort_fields = ["id", "order_number", "order_date", "total_amount", "payment_status", "customer_name", "status"]
            if sort_by not in allowed_sort_fields:
                sort_by = "id"
            
            if sort_order.lower() not in ["asc", "desc"]:
                sort_order = "desc"
            
            # Fetch paginated data with sorting
            query = f"""
                SELECT id, order_number, customer_name, customer_email, customer_avatar,
                       order_date, status, total_amount, payment_status, created_at, updated_at
                {base_query} 
                ORDER BY {sort_by} {sort_order.upper()} 
                LIMIT ? OFFSET ?
            """
            
            offset = (page - 1) * limit
            params.append(limit)
            params.append(offset)
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            orders = [row_to_order(row) for row in rows]
            
            total_pages = (total_items + limit - 1) // limit  # Ceiling division
            
            return {
                "orders": orders,
                "total": total_items,
                "page": page,
                "limit": limit,
                "total_pages": total_pages
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/stats")
def get_order_stats():
    """
    Get statistics for orders.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Total Orders This Month (simplified - just total for now)
            cursor.execute("SELECT COUNT(*) FROM orders")
            total = cursor.fetchone()[0]
            
            # Pending
            cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'Pending'")
            pending = cursor.fetchone()[0]
            
            # Shipped/Completed
            cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'Completed'")
            shipped = cursor.fetchone()[0]
            
            # Refunded
            cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'Refunded'")
            refunded = cursor.fetchone()[0]
            
            return {
                "total_orders_this_month": total,
                "pending_orders": pending,
                "shipped_orders": shipped,
                "refunded_orders": refunded
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str):
    """
    Fetch single order details.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, order_number, customer_name, customer_email, customer_avatar,
                       order_date, status, total_amount, payment_status, created_at, updated_at
                FROM orders WHERE id = ?
            """, (order_id,))
            row = cursor.fetchone()
            
            if row is None:
                raise HTTPException(status_code=404, detail="Order not found")
                
            return row_to_order(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("", status_code=201, response_model=OrderResponse)
def create_order(order: OrderCreate):
    """
    Create a new order.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Generate order number
            cursor.execute("SELECT MAX(id) FROM orders")
            max_id = cursor.fetchone()[0] or 0
            order_number = f"#ORD{max_id + 1000 + 1}"
            
            current_time = datetime.utcnow().isoformat()
            order_date = datetime.utcnow().strftime("%Y-%m-%d")
            
            cursor.execute("""
                INSERT INTO orders (
                    order_number, customer_name, customer_email, customer_avatar,
                    order_date, status, total_amount, payment_status, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                order_number,
                order.customer.name,
                order.customer.email,
                order.customer.avatar,
                order_date,
                order.status,
                order.total_amount,
                order.payment_status,
                current_time,
                current_time
            ))
            
            order_id = cursor.lastrowid
            
            return {
                "id": str(order_id),
                "order_number": order_number,
                "customer": {
                    "name": order.customer.name,
                    "email": order.customer.email,
                    "avatar": order.customer.avatar
                },
                "order_date": order_date,
                "status": order.status,
                "total_amount": order.total_amount,
                "payment_status": order.payment_status,
                "created_at": current_time,
                "updated_at": current_time
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(order_id: str, order: OrderUpdate):
    """
    Update an order.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check existence
            cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
            existing = cursor.fetchone()
            if not existing:
                raise HTTPException(status_code=404, detail="Order not found")
            
            # Build update query dynamically
            update_fields = []
            values = []
            
            if order.customer:
                update_fields.extend(["customer_name = ?", "customer_email = ?", "customer_avatar = ?"])
                values.extend([order.customer.name, order.customer.email, order.customer.avatar])
            
            if order.status is not None:
                update_fields.append("status = ?")
                values.append(order.status)
            
            if order.total_amount is not None:
                update_fields.append("total_amount = ?")
                values.append(order.total_amount)
            
            if order.payment_status is not None:
                update_fields.append("payment_status = ?")
                values.append(order.payment_status)
            
            if not update_fields:
                # Nothing to update, return existing
                return row_to_order(existing)
            
            # Add updated_at
            update_fields.append("updated_at = ?")
            values.append(datetime.utcnow().isoformat())
            values.append(order_id)
            
            query = f"UPDATE orders SET {', '.join(update_fields)} WHERE id = ?"
            cursor.execute(query, values)
            
            # Fetch updated
            cursor.execute("""
                SELECT id, order_number, customer_name, customer_email, customer_avatar,
                       order_date, status, total_amount, payment_status, created_at, updated_at
                FROM orders WHERE id = ?
            """, (order_id,))
            updated = cursor.fetchone()
            
            return row_to_order(updated)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: str):
    """
    Delete an order.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM orders WHERE id = ?", (order_id,))
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Order not found")
            return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# --- Bulk Operations ---

@router.put("/bulk/status")
def bulk_update_status(request: BulkStatusRequest):
    """
    Bulk update status for multiple orders.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Convert string IDs to integers for query
            order_ids = [int(id) for id in request.order_ids]
            
            placeholders = ", ".join(["?"] * len(order_ids))
            current_time = datetime.utcnow().isoformat()
            
            query = f"UPDATE orders SET status = ?, updated_at = ? WHERE id IN ({placeholders})"
            params = [request.status, current_time] + order_ids
            cursor.execute(query, params)
            
            # Fetch updated orders
            cursor.execute(f"""
                SELECT id, order_number, customer_name, customer_email, customer_avatar,
                       order_date, status, total_amount, payment_status, created_at, updated_at
                FROM orders WHERE id IN ({placeholders})
            """, order_ids)
            
            updated_orders = [row_to_order(row) for row in cursor.fetchall()]
            
            return {
                "updated_count": cursor.rowcount,
                "orders": updated_orders
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("/bulk/duplicate", status_code=201)
def bulk_duplicate_orders(request: BulkIdsRequest):
    """
    Duplicate multiple orders.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            order_ids = [int(id) for id in request.order_ids]
            placeholders = ", ".join(["?"] * len(order_ids))
            
            cursor.execute(f"SELECT * FROM orders WHERE id IN ({placeholders})", order_ids)
            rows = cursor.fetchall()
            
            new_orders = []
            current_time = datetime.utcnow().isoformat()
            
            for row in rows:
                new_order_number = f"{row['order_number']} (Copy)"
                cursor.execute("""
                    INSERT INTO orders (
                        order_number, customer_name, customer_email, customer_avatar,
                        order_date, status, total_amount, payment_status, created_at, updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    new_order_number,
                    row['customer_name'],
                    row['customer_email'],
                    row['customer_avatar'],
                    row['order_date'],
                    row['status'],
                    row['total_amount'],
                    row['payment_status'],
                    current_time,
                    current_time
                ))
                
                new_orders.append({
                    "id": str(cursor.lastrowid),
                    "order_number": new_order_number,
                    "original_order_id": str(row['id'])
                })
            
            return {
                "duplicated_count": len(new_orders),
                "new_orders": new_orders
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/bulk", status_code=200)
def bulk_delete_orders(request: BulkIdsRequest):
    """
    Bulk delete multiple orders.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            order_ids = [int(id) for id in request.order_ids]
            placeholders = ", ".join(["?"] * len(order_ids))
            
            query = f"DELETE FROM orders WHERE id IN ({placeholders})"
            cursor.execute(query, order_ids)
            
            return {
                "deleted_count": cursor.rowcount,
                "deleted_ids": request.order_ids
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
