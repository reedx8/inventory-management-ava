import {
    integer,
    decimal,
    boolean,
    pgTable,
    serial,
    text,
    varchar,
    timestamp,
    text as pgText,
    time,
    primaryKey,
    check,
    pgEnum,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { create } from 'domain';
import exp from 'constants';
// import exp from 'constants';

// For orders.status
const statusEnum = pgEnum('status', [
    'DUE',
    'SUBMITTED',
    'ORDERED',
    'DELIVERED',
    'CANCELLED',
]);
export const status = statusEnum;

// Table of general/internal items Ava Roasteria uses by default, containing operational necessities
export const itemsTable = pgTable(
    'items',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 100 }).notNull().unique(), // General/internal name of item + size of item (if any). Avoid using brand name, due to vendor_items table, but its ok if you do
        vendor_id: integer('vendor_id')
            .notNull()
            .references(() => vendorsTable.id), // the vendor that supplies this item
        qty_per_order: varchar('qty_per_order', { length: 50 }), // Items unit from its primary vendor (or bakery), not size of order (eg XL, or Full/Half, etc). These can be vendor locked/dependant (eg 1 gal, 12/32oz, QUART, 1G, .5G, 2/5#AVG, 1200/4.5 GM, etc). Just change in csv if vendor changed-to requires different unit
        // unit_qty: decimal('unit_qty', { precision: 10, scale: 2 }), // unit quantity of item
        list_price: decimal('list_price', { precision: 10, scale: 2 })
            .notNull()
            .default(sql`0.00`), // Vendor's stated/expected list price for item, before receiving invoice. list_price -> orders.final_price, and eg list_price * orders.qty_ordered.
        invoice_categ: varchar('invoice_categ', { length: 30 })
            .notNull()
            .default('none'), // accounting category for invoicing
        main_categ: varchar('main_categ', { length: 30 }), // main food category (US food groups + custom groups)
        sub_categ: varchar('sub_categ', { length: 30 }), // food sub category
        requires_inventory: boolean('requires_inventory').notNull(), // whether item requires inventory
        requires_order: boolean('requires_order').notNull(), // whether item requires order
        item_description: text('item_description'), // internal description of item
        vendor_description: text('vendor_description'), // primary vendor description of item. SEE MASTER ORDER SHEET - SYSCO TABS
        created_at: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [
        {
            invoiceCategoryCheck: check(
                'invoice_categ_check',
                sql`${table.invoice_categ} IN ('sandwich', 'pastry', 'food', 'cooler&extras', 'beverage', 'misc/bathroom', 'chocolate&tea', 'coffee', 'none')`
            ),
        },
        {
            positiveRawCostCheck: check(
                'positive_list_price',
                sql`${table.list_price} >= 0`
            ),
        },
    ]
);

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
        active: boolean('active').notNull().default(true), // whether item is active or not
        store_categ: varchar('store_categ', { length: 30 }).notNull(), // categories for store managers
        // location_categ: varchar('location', { length: 30 }).notNull(), // categories for store managers
        created_at: timestamp('created_at').notNull().defaultNow(),
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

/*
// Menu of items for every store at Ava Roasteria. Core table.
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

// Record of inventory counts from every store
export const inventoryTable = pgTable(
    'inventory',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => storeItemsTable.id),
        // store_id: integer('store_id').notNull(),
        count: decimal('count', { precision: 10, scale: 2 }),
        date_of_count: timestamp('date_of_count').notNull(),
        created_at: timestamp('created_at').notNull().defaultNow(),
        closed_count: decimal('closed_count', {
            precision: 10,
            scale: 2,
        }).default(sql`0.00`),
        sealed_count: decimal('sealed_count', {
            precision: 10,
            scale: 2,
        }).default(sql`0.00`),
        open_items_weight: decimal('open_items_weight', {
            precision: 10,
            scale: 2,
        }).default(sql`0.00`), // oz
        expired_count: decimal('expired_count', {
            precision: 10,
            scale: 2,
        }).default(sql`0.00`),
        reused_count: decimal('reused_count', {
            precision: 10,
            scale: 2,
        }).default(sql`0.00`),
    },
    (table) => [
        {
            positiveCountCheck: check(
                'positive_count',
                sql`${table.count} >= 0`
            ),
        },
        {
            positiveClosedCountCheck: check(
                'positive_closed_count',
                sql`${table.closed_count} >= 0`
            ),
        },
        {
            positiveSealedCountCheck: check(
                'positive_sealed_count',
                sql`${table.sealed_count} >= 0`
            ),
        },
        {
            positiveOpenItemsWeightCheck: check(
                'open_items_weight_check',
                sql`${table.open_items_weight} >= 0`
            ),
        },
        {
            positiveExpiredCountCheck: check(
                'expired_count_check',
                sql`${table.expired_count} >= 0`
            ),
        },
        {
            positiveReusedCountCheck: check(
                'reused_count_check',
                sql`${table.reused_count} >= 0`
            ),
        },
    ]
);

// List of vendors that stores can order from. Lookup table.
export const vendorsTable = pgTable('vendors', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(), // vendors name (eg Sysco, Winco, Restaurant Depot, McDonalds, Chef Store, Costco, Grand Central, Petes Milk, and ava design?)
    is_exclusive_supplier: boolean('is_exclusive_supplier')
        .notNull()
        .default(false), // If in Exclusive Supply Agreement with vendor, eg Sysco atm (non-ccp items if false. ccp = cost controlled product)
    email: varchar('email', { length: 100 }), // email for orders (if any)
    phone: varchar('phone', { length: 20 }), // phone number for orders (if any)
    website: varchar('website', { length: 200 }), // website for orders (if any)
    logo: varchar('logo', { length: 200 }),
    agreement_start_date: timestamp('agreement_start_date'),
    agreement_end_date: timestamp('agreement_end_date'),
});

// History of item orders for every store, serving as a record of truth for orders.
// Each record maintains a complete snapshot of how the item was ordered at every store.
export const ordersTable = pgTable(
    'orders',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => storeItemsTable.id),
        qty_submitted: decimal('qty_submitted', { precision: 10, scale: 2 }), // quantity submitted/requested from store managers
        qty_ordered: decimal('qty_ordered', {
            precision: 10,
            scale: 2,
        }), // quantity ordered from vendor by kojo/jelena, qty ordered based on current cash flow or current vendor supply
        qty_delivered: decimal('qty_delivered', { precision: 10, scale: 2 }), // quantity actually delivered/received to store? I dont think this will be reliably updated
        qty_per_order: decimal('qty_per_order', { precision: 10, scale: 2 }), // quantity per order, copied from orders.qty_per_order (unless changed at time of vendor order)
        is_replacement_order: boolean('is_replacement_order')
            .notNull()
            .default(false), // If partial order when ordering from another vendor when vendor invent. insufficient, this will be true. Only applies to CCP items?
        vendor_id: integer('vendor_id')
            .notNull()
            .references(() => vendorsTable.id), // vendor that supplied this item
        list_price: decimal('list_price', {
            precision: 10,
            scale: 2,
        }).notNull(), // Expected price of item at time of order. default value is items.list_price
        final_price: decimal('final_price', {
            precision: 10,
            scale: 2,
        }).notNull(), // final invoiced amount for item, default value = items.list_price
        adj_price: decimal('adj_price', {
            precision: 10,
            scale: 2,
        }), // average price of item across stores, edge case for ccp items?, to report to stores
        status: statusEnum('status').notNull().default('DUE'), // status of item in the order chain (eg DUE, SUBMITTED, ORDERED, DELIVERED, CANCELLED)
        is_par_order: boolean('is_par_order').notNull().default(false), // but par values are inaccurate/not used currently
        comments: text('comments'), // any comments for order
        submitted_date: timestamp('submitted_date'), // date order submitted from store managers
        order_date: timestamp('order_date'), // date order placed upon kojo/jelena submit
        // delivered_date: timestamp('delivery_date'), // I dont think this will be reliably updated
        created_at: timestamp('created_at').notNull().defaultNow(), // date order originally created
    },
    (table) => [
        {
            posQtySubmittedCheck: check(
                'positive_qty_submitted',
                sql`${table.qty_submitted} >= 0`
            ),
        },
        {
            posQtyDeliveredCheck: check(
                'positive_qty_delivered',
                sql`${table.qty_delivered} >= 0`
            ),
        },
        {
            posQtyOrderedCheck: check(
                'positive_qty_ordered',
                sql`${table.qty_ordered} >= 0`
            ),
        },
        {
            posQtyPerOrderCheck: check(
                'positive_qty_per_order',
                sql`${table.qty_per_order} >= 0`
            ),
        },
        {
            posListPriceCheck: check(
                'positive_list_price',
                sql`${table.list_price} >= 0`
            ),
        },
        {
            posFinalPriceCheck: check(
                'positive_final_price',
                sql`${table.final_price} >= 0`
            ),
        },
        {
            posAdjPriceCheck: check(
                'positive_adj_price',
                sql`${table.adj_price} >= 0`
            ),
        },
    ]
);

// List of stores at Ava Roasteria. Lookup table.
export const storesTable = pgTable(
    'stores',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 30 }).notNull().unique(), // name of store (eg Hall, Barrows, etc)
        weekly_budget: decimal('weekly_budget', {
            precision: 10,
            scale: 2,
        }).default(sql`0.00`), // weekly budget for store
        logo: varchar('logo', { length: 200 }),
    },
    (table) => [
        {
            checkConstraint: check(
                'positive_weekly_budget',
                sql`${table.weekly_budget} >= 0`
            ),
        },
    ]
);

// Record table for tracking changes to records across tables
export const historyTable = pgTable('history', {
    id: serial('id').primaryKey(),
    table_name: varchar('table_name', { length: 50 }).notNull(),
    record_id: integer('record_id').notNull(),
    field_name: varchar('field_name', { length: 50 }).notNull(),
    old_value: decimal('old_value', { precision: 10, scale: 2 }),
    new_value: decimal('new_value', { precision: 10, scale: 2 }),
    changed_at: timestamp('changed_at').notNull().defaultNow(),
});

// Vendor-specific item details when neccessary, for edge cases where vendors have different names or details for the same general/internal item we use
// Primary Use: For automating the generating/emailing of excel files for/to vendors that need exact details
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
        item_name: varchar('item_name', { length: 100 }), // exact name of item vendor needs/uses
        item_code: varchar('item_code', { length: 50 }), // vendor specific item code/number (SUPC for Sysco, Petes Milk, Grand Central, etc)
        brand_code: varchar('item_brand', { length: 100 }), // brand acronym/code of item from vendor (eg AREZIMP or WHLFCLS from Sysco vendor, etc)
        item_description: text('item_description'), // vendor description of item. SEE MASTER ORDER SHEET - SYSCO TABS
        is_primary: boolean('is_primary').notNull().default(false), // whether this is the primary item for this vendor
        created_at: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [
        {
            // can have multiple records with the same vendor and general item but different brands/names
            // Remove item_name if you want 1 item_name per vendor/general item (but using is_primary will alleviate any problems?)
            vendorItemUnique: uniqueIndex('vendor_item_unique_idx').on(
                table.vendor_id,
                table.item_id,
                table.item_name
            ),
        },
    ]
);

// Pars table for tracking daily/weekly par values, ie par = replacement level/value
export const parsTable = pgTable(
    'pars',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => storeItemsTable.id, { onDelete: 'cascade' }),
        value: decimal('value', { precision: 10, scale: 2 }).notNull(),
        day_of_week: integer('day_of_week').notNull(), // (0-6, where 0 is Sunday)
        changed_at: timestamp('changed_at').notNull().defaultNow(),
    },
    (table) => [
        {
            checkConstraint: check('positive_value', sql`${table.value} >= 0`),
        },
    ]
);

// Schedules table for scheduling cron jobs
export const schedulesTable = pgTable('schedules', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 30 }).notNull().unique(),
    description: text('description'),
    active: boolean('active').notNull().default(true),
    created_at: timestamp('created_at').notNull().defaultNow(),
    exec_time: time('exec_time')
        .notNull()
        .default(sql`'00:00:00'`),
    days_of_week: integer('days_of_week').array().notNull(), // 0-6, where 0 is Sunday
    last_run: timestamp('last_run'),
});

// Junction table
export const order_item_schedulesTable = pgTable(
    'order_item_schedules',
    {
        item_id: integer('item_id').references(() => storeItemsTable.id),
        schedule_id: integer('schedule_id').references(() => schedulesTable.id),
    },
    (table) => {
        return [
            {
                // composite key
                pk: primaryKey({ columns: [table.item_id, table.schedule_id] }),
            },
        ];
    }
);

// Junction table
export const inv_item_schedulesTable = pgTable(
    'inv_item_schedules',
    {
        item_id: integer('item_id').references(() => storeItemsTable.id),
        schedule_id: integer('schedule_id').references(() => schedulesTable.id),
    },
    (table) => {
        return [
            {
                // composite key
                pk: primaryKey({ columns: [table.item_id, table.schedule_id] }),
            },
        ];
    }
);

export type InsertItem = typeof itemsTable.$inferInsert;
export type SelectItem = typeof itemsTable.$inferSelect;
// export type UpdateItem = typeof itemsTable.$inferUpdate;
export type InsertStoreItem = typeof storeItemsTable.$inferInsert;
export type SelectStoreItem = typeof storeItemsTable.$inferSelect;
// export type UpdateStoreItem = typeof storeItemsTable.$inferUpdate;
export type InsertInventory = typeof inventoryTable.$inferInsert;
export type SelectInventory = typeof inventoryTable.$inferSelect;
// export type UpdateInventory = typeof inventoryTable.$inferUpdate;
export type InsertVendor = typeof vendorsTable.$inferInsert;
export type SelectVendor = typeof vendorsTable.$inferSelect;
// export type UpdateVendor = typeof vendorsTable.$inferUpdate;
export type InsertOrder = typeof ordersTable.$inferInsert;
export type SelectOrder = typeof ordersTable.$inferSelect;
// export type UpdateOrder = typeof ordersTable.$inferUpdate;
export type InsertStore = typeof storesTable.$inferInsert;
export type SelectStore = typeof storesTable.$inferSelect;
// export type UpdateStore = typeof storesTable.$inferUpdate;
export type InsertVendorItem = typeof vendorItemsTable.$inferInsert;
export type SelectVendorItem = typeof vendorItemsTable.$inferSelect;
// export type UpdateVendorItem = typeof vendorItemsTable.$inferUpdate;
export type InsertPars = typeof parsTable.$inferInsert;
export type SelectPars = typeof parsTable.$inferSelect;
// export type UpdatePars = typeof parsTable.$inferUpdate;
export type InsertSchedule = typeof schedulesTable.$inferInsert;
export type SelectSchedule = typeof schedulesTable.$inferSelect;
// export type UpdateSchedule = typeof schedulesTable.$inferUpdate;
export type InsertOrderItemSchedule =
    typeof order_item_schedulesTable.$inferInsert;
export type SelectOrderItemSchedule =
    typeof order_item_schedulesTable.$inferSelect;
// export type UpdateOrderItemSchedule = typeof order_item_schedulesTable.$inferUpdate;
export type InsertInvItemSchedule = typeof inv_item_schedulesTable.$inferInsert;
export type SelectInvItemSchedule = typeof inv_item_schedulesTable.$inferSelect;
// export type UpdateInvItemSchedule = typeof inv_item_schedulesTable.$inferUpdate;
