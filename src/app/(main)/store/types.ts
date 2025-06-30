// These keys are a mix of items table, orders table, and bakery_orders table fields in the DB/schema
export type OrderItem = {
    id: number; // items.id
    name: string; // items.name
    due_date?: string;
    qty_per_order: string; // items.units
    order: number | null;
    store_categ: string;
    store_name: string;
    cron_categ: string;
    pars_value: number;
    list_price: number | null;
    vendor_id: number | null;
};

// For CTC/CCP&Sysco item's stock counts
export type StockItem = {
    id: number;
    name: string;
    units: string;
    count: number;
    store_id: number;
    store_name: string | null;
    cron_categ: string;
    store_categ?: string;
};

// These must match items.store_categ check constraint in the DB/schema
export const STORE_CATEGORIES = [
    'ALL',
    'PASTRY',
    'FRONT',
    'GENERAL',
    'FRIDGE',
    'STOCKROOM',
    'BEANS&TEA',
    'NONE',
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];
