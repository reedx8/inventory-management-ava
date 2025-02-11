import { ReactNode } from 'react';

export type QueryResults = {
    id: number;
    name: string;
    vendor_name: string;
    units: string | undefined;
    store_categ: string | undefined;
    item_description: string | undefined;
    is_active: boolean;
    email: string | undefined;
    phone: string | undefined;
    categ: string | undefined;
};

export type SheetTemplateProps = {
    // Required props
    children: ReactNode;
    trigger: ReactNode;
    title: string;

    // Optional props for sheet header
    description?: string;

    // Optional customization
    className?: string;
    contentClassName?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';

    // Optional callbacks
    onOpenChange?: (open: boolean) => void;
};
