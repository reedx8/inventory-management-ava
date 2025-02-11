export type BakeryOrder = {
    id: number;
    name: string;
    units?: string | undefined;
    order_qty: number | undefined;
    is_complete?: boolean | undefined;
};
