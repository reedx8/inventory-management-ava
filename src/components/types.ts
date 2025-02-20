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

// Active store locations only
export const STORE_LOCATIONS = ['Hall', 'Progress', 'Kruse', 'Orenco'] as const;

export type StoreLocation = (typeof STORE_LOCATIONS)[number];

// Invoice Categories
export const INVOICE_CATEGORIES = [
    'SANDWICH',
    'PASTRY',
    'FOOD',
    'COOLER&EXTRAS',
    'BEVERAGE',
    'MISC/BATHROOM',
    'CHOCOLATE&TEA',
    'COFFEE',
    'NONE',
] as const;

export type InvoiceCategory = (typeof INVOICE_CATEGORIES)[number];

// Cron Categories
export const CRON_CATEGORIES = [
    'PASTRY',
    'MILK',
    'BREAD',
    'RETAILBEANS',
    'MEATS',
    'NONE',
] as const;

export type CronCategory = (typeof CRON_CATEGORIES)[number];

// Vendor names much match with vendor names in DB
export const MILK_BREAD_VENDORS = ['Petes Milk', 'Grand Central'] as const;
export type MilkBreadVendor = (typeof MILK_BREAD_VENDORS)[number];

export type VendorContact = {
    id: number;
    name: string;
    email: string | undefined;
    phone: string | undefined;
    logo: string | undefined;
    website: string | undefined;
};
