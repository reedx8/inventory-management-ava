export type OrderItem = {
    id: number;
    name: string;
    due_date?: string;
    qty_per_order: string;
    order: number | null;
    store_categ: string;
    store_name: string;
};

export const STORE_CATEGORIES = [
    'ALL',
    'PASTRY',
    'FRONT',
    'GENERAL',
    'FRIDGE',
    'STOCKROOM',
    'BEANS&TEA',
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];
