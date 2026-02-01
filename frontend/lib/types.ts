export interface Customer {
    name: string;
    email: string;
    avatar?: string;
}

export interface Order {
    id: string;
    order_number: string;
    customer: Customer;
    order_date: string;
    status: string;
    total_amount: number;
    payment_status: string;
    created_at: string;
    updated_at: string;
}

export interface OrderStats {
    total_orders_this_month: number;
    pending_orders: number;
    shipped_orders: number;
    refunded_orders: number;
}
