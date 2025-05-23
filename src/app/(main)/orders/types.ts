export type MilkBreadOrder = {
    order_id: number;
    name: string;
    units: string | undefined;
    stock_count: number;
    order_qty: number;
    store_name: string;
    store_id: number;
    cpu: number; // cost per unit
    vendor_name: string;
    vendor_id: number;
    category: string;
    par: number;
    item_code: string;
    order_submitted: boolean;
};

export type VendorOrder = {
    id: number;
    name: string;
    units: string | undefined;
    store_qty: number | undefined; // store_orders.qty. Suggested order quantity from store managers
    order_qty: number | null;
    store_name: string;
    price: number | undefined;
    vendor_name: string;
};
