from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db

router = APIRouter(prefix="/orders", tags=["orders"])


# --- Pydantic Models ---

class OrderBase(BaseModel):
    order_number: str
    customer_name: str
    order_date: str
    status: str
    total_amount: float
    payment_status: str

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    # All fields optional for update
    order_number: Optional[str] = None
    customer_name: Optional[str] = None
    order_date: Optional[str] = None
    status: Optional[str] = None
    total_amount: Optional[float] = None
    payment_status: Optional[str] = None

class OrderResponse(OrderBase):
    id: int

class BulkStatusRequest(BaseModel):
    order_ids: List[int]
    status: str

class BulkIdsRequest(BaseModel):
    order_ids: List[int]


# --- Routes ---

@router.get("", response_model=dict)
def list_orders(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(None, description="Filter by status (e.g., Pending, Completed)"),
    search: Optional[str] = Query(None, description="Search by customer name or order number"),
    sort_by: Optional[str] = Query("id", description="Sort by field (order_number, order_date, total_amount, payment_status, customer_name)"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc or desc)")
):
    """
    Fetch all orders with optional filtering and pagination.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Base query
            base_query = "FROM orders"
            params = []
            conditions = []
            
            if status:
                conditions.append("status = ?")
                params.append(status)
                
            if search:
                # Basic case-insensitive search
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
            query = f"SELECT id, order_number, customer_name, order_date, status, total_amount, payment_status {base_query} ORDER BY {sort_by} {sort_order.upper()} LIMIT ? OFFSET ?"
            
            offset = (page - 1) * limit
            params.append(limit)
            params.append(offset)
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            orders = [
                {
                    "id": row["id"],
                    "order_number": row["order_number"],
                    "customer_name": row["customer_name"],
                    "order_date": row["order_date"],
                    "status": row["status"],
                    "total_amount": row["total_amount"],
                    "payment_status": row["payment_status"]
                }
                for row in rows
            ]
            
            total_pages = (total_items + limit - 1) // limit
            
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
            
            # Total Orders
            cursor.execute("SELECT COUNT(*) FROM orders")
            total = cursor.fetchone()[0]
            
            # Pending
            cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'Pending'")
            pending = cursor.fetchone()[0]
            
            # Completed (Shipped)
            cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'Completed'")
            shipped = cursor.fetchone()[0]
            
            # Refunded
            cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'Refunded'")
            refunded = cursor.fetchone()[0]
            
            return {
                "total": total,
                "pending": pending,
                "shipped": shipped,
                "refunded": refunded
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int):
    """
    Fetch single order details.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, order_number, customer_name, order_date, status, total_amount, payment_status 
                FROM orders WHERE id = ?
            """, (order_id,))
            row = cursor.fetchone()
            
            if row is None:
                raise HTTPException(status_code=404, detail="Order not found")
                
            return {
                "id": row["id"],
                "order_number": row["order_number"],
                "customer_name": row["customer_name"],
                "order_date": row["order_date"],
                "status": row["status"],
                "total_amount": row["total_amount"],
                "payment_status": row["payment_status"]
            }
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
            cursor.execute("""
                INSERT INTO orders (order_number, customer_name, order_date, status, total_amount, payment_status)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (order.order_number, order.customer_name, order.order_date, order.status, order.total_amount, order.payment_status))
            
            order_id = cursor.lastrowid
            
            return {
                "id": order_id,
                **order.dict()
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(order_id: int, order: OrderUpdate):
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
            update_data = order.dict(exclude_unset=True)
            if not update_data:
                # Nothing to update, return existing
                return {
                    "id": existing["id"],
                    "order_number": existing["order_number"],
                    "customer_name": existing["customer_name"],
                    "order_date": existing["order_date"],
                    "status": existing["status"],
                    "total_amount": existing["total_amount"],
                    "payment_status": existing["payment_status"]
                }
                
            set_clauses = [f"{key} = ?" for key in update_data.keys()]
            values = list(update_data.values())
            values.append(order_id)
            
            query = f"UPDATE orders SET {', '.join(set_clauses)} WHERE id = ?"
            cursor.execute(query, values)
            
            # Fetch updated
            cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
            updated = cursor.fetchone()
            
            return {
                "id": updated["id"],
                "order_number": updated["order_number"],
                "customer_name": updated["customer_name"],
                "order_date": updated["order_date"],
                "status": updated["status"],
                "total_amount": updated["total_amount"],
                "payment_status": updated["payment_status"]
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int):
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
            
            placeholders = ", ".join(["?"] * len(request.order_ids))
            query = f"UPDATE orders SET status = ? WHERE id IN ({placeholders})"
            
            params = [request.status] + request.order_ids
            cursor.execute(query, params)
            
            return {"message": f"Updated {cursor.rowcount} orders to status '{request.status}'"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("/bulk/duplicate")
def bulk_duplicate_orders(request: BulkIdsRequest):
    """
    Duplicate multiple orders.
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            placeholders = ", ".join(["?"] * len(request.order_ids))
            select_query = f"SELECT * FROM orders WHERE id IN ({placeholders})"
            cursor.execute(select_query, request.order_ids)
            rows = cursor.fetchall()
            
            new_orders_count = 0
            for row in rows:
                new_order_number = f"{row['order_number']} (Copy)"
                cursor.execute("""
                    INSERT INTO orders (order_number, customer_name, order_date, status, total_amount, payment_status)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (new_order_number, row['customer_name'], row['order_date'], row['status'], row['total_amount'], row['payment_status']))
                new_orders_count += 1
                
            return {"message": f"Duplicated {new_orders_count} orders"}
            
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
            
            placeholders = ", ".join(["?"] * len(request.order_ids))
            query = f"DELETE FROM orders WHERE id IN ({placeholders})"
            
            cursor.execute(query, request.order_ids)
            
            return {"message": f"Deleted {cursor.rowcount} orders"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
