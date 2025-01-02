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

const statusEnum = pgEnum('status', [
    'DUE',
    'SUBMITTED',
    'ORDERED',
    'FULFILLED',
    'CANCELLED',
]);

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
        cost: decimal('cost', { precision: 10, scale: 2 })
            .notNull()
            .default(sql`0.00`),
        unit: varchar('unit', { length: 30 }),
        unit_qty: decimal('unit_qty', { precision: 10, scale: 2 }),
        active: boolean('active').notNull().default(true),
        acc_category: varchar('acc_category', { length: 30 }).notNull(),
        food_categories: varchar('food_categories', { length: 30 })
            .array()
            .notNull(),
        location: varchar('location', { length: 30 }).notNull(),
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
                sql`${table.location} IN ('Front', 'Stockroom', 'Fridge', 'General', 'Beans&Tea')`
            ),
        },
        {
            checkConstraint: check('positive_cost', sql`${table.cost} >= 0`),
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
        quantity: decimal('quantity', { precision: 10, scale: 2 })
            .notNull()
            .default(sql`0.00`),
        delivered: decimal('delivered', { precision: 10, scale: 2 }),
        order_date: timestamp('order_date').notNull().defaultNow(),
        delivered_date: timestamp('delivery_date'),

        vendor_id: integer('vendor_id')
            .notNull()
            .references(() => vendorsTable.id),
        vendor_price: decimal('vendor_price', {
            precision: 10,
            scale: 2,
        }).default(sql`0.00`),
        status: statusEnum().notNull().default('DUE'),
        // status: varchar('status', { length: 15 }).notNull().default('DUE'),
        is_par_order: boolean('is_par_order').notNull().default(false),
        comments: text('comments'),
        created_at: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [
        {
            checkConstraint: check(
                'status_check',
                sql`${table.status} IN ('DUE', 'SUBMITTED', 'ORDERED', 'FULFILLED', 'CANCELLED')`
            ),
        },
        {
            checkConstraint: check('positive_qty', sql`${table.quantity} >= 0`),
        },
        {
            checkConstraint: check(
                'positive_delivered',
                sql`${table.delivered} >= 0`
            ),
        },
        {
            checkConstraint: check(
                'positive_vendor_price',
                sql`${table.vendor_price} >= 0`
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
