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

/*
// Core items table with shared properties across all stores
export const itemsTable = pgTable(
    'items',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 100 }).notNull(),
        barcode: varchar('barcode', { length: 100 }).unique(),
        raw_cost: decimal('raw_cost', { precision: 10, scale: 2 })
            .notNull()
            .default(sql`0.00`),
        acc_categ: varchar('acc_category', { length: 10 })
            .notNull()
            .default('NONE'),
        main_categ: varchar('main_categ', { length: 30 }).notNull(),
        sub_categ: varchar('sub_categ', { length: 30 }),
        description: text('description'),
        created_at: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [
        {
            accCategoryCheck: check(
                'acc_category_check',
                sql`${table.acc_categ} IN ('CCP', 'CTC', 'NONE')`
            ),
        },
        {
            posRawCostCheck: check('positive_raw_cost', sql`${table.raw_cost} >= 0`),
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
            .references(() => itemsTable.id),
        store_id: integer('store_id')
            .notNull()
            .references(() => storesTable.id),
        vendor_id: integer('vendor_id')
            .notNull()
            .references(() => vendorsTable.id),
        unit: varchar('unit', { length: 30 }),
        unit_qty: decimal('unit_qty', { precision: 10, scale: 2 }),
        active: boolean('active').notNull().default(true),
        location_categ: varchar('location', { length: 30 }).notNull(),
        created_at: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [
        {
            storeItemUnique: uniqueIndex("store_items_unique_idx").on(table.store_id, table.item_id),
        },
        {
            locationCheck: check(
                'location_check',
                sql`${table.location_categ} IN ('FRONT', 'STOCKROOM', 'FRIDGE', 'GENERAL', 'BEANS&TEA')`
            ),
        },
        {
            positiveUnitQtyCheck: check(
                'positive_unit_qty',
                sql`${table.unit_qty} >= 0`
            ),
        },
    ]
);

*/

// Menu of items for every store at Ava Roasteria. Core table.
export const itemsTable = pgTable(
    'items',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 100 }).notNull(),
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

// Record of inventory counts from every store
export const inventoryTable = pgTable(
    'inventory',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
        // store_id: integer('store_id').notNull(),
        count: decimal('count', { precision: 10, scale: 2 })
            .notNull()
            .default(sql`0.00`),
        date_of_count: timestamp('date_of_count').notNull().defaultNow(),
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
            checkConstraint: check('positive_count', sql`${table.count} >= 0`),
        },
        {
            checkConstraint: check(
                'positive_closed_count',
                sql`${table.closed_count} >= 0`
            ),
        },
        {
            checkConstraint: check(
                'positive_sealed_count',
                sql`${table.sealed_count} >= 0`
            ),
        },
        {
            checkConstraint: check(
                'open_items_weight_check',
                sql`${table.open_items_weight} >= 0`
            ),
        },
        {
            checkConstraint: check(
                'expired_count_check',
                sql`${table.expired_count} >= 0`
            ),
        },
        {
            checkConstraint: check(
                'reused_count_check',
                sql`${table.reused_count} >= 0`
            ),
        },
    ]
);

// List of vendors that stores can order from. Lookup table.
export const vendorsTable = pgTable('vendors', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    email: varchar('email', { length: 100 }),
    phone: varchar('phone', { length: 20 }),
    website: varchar('website', { length: 200 }),
    logo: varchar('logo', { length: 200 }),
});

// Record of item orders for every store
export const ordersTable = pgTable(
    'orders',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
        qty_submitted: decimal('qty_submitted', { precision: 10, scale: 2 }), // quantity submitted/requested from store managers
        qty_ordered: decimal('qty_ordered', {
            precision: 10,
            scale: 2,
        }).notNull(), // quantity ordered from vendor by kojo/jelena, qty ordered based on current cash flow or current vendor supply
        qty_delivered: decimal('qty_delivered', { precision: 10, scale: 2 }), // quantity actually delivered/received to store? I dont think this will be reliably updated
        is_replacement_order: boolean('is_replacement_order')
            .notNull()
            .default(false), // If partial order when ordering from another vendor when vendor invent. insufficient, this will be true. Only applies to CCP items?
        vendor_id: integer('vendor_id')
            .notNull()
            .references(() => vendorsTable.id),
        vendor_price: decimal('vendor_price', {
            precision: 10,
            scale: 2,
        }), // vendor/order price at time of order, default value = items.raw_cost
        adj_price: decimal('adj_price', {
            precision: 10,
            scale: 2,
        }), // average price of item across stores, edge case for ccp items
        status: statusEnum('status').notNull().default('DUE'),
        is_par_order: boolean('is_par_order').notNull().default(false), // but par values are inaccurate/not used currently
        comments: text('comments'),
        submitted_date: timestamp('submitted_date'), // date order submitted from store managers
        order_date: timestamp('order_date'), // date order placed upon kojo/jelena submit
        // delivered_date: timestamp('delivery_date'), // I dont think this will be reliably updated
        created_at: timestamp('created_at').notNull().defaultNow(), // date order originally created
    },
    (table) => [
        {
            statusCheck: check(
                'status_check',
                sql`${table.status} IN ('DUE', 'SUBMITTED', 'ORDERED', 'FULFILLED', 'CANCELLED')`
            ),
        },
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
            posVendorPriceCheck: check(
                'positive_vendor_price',
                sql`${table.vendor_price} >= 0`
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
        name: varchar('name', { length: 30 }).notNull().unique(),
        budget: decimal('budget', { precision: 10, scale: 2 }).default(
            sql`0.00`
        ),
        logo: varchar('logo', { length: 200 }),
    },
    (table) => [
        {
            checkConstraint: check(
                'positive_budget',
                sql`${table.budget} >= 0`
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

// Pars table for tracking daily/weekly par values
export const parsTable = pgTable(
    'pars',
    {
        id: serial('id').primaryKey(),
        item_id: integer('item_id')
            .notNull()
            .references(() => itemsTable.id),
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
        item_id: integer('item_id').references(() => itemsTable.id),
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
        item_id: integer('item_id').references(() => itemsTable.id),
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
