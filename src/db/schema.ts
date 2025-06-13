// Schema for Ava Roasteria's Inventory Management System (IMS)
import {
    integer,
    decimal,
    boolean,
    pgTable,
    serial,
    text,
    varchar,
    timestamp,
    primaryKey,
    check,
    uniqueIndex,
    pgPolicy,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/supabase';

// General items of Ava Roasteria for every store.
// Ok to rename items (eg alpenrose whole to touchstone whole) but generally not recommended (to preserve history details of orders). Should use vendor_items table instead
export const itemsTable = pgTable(
    'items',
    {
        id: serial('id').primaryKey(),
        name: varchar('name').notNull().unique(), // General/internal name of item + size of item (if any). Avoid using brand name, due to vendor_items table, but its ok if you do
        vendor_id: integer('vendor_id')
            .notNull()
            .references(() => vendorsTable.id), // default/dummy/placeholder vendor that typically supplies this item. Simply used to fill orders.vendor_id as a rough guess of the vendor that will supply this item, no other use. However for CTC items its just ava design, and not what you may think CCP
        units: varchar('units'), // Items unit from its primary vendor (or bakery), ie quantity of order for ordering, not size of order (eg XL, or Full/Half, etc). These can be vendor locked/dependant (eg 1 gal, 12/32oz, QUART, 1G, .5G, 2/5#AVG, 1200/4.5 GM, etc). Just change in csv if vendor changed-to requires different unit
        // unit_qty: decimal('unit_qty', { precision: 10, scale: 2 }), // unit quantity of item
        list_price: decimal('list_price', { precision: 20, scale: 6 })
            .notNull()
            .default(sql`0.00`), // Default, most recent list price for item, unless specified in vendor_items table
        cron_categ: varchar('cron_categ').default('NONE'), // Most important category field that is used for all order schedules throughout app. Maps to how their gsheets was organized (CTC -> Coffee, Tea, Chocolate, CCP&SYCO -> CCP&SYSCO, Monday Thursday Inventory -> Milk/ Bread, Bakery Orders -> PASTRY). And ensured no overlap between them
        main_categ: varchar('main_categ'), // sorting category, used only for sorting output of items in specific way (eg cakes)
        sub_categ: varchar('sub_categ'), // 2nd sorting category (used only when main_categ is not enough to sort items as biz desires)
        invoice_categ: varchar('invoice_categ').notNull().default('NONE'), // accounting category for invoicing
        store_categ: varchar('store_categ').notNull(), // categories for store managers
        bake_order: integer('bake_order'), // the exact order pastry items are made by bakery staff
        is_waste_tracked: boolean('is_waste_tracked').default(false),
        item_description: text('item_description'), // internal description of item
        is_active: boolean('is_active').notNull().default(true), // whether item is active or not for all stores
        picture: text('picture'),
        created_at: timestamp('created_at', {
            precision: 3,
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
        // vendor_description: text('vendor_description'), // primary vendor description of item. SEE MASTER ORDER SHEET - SYSCO TABS
        // is_weekly_stock: boolean('is_weekly_stock').notNull().default(false), // whether item is part of weekly stock count routine or not
        // is_sunday_stock: boolean('is_sunday_stock').notNull().default(false), // whether item is part of sunday stock count routine or not
        // requires_inventory: boolean('requires_inventory'), // whether item requires inventory
        // requires_order: boolean('requires_order'), // whether item requires order
        // is_active_for_store: jsonb('is_active_for_store'), // Store JSON mapping of store IDs to active status, to activate/deactivate items per store (future feature)
        // store_categories: jsonb('store_categories'), // Store JSON mapping of store IDs to store_categ, to categorize items per store (future feature)
    },
    (table) => {
        return [
            check(
                'invoice_categ_check',
                sql`${table.invoice_categ} IN ('PASTRY', 'COOLER&EXTRAS', 'BEVERAGE', 'MISC/BATHROOM', 'CTC', 'CCP&SYSCO', 'NONE')`
            ),
            check('positive_list_price', sql`${table.list_price} >= 0`),
            check(
                'store_category_check',
                sql`${table.store_categ} IN ('FRONT', 'STOCKROOM', 'FRIDGE', 'GENERAL', 'BEANS&TEA', 'PASTRY', 'NONE')`
            ),
            check(
                'cron_category_check',
                sql`${table.cron_categ} IN ('PASTRY', 'MILK', 'BREAD', 'CHOCOLATE', 'TEA', 'COFFEE', 'CCP&SYSCO', 'NONE')`
            ),
            check(
                'main_category_check',
                sql`${table.main_categ} IN ('CAKES', 'TURNOVERS', 'MUFFINS', 'BAGELS', 'CROISSANTS', 'NONE')`
            ),
            check(
                'sub_category_check',
                sql`${table.sub_categ} IN ('NONE', 'CUPCAKES')`
            ),
            pgPolicy('Enable update for authenticated users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable Items read for authenticated users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable inserting items for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
        ];
    }
);

// Vendor item's metadata, ie additional item details when neccessary/needed. Eg where vendors have different names or details for the same general/internal item we use
// Primary Use: For automating the generating/emailing of excel files for/to vendors that need exact details or additional metadata details in which other records in items table do not need
// Eg Petes milk needs "PACIFIC ORIGINAL ALMOND MILK - BARISTA" exactly in its excel file, while we (store managers) only care about "Almond milk" at time of ordering
export const vendorItemsTable = pgTable(
    'vendor_items',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
        vendor_id: integer('vendor_id')
            .notNull()
            .references(() => vendorsTable.id),
        alt_name: varchar('alt_name'), // Alternative name: exact name of item vendor needs/uses, if needed
        list_price: decimal('list_price', { precision: 20, scale: 6 }), // if needed, vendor items most revent list price
        barcode: varchar('barcode'), // vendor specific barcode for item as shown on receipt/invoice, if needed
        item_code: varchar('item_code'), // Aka product code. Vendor specific item code/number (SUPC for Sysco, Petes Milk, Grand Central, etc)
        brand_code: varchar('item_brand'), // brand acronym/code of item from vendor (eg AREZIMP or WHLFCLS from Sysco vendor, etc)
        units: varchar('units'), // if different from item.units
        is_active: boolean('is_active').notNull().default(true),
        is_primary: boolean('is_primary').notNull().default(false), // (may delete) whether this is the primary item for this vendor
        item_description: text('item_description'), // vendor description of item. SEE MASTER ORDER SHEET - SYSCO TABS
        created_at: timestamp('created_at', {
            precision: 3,
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => {
        return [
            check('positive_list_price', sql`${table.list_price} >= 0`),
            // can have multiple records with the same vendor and aka name but different brands/names
            // Remove item_name if you want 1 item_name per vendor/general item (but using is_primary will alleviate any problems?)
            uniqueIndex('vendor_item_unique_idx').on(
                table.vendor_id,
                table.item_id,
                table.alt_name
            ),
            uniqueIndex('single_primary_vendor_item').on(
                table.vendor_id,
                table.item_id,
                table.is_primary
            ),
            pgPolicy('Enable inserting for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable deleting for auth users only', {
                for: 'delete',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// Record of stock counts from every store. Stock counts used for CCP/CTC items, and order Milk And Bread items
export const stockTable = pgTable(
    'stock',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
        store_id: integer('store_id')
            .notNull()
            .references(() => storesTable.id),
        count: decimal('count', { precision: 20, scale: 6 }).notNull(),
        units: varchar('units'),
        submitted_at: timestamp('submitted_at', {
            precision: 3,
            withTimezone: true,
        }), // when store managers submitted their stock count for item
    },
    (table) => {
        return [
            check('positive_count', sql`${table.count} >= 0`),
            pgPolicy('Enable inserting stock for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating stock for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading stock for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable deleting stock for auth users only', {
                for: 'delete',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

export const weekCloseTable = pgTable(
    'week_close',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
        store_id: integer('store_id')
            .notNull()
            .references(() => storesTable.id),
        count: decimal('count', {
            precision: 20,
            scale: 6,
        }), // for pastry items
        closed_count: decimal('closed_count', {
            precision: 20,
            scale: 6,
        }), // for meat items
        sealed_count: decimal('sealed_count', {
            precision: 20,
            scale: 6,
        }), // for meat items
        open_items_weight: decimal('open_items_weight', {
            precision: 20,
            scale: 6,
        }), // For meat items, in oz.
        expired_count: decimal('expired_count', {
            precision: 20,
            scale: 6,
        }), // for retail bean items
        unexpired_count: decimal('unexpired_count', {
            precision: 20,
            scale: 6,
        }), // for retail bean items
        reused_count: decimal('reused_count', {
            precision: 20,
            scale: 6,
        }), // for retail bean items
        submitted_at: timestamp('submitted_at', {
            precision: 3,
            withTimezone: true,
        })
            .notNull()
            .defaultNow(), // When item's Sunday close entry was originally submitted by store managers
        updated_at: timestamp('updated_at', {
            precision: 3,
            withTimezone: true,
        }), // When item was last updated by store managers, if any
    },
    (table) => {
        return [
            check('positive_count', sql`${table.count} >= 0`),
            check('positive_closed_count', sql`${table.closed_count} >= 0`),
            check('positive_sealed_count', sql`${table.sealed_count} >= 0`),
            check(
                'open_items_weight_check',
                sql`${table.open_items_weight} >= 0`
            ),
            check('expired_count_check', sql`${table.expired_count} >= 0`),
            check('unexpired_count_check', sql`${table.unexpired_count} >= 0`),
            check('reused_count_check', sql`${table.reused_count} >= 0`),
            pgPolicy('Enable inserting records for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating records for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading records for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable deleting records for auth users only', {
                for: 'delete',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// History and current item orders for Ava's vendors per store
export const ordersTable = pgTable(
    'orders',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
        store_id: integer('store_id')
            .notNull()
            .references(() => storesTable.id),
        vendor_id: integer('vendor_id').references(() => vendorsTable.id), // Optional default/predicted vendor of item. Value is copied from items.vendor_id
        stock_id: integer('stock_id').references(() => stockTable.id), // Optional stock count of item at time of order
        qty: decimal('qty', { precision: 20, scale: 6 }), // null if no order was submitted by order managers
        par: decimal('par', { precision: 20, scale: 6 }), // par level at time of order
        units: varchar('units'), // quantity per order, copied from orders.units (unless changed at time of vendor order)
        list_price: decimal('list_price', {
            precision: 20,
            scale: 6,
        }), // List price at time of order (tf need to allow null to wait for list price update at time of order not time of stock count). Default value is items.list_price.
        final_price: decimal('final_price', {
            precision: 20,
            scale: 6,
        }), // (may delete, invoice table) final invoiced price for item, default value = items.list_price
        adj_price: decimal('adj_price', {
            precision: 20,
            scale: 6,
        }), // (may delete, invoice table) average price of item across stores, edge case for ccp items?, to report to stores
        is_par_submit: boolean('is_par_submit').notNull().default(false), // whether order was submitted by store managers as a PAR order
        group_order_no: integer('group_order_no'), // (may delete) group order number for orders that are grouped together (eg for a weekly order)
        ordered_via: varchar('ordered_via').default('MANUALLY'), // How order was eventually processed. Eg manual (shopped in store, manually emailed, etc), email, web, or api
        store_submit_at: timestamp('store_submit_at', {
            precision: 3,
            withTimezone: true,
        })
            .notNull()
            .defaultNow(), // date order originally submitted by store
        order_submit_at: timestamp('order_submit_at', {
            precision: 3,
            withTimezone: true,
        }), // null if no order was submitted by order managers
    },
    (table) => {
        return [
            check('positive_qty', sql`${table.qty} >= 0`),
            check('positive_par', sql`${table.par} >= 0`),
            check('positive_list_price', sql`${table.list_price} >= 0`),
            check('positive_final_price', sql`${table.final_price} >= 0`),
            check('positive_adj_price', sql`${table.adj_price} >= 0`),
            check(
                'check_ordered_via',
                sql`${table.ordered_via} IN ('MANUALLY', 'EMAIL', 'WEB', 'API')`
            ),
            check('positive_group_order_no', sql`${table.group_order_no} >= 0`),
            pgPolicy('Enable inserting orders for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating orders for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading orders for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable deleting orders for auth users only', {
                for: 'delete',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// History of bakery orders per item
export const bakeryOrdersTable = pgTable(
    'bakery_orders',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
        temp_tot_order_qty: decimal('temp_tot_order_qty', {
            precision: 20,
            scale: 6,
        }), // temporary field for now, can be removed and not currently used in queries (temp_tot_made however is used currently but should be removed in future since it can be derived)
        temp_tot_made: decimal('temp_tot_made', { precision: 20, scale: 6 }), // total actually made by bakery staff (temp_tot_order_qty = tot_made = sum of store_bakery_orders.order_qty)
        units: varchar('units'),
        is_checked_off: boolean('is_checked_off').notNull().default(false), // todo checked off by bakery staff (tot_order_qty = tot_made)
        group_order_no: integer('group_order_no').notNull().default(0), // default = 0 when single order (not a batched order). Rare.
        bakery_comments: text('bakery_comments'),
        created_at: timestamp('created_at', {
            precision: 3,
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
        completed_at: timestamp('completed_at', {
            precision: 3,
            withTimezone: true,
        }), // bakery staff submitted their completed order counts in UI at this time
    },
    (table) => {
        return [
            check(
                'positive_temp_tot_order_qty',
                sql`${table.temp_tot_order_qty} >= 0`
            ),
            check('positive_temp_tot_made', sql`${table.temp_tot_made} >= 0`),
            check('positive_group_order_no', sql`${table.group_order_no} >= 0`),
            pgPolicy('Enable inserting bakery orders for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating bakery orders for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading bakery orders for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable deleting bakery orders for auth users only', {
                for: 'delete',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// History of bakery orders per store
export const storeBakeryOrdersTable = pgTable(
    'store_bakery_orders',
    {
        id: serial('id').primaryKey(),
        order_id: integer('order_id')
            .notNull()
            .references(() => bakeryOrdersTable.id),
        store_id: integer('store_id')
            .notNull()
            .references(() => storesTable.id),
        order_qty: decimal('order_qty', { precision: 20, scale: 6 }), // quantity ordered from store managers
        made_qty: decimal('made_qty', { precision: 20, scale: 6 }), // quantity actually made by bakery staff for store
        par: decimal('par', { precision: 20, scale: 6 }), // par level at time of order
        is_par_submit: boolean('is_par_submit').notNull().default(false),
        comments: text('comments'),
        created_at: timestamp('created_at', {
            precision: 3,
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
        submitted_at: timestamp('submitted_at', {
            precision: 3,
            withTimezone: true,
        }), // store managers submitted their orders to bakery at this time
        bakery_completed_at: timestamp('bakery_completed_at', {
            precision: 3,
            withTimezone: true,
        }),
    },
    (table) => {
        return [
            check('positive_order_qty', sql`${table.order_qty} >= 0`),
            pgPolicy('Enable inserting bakery orders for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating bakery orders for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading bakery orders for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable deleting bakery orders for auth users only', {
                for: 'delete',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// Schedules table for scheduling cron jobs and outlining ava's complex ordering/stock schedule (item-level). More customizable/nuanced than junction table approach
// Schedule largely dictated by vendor (eg Petes milk), shelf life (eg daily pastry orders, or most orders since most items on avg have a week-long shelf life hence weekly batched orders), or tracking waste purposes (eg sunday close inventory)
// schedule days largely dictated by store manager schedules (eg most dont work on monday hence orders placed by tuesdays mostly)
// export const inventorySchedule = pgTable(
//     'inventory_schedule',
//     {
//         id: serial('id').primaryKey(),
//         item_id: integer('item_id')
//             .notNull()
//             .references(() => itemsTable.id),
//         is_order_sched: boolean('is_order_sched').notNull(), // schedule type 1/2
//         is_stock_sched: boolean('is_stock_sched').notNull(), // schedule type 2/2
//         frequency: varchar('frequency').notNull(),
//         weekly_freq: integer('weekly_freq').notNull(),
//         start_day: integer('start_day').array().notNull(), // check for valid days in application layer (subquery in migration file errors, altern solutions complex)
//         end_day: integer('end_day').array().notNull(), // check for valid days in application layer
//     },
//     (table) => {
//         return [
//             check(
//                 'positive_weekly_freq',
//                 sql`${table.weekly_freq} >= 1 AND ${table.weekly_freq} <= 7`
//             ),
//             check(
//                 'exclusive_schedule_type',
//                 sql`(${table.is_order_sched} AND NOT ${table.is_stock_sched}) OR
//                     (${table.is_stock_sched} AND NOT ${table.is_order_sched})`
//             ),
//             check(
//                 'check_frequency',
//                 sql`${table.frequency} IN ('WEEKLY', 'DAILY')`
//             ),
//         ];
//     }
// );

// List of vendors that stores can order from. Lookup table.
export const vendorsTable = pgTable(
    'vendors',
    {
        id: serial('id').primaryKey(),
        name: varchar('name').notNull().unique(), // vendors name (Ava Design, Bakery, Sysco, McDonalds, Javastock, Winco, Restaurant Depot, Chef Store, Costco, Grand Central (Jelena), Petes Milk (Jelena), Fred Meyer, and Safeway
        email: varchar('email'), // email for orders (if any)
        phone: varchar('phone'), // phone number for orders (if any)
        contact_name: varchar('contact_name'), // name of contact person for orders (if any)
        website: text('website'), // website for orders (if any)
        logo: varchar('logo'),
        is_active: boolean('is_active').notNull().default(true),
        is_exclusive_supplier: boolean('is_exclusive_supplier')
            .notNull()
            .default(false), // If in Exclusive Supply Agreement (ESA) with vendor, eg Sysco atm (non-ccp items if false. ccp = cost controlled product)
        agreement_start_date: timestamp('agreement_start_date', {
            precision: 3,
            withTimezone: true,
        }), // ESA start date for vendor (if any)
        agreement_end_date: timestamp('agreement_end_date', {
            precision: 3,
            withTimezone: true,
        }), // ESA end date for vendor (if any)
        comments: text('comments'),
    },
    () => [
        pgPolicy('Enable update for authenticated users only', {
            for: 'update',
            to: authenticatedRole,
            using: sql`true`, // This allows all authenticated users to select all rows
            withCheck: sql`true`,
        }),
        pgPolicy('Enable read for authenticated users only', {
            for: 'select',
            to: authenticatedRole,
            using: sql`true`, // This allows all authenticated users to select all rows
        }),
        pgPolicy('Enable inserting vendors for auth users only', {
            for: 'insert',
            to: authenticatedRole,
            withCheck: sql`true`,
        }),
    ]
);

// Tracks if an order was split between multiple vendors when processed (if any)
// Eg: if an item has orders.tot_qty_vendor = 10 when order delivered, and item's order used 2 vendors, then eg vendor_split.qty = 8, vendor_split.qty = 2 may (and should) be here (or any valid sum combination)
export const vendorSplitTable = pgTable(
    'vendor_split',
    {
        id: serial('id').primaryKey(),
        order_id: integer('order_id')
            .notNull()
            .references(() => ordersTable.id),
        vendor_id: integer('vendor_id')
            .notNull()
            .references(() => vendorsTable.id),
        qty: decimal('qty', { precision: 20, scale: 6 }),
        units: varchar('units'), // quantity per order, copied from orders.units (unless changed at time of vendor order)
        total_spent: decimal('total_spent', { precision: 20, scale: 6 }),
    },
    (table) => {
        return [
            check('positive_qty', sql`${table.qty} >= 0`),
            check('positive_total_spent', sql`${table.total_spent} >= 0`),
            pgPolicy('Enable inserting for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable deleting deleting for auth users only', {
                for: 'delete',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// List of stores at Ava Roasteria. Lookup table.
export const storesTable = pgTable(
    'stores',
    {
        id: serial('id').primaryKey(),
        name: varchar('name').notNull().unique(), // name of store (eg Hall, Barrows, etc)
        weekly_budget: decimal('weekly_budget', {
            precision: 20,
            scale: 6,
        }).default(sql`0.00`), // weekly budget for store
        is_active: boolean('is_active').notNull().default(false),
        logo: varchar('logo'),
    },
    (table) => {
        return [
            check('positive_weekly_budget', sql`${table.weekly_budget} >= 0`),
            pgPolicy('Enable inserting stores for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating stores for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading stores for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// Record table for tracking changes to records across tables
export const historyTable = pgTable(
    'history',
    {
        id: serial('id').primaryKey(),
        table_name: varchar('table_name').notNull(),
        record_id: integer('record_id').notNull(),
        field_name: varchar('field_name').notNull(),
        old_value: decimal('old_value', { precision: 20, scale: 6 }),
        new_value: decimal('new_value', { precision: 20, scale: 6 }),
        changed_at: timestamp('changed_at', {
            precision: 3,
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    () => {
        return [
            pgPolicy('Enable inserting for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable deleting for auth users only', {
                for: 'delete',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// Pars values for all stores and items
export const parsTable = pgTable(
    'pars',
    {
        // id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id, {
                onDelete: 'cascade',
            }),
        store_id: integer('store_id')
            .notNull()
            .references(() => storesTable.id),
        monday: decimal('monday', { precision: 20, scale: 6 }),
        tuesday: decimal('tuesday', { precision: 20, scale: 6 }),
        wednesday: decimal('wednesday', { precision: 20, scale: 6 }),
        thursday: decimal('thursday', { precision: 20, scale: 6 }),
        friday: decimal('friday', { precision: 20, scale: 6 }),
        saturday: decimal('saturday', { precision: 20, scale: 6 }),
        sunday: decimal('sunday', { precision: 20, scale: 6 }),
        weekly: decimal('weekly', { precision: 20, scale: 6 }),
    },
    (table) => {
        return [
            primaryKey({ columns: [table.item_id, table.store_id] }),
            check('positive_monday', sql`${table.monday} >= 0`),
            check('positive_tuesday', sql`${table.tuesday} >= 0`),
            check('positive_wednesday', sql`${table.wednesday} >= 0`),
            check('positive_thursday', sql`${table.thursday} >= 0`),
            check('positive_friday', sql`${table.friday} >= 0`),
            check('positive_saturday', sql`${table.saturday} >= 0`),
            check('positive_sunday', sql`${table.sunday} >= 0`),
            check('positive_weekly', sql`${table.weekly} >= 0`),
            pgPolicy('Enable inserting for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

export const vendorPriceHistoryTable = pgTable(
    'vendor_price_history',
    {
        id: serial('id').primaryKey(),
        vendor_id: integer('vendor_id')
            .notNull()
            .references(() => vendorsTable.id),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
        list_price: decimal('list_price', {
            precision: 20,
            scale: 6,
        }).notNull(),
        created_at: timestamp('created_at', {
            precision: 3,
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (t) => {
        return [
            check('positive_list_price', sql`${t.list_price} >= 0`),
            pgPolicy('Enable inserting for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// EDIT: deleted for now, this should instead by store_levels and only for implementing min/max_qty and reorder_point. pars and pars_day tables were sued instead for normalization purposes and for direct implementation
// TODO: may need a unique index/primary key on store_id, item_id (+ maybe day_of_week), or primary key on item_id and store_id
// export const storeParLevelsTable = pgTable(
//     'store_par_levels',
//     {
//         id: serial('id').primaryKey(),
//         item_id: integer('item_id')
//             .notNull()
//             .references(() => itemsTable.id, { onDelete: 'cascade' }),
//         store_id: integer('store_id').references(() => storesTable.id),
//         min_qty: decimal('min_qty', { precision: 10, scale: 2 }).notNull(), // Absolute minimum stock you want to have, Emergency buffer, should rarely hit this level
//         max_qty: decimal('max_qty', { precision: 10, scale: 2 }).notNull(),
//         reorder_point: decimal('reorder_point', { precision: 10, scale: 2 }), // Usually HIGHER than min_qty, Accounts for "lead time" (time between ordering and receiving)
//         // day_of_week: integer('day_of_week').notNull(), // (0-6, where 0 is Sunday)
//         changed_at: timestamp('changed_at', {
//             precision: 3,
//             withTimezone: true,
//         })
//             .notNull()
//             .defaultNow(),
//     },
//     (table) => {
//         return [
//             check('positive_min_qty', sql`${table.min_qty} >= 0`),
//             check('positive_max_qty', sql`${table.max_qty} >= 0`),
//             check('positive_reorder_point', sql`${table.reorder_point} >= 0`),
//         ];
//     }
// );

// Schedules table for scheduling cron jobs (schedule-type level) (if user-created cron jobs needed). TODO: MAY DELETE (duplicate prurpose essentially to inventory_schedule table)
export const schedulesTable = pgTable(
    'schedules',
    {
        id: serial('id').primaryKey(),
        name: varchar('name').notNull().unique(),
        description: text('description'),
        is_active: boolean('is_active').notNull().default(true),
        created_at: timestamp('created_at', {
            precision: 3,
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
        exec_time: timestamp('exec_time', { precision: 3, withTimezone: true }),
        days_of_week: integer('days_of_week').array().notNull(), // 0-6, where 0 is Sunday
        last_run: timestamp('last_run', { precision: 3, withTimezone: true }),
    },
    () => {
        return [
            pgPolicy('Enable inserting for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// Junction table for cron job scheduling (orders). TODO: MAY DELETE
export const order_item_schedulesTable = pgTable(
    'order_item_schedules',
    {
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
        schedule_id: integer('schedule_id')
            .notNull()
            .references(() => schedulesTable.id),
    },
    (table) => {
        return [
            // composite key
            primaryKey({ columns: [table.item_id, table.schedule_id] }),
            pgPolicy('Enable inserting for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable deleting for auth users only', {
                for: 'delete',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

// Junction table for cron job scheduling (stock). TODO: MAY DELETE
export const stock_item_schedulesTable = pgTable(
    'stock_item_schedules',
    {
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
        schedule_id: integer('schedule_id')
            .notNull()
            .references(() => schedulesTable.id),
    },
    (table) => {
        return [
            // composite key
            primaryKey({ columns: [table.item_id, table.schedule_id] }),
            pgPolicy('Enable inserting for auth users only', {
                for: 'insert',
                to: authenticatedRole,
                withCheck: sql`true`,
            }),
            pgPolicy('Enable updating for auth users only', {
                for: 'update',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
                withCheck: sql`true`,
            }),
            pgPolicy('Enable reading for auth users only', {
                for: 'select',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
            pgPolicy('Enable deleting for auth users only', {
                for: 'delete',
                to: authenticatedRole,
                using: sql`true`, // This allows all authenticated users to select all rows
            }),
        ];
    }
);

export type InsertItem = typeof itemsTable.$inferInsert;
export type SelectItem = typeof itemsTable.$inferSelect;
// export type UpdateItem = typeof itemsTable.$inferUpdate;

export type InsertStock = typeof stockTable.$inferInsert;
export type SelectStock = typeof stockTable.$inferSelect;
// export type UpdateStock = typeof stockTable.$inferUpdate;

export type InsertVendor = typeof vendorsTable.$inferInsert;
export type SelectVendor = typeof vendorsTable.$inferSelect;
// export type UpdateVendor = typeof vendorsTable.$inferUpdate;

export type InsertOrder = typeof ordersTable.$inferInsert;
export type SelectOrder = typeof ordersTable.$inferSelect;
// export type UpdateOrder = typeof ordersTable.$inferUpdate;

// export type InsertStoreOrder = typeof storeOrdersTable.$inferInsert;
// export type SelectStoreOrder = typeof storeOrdersTable.$inferSelect;
// export type UpdateStoreOrder = typeof storeOrdersTable.$inferUpdate;

export type InsertBakeryOrder = typeof bakeryOrdersTable.$inferInsert;
export type SelectBakeryOrder = typeof bakeryOrdersTable.$inferSelect;
// export type UpdateBakeryOrder = typeof bakeryOrdersTable.$inferUpdate;

export type InsertStoreBakeryOrder = typeof storeBakeryOrdersTable.$inferInsert;
export type SelectStoreBakeryOrder = typeof storeBakeryOrdersTable.$inferSelect;
// export type UpdateStoreBakeryOrder = typeof storeBakeryOrdersTable.$inferUpdate;

// export type InsertInventorySchedule = typeof inventorySchedule.$inferInsert;
// export type SelectInventorySchedule = typeof inventorySchedule.$inferSelect;
// export type UpdateInventorySchedule = typeof inventorySchedule.$inferUpdate;

export type InsertVendorSplit = typeof vendorSplitTable.$inferInsert;
export type SelectVendorSplit = typeof vendorSplitTable.$inferSelect;
// export type UpdateVendorSplit = typeof vendorSplitTable.$inferUpdate;
export type InsertHistory = typeof historyTable.$inferInsert;
export type SelectHistory = typeof historyTable.$inferSelect;
// export type UpdateHistory = typeof historyTable.$inferUpdate;
export type InsertStore = typeof storesTable.$inferInsert;
export type SelectStore = typeof storesTable.$inferSelect;
// export type UpdateStore = typeof storesTable.$inferUpdate;
export type InsertVendorItem = typeof vendorItemsTable.$inferInsert;
export type SelectVendorItem = typeof vendorItemsTable.$inferSelect;
// export type UpdateVendorItem = typeof vendorItemsTable.$inferUpdate;

// export type InsertStoreParLevels = typeof storeParLevelsTable.$inferInsert;
// export type SelectStoreParLevels = typeof storeParLevelsTable.$inferSelect;
// export type UpdateStoreParLevels = typeof storeParLevelsTable.$inferUpdate;

export type InsertPars = typeof parsTable.$inferInsert;
export type SelectPars = typeof parsTable.$inferSelect;
// export type UpdatePars = typeof parsTable.$inferUpdate;

// export type InsertParsDay = typeof parsDayTable.$inferInsert;
// export type SelectParsDay = typeof parsDayTable.$inferSelect;
// export type UpdateParsDay = typeof parsDayTable.$inferUpdate;

export type InsertSchedule = typeof schedulesTable.$inferInsert;
export type SelectSchedule = typeof schedulesTable.$inferSelect;
// export type UpdateSchedule = typeof schedulesTable.$inferUpdate;
export type InsertOrderItemSchedule =
    typeof order_item_schedulesTable.$inferInsert;
export type SelectOrderItemSchedule =
    typeof order_item_schedulesTable.$inferSelect;
// export type UpdateOrderItemSchedule = typeof order_item_schedulesTable.$inferUpdate;
export type InsertStockItemSchedule =
    typeof stock_item_schedulesTable.$inferInsert;
export type SelectStockItemSchedule =
    typeof stock_item_schedulesTable.$inferSelect;
// export type UpdateStockItemSchedule = typeof stock_item_schedulesTable.$inferUpdate;

/*
// Store-specific items table
export const storeItemsTable = pgTable(
    'store_items',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id), // name of item
        store_id: integer('store_id')
            .notNull()
            .references(() => storesTable.id), // specific store this item is for
        is_active: boolean('is_active').notNull().default(true), // whether item is active or not
        store_categ: varchar('store_categ', { length: 30 }).notNull(), // categories for store managers
        created_at: timestamp('created_at', {
            precision: 3,
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        {
            storeItemUnique: uniqueIndex('store_items_unique_idx').on(
                table.store_id,
                table.item_id
            ),
        },
        {
            storeCategoryCheck: check(
                'store_category_check',
                sql`${table.store_categ} IN ('FRONT', 'STOCKROOM', 'FRIDGE', 'GENERAL', 'BEANS&TEA')`
            ),
        },
    ]
);

// Menu of items for every store at Ava Roasteria. Core table. First items table created originally in project
export const itemsTable = pgTable(
    'items',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 100 }).notNull().unique(),
        barcode: varchar('barcode', { length: 100 }).unique(),
        store_id: integer('store_id')
            .notNull()
            .references(() => storesTable.id),
        vendor_id: integer('vendor_id')
            .notNull()
            .references(() => vendorsTable.id),
        raw_cost: decimal('raw_cost', { precision: 10, scale: 2 })
            .notNull()
            .default(sql`0.00`), // raw cost = orders.vendor_price
        unit: varchar('unit', { length: 30 }),
        unit_qty: decimal('unit_qty', { precision: 10, scale: 2 }),
        active: boolean('active').notNull().default(true),
        acc_categ: varchar('acc_category', { length: 10 })
            .notNull()
            .default('NONE'), // accounting category for accountant
        main_categ: varchar('main_categ', { length: 30 }).notNull(), // main item category
        sub_categ: varchar('sub_categ', { length: 30 }), // sub item category
        location_categ: varchar('location_categ', { length: 30 }).notNull(), // categories for store managers
        description: text('description'),
        created_at: timestamp('created_at').notNull().defaultNow(),
        // category: varchar('category', { length: 100 }),
        // order_days: pgText('order_days').array(9),
        // own_brand: boolean('own_brand').notNull(),
    },
    (table) => [
        {
            checkConstraint: check(
                'location_check',
                sql`${table.location_categ} IN ('FRONT', 'STOCKROOM', 'FRIDGE', 'GENERAL', 'BEANS&TEA')`
            ),
        },
        {
            checkConstraint: check(
                'acc_category_check',
                sql`${table.acc_categ} IN ('CCP', 'CTC', 'NONE')`
            ),
        },
        {
            checkConstraint: check(
                'positive_raw_cost',
                sql`${table.raw_cost} >= 0`
            ),
        },
        {
            checkConstraint: check(
                'positive_unit_qty',
                sql`${table.unit_qty} >= 0`
            ),
        },
    ]
);
*/
