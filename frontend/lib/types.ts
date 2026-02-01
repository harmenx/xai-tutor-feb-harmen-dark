export interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    order_date: string;
    status: string;
    total_amount: number;
    payment_status: string;
}

export interface OrderStats {
    total: number;
    pending: number;
    shipped: number;
    refunded: number;
}
