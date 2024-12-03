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
} from 'drizzle-orm/pg-core';
// import exp from 'constants';

export const itemsTable = pgTable('items', {
    id: serial('id').primaryKey(),
    barcode: varchar('barcode', { length: 100 }).unique(),
    name: varchar('name', { length: 100 }).notNull(),
    store_id: integer('store_id').notNull(),
    cost: decimal('cost', { precision: 10, scale: 2 }).notNull(),
    unit: varchar('unit', { length: 30 }).notNull(),
    unit_qty: decimal('unit_qty', { precision: 10, scale: 2 })
        .notNull()
        .default('1.00'),
    active: boolean('active').notNull().default(true),
    order_days: pgText('order_days').array(9),
    own_brand: boolean('own_brand').notNull(),
    category: varchar('category', { length: 100 }),
    description: text('description'),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export const inventoryTable = pgTable('inventory', {
    id: serial('id').primaryKey(),
    item_id: integer('item_id').notNull(),
    // store_id: integer('store_id').notNull(),
    count: decimal('qty', { precision: 10, scale: 2 }).notNull(),
    date_of_count: timestamp('date_of_count').notNull().defaultNow(),
    closed_count: decimal('closed_count', { precision: 10, scale: 2 }),
    sealed_count: decimal('sealed_count', { precision: 10, scale: 2 }),
    open_items_weight: decimal('open_items_weight', {
        precision: 10,
        scale: 2,
    }), // oz
    expired_count: decimal('expired_count', { precision: 10, scale: 2 }),
    reused_count: decimal('reused_count', { precision: 10, scale: 2 }),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export const vendorsTable = pgTable('vendors', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }),
    phone: varchar('phone', { length: 100 }),
    website: varchar('website', { length: 100 }),
    logo: varchar('logo', { length: 100 }),
});

export const ordersTable = pgTable('orders', {
    id: serial('id').primaryKey(),
    item_id: integer('item_id').notNull(),
    quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
    delivered: decimal('delivered', { precision: 10, scale: 2 }),
    order_date: timestamp('order_date').notNull().defaultNow(),
    delivered_date: timestamp('delivery_date'),

    vendor_id: integer('vendor_id').notNull(),
    vendor_price: decimal('vendor_price', { precision: 10, scale: 2 }),
    status: varchar('status', { length: 100 }).notNull().default('open'),
    comments: text('comments'),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export const storesTable = pgTable('stores', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    budget: decimal('budget', { precision: 10, scale: 2 }),
    logo: varchar('logo', { length: 100 }),
});

export const historyTable = pgTable('history', {
    id: serial('id').primaryKey(),
    table_name: varchar('table_name', { length: 50 }).notNull(),
    record_id: integer('record_id').notNull(),
    field_name: varchar('field_name', { length: 50 }).notNull(),
    old_value: decimal('old_value', { precision: 10, scale: 2 }),
    new_value: decimal('new_value', { precision: 10, scale: 2 }),
    changed_at: timestamp('changed_at').notNull().defaultNow(),
});

export const parsTable = pgTable('pars', {
    id: serial('id').primaryKey(),
    item_id: integer('item_id').notNull(),
    value: decimal('value', { precision: 10, scale: 2 }),
    day_of_week: varchar('day_of_week', { length: 9 }),
    changed_at: timestamp('changed_at').notNull().defaultNow(),
});

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
