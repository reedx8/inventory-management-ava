export type MilkBreadOrder = {
    id: number;
    name: string;
    units: string | undefined;
    stock_count: number | undefined;
    order_qty: number | undefined;
    store_name: string;
    price: number | undefined;
    vendor_name: string;
};

export type VendorOrder = {
    id: number;
    name: string;
    units: string | undefined;
    store_qty: number | undefined; // store_orders.qty. Suggested order quantity from store managers
    order_qty: number | undefined;
    store_name: string;
    price: number | undefined;
    vendor_name: string;
};
