export type BakeryOrder = {
    id: number;
    name: string;
    units?: string | undefined;
    order_qty: number | undefined; // the quantity stores ordered for item
    made_qty: number | undefined; // the quantity bakery actually made for item
    was_edited: boolean | undefined; // if bakery edited order in edit sheet form
    // is_checked_off?: boolean | undefined;
    completed_at: string | undefined;
    store_data?: Array<{ store_name: string; order_qty: number }> | undefined;
    // store_data?: Array<{ store_id: number; order_qty: number }> | undefined;
};
