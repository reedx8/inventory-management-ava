export type BakeryOrder = {
    id: number;
    name: string;
    units?: string | undefined;
    order_qty: number | undefined;
    is_checked_off?: boolean | undefined;
    completed_at: string | undefined;
};
