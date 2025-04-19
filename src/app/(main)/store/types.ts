// These keys are a mix of items table, orders table, and bakery_orders table fields in the DB/schema
export type OrderItem = {
    id: number;
    name: string;
    due_date?: string;
    qty_per_order: string;
    order: number | null;
    store_categ: string;
    store_name: string;
    cron_categ: string;
    pars_value: number;
};

// These must match items.store_categ check constraint in the DB/schema
export const STORE_CATEGORIES = [
    'ALL',
    'PASTRY', // default value for store page
    'FRONT',
    'GENERAL',
    'FRIDGE',
    'STOCKROOM',
    'BEANS&TEA',
    'NONE',
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];
