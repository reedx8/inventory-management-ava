import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { google } from 'googleapis';
import { MilkBreadOrder } from '@/app/(main)/orders/types';

const milkKruseSSId = '1cLQ-Q8ATSnlEprd5mJ8bbaYlISPWc5Ppt6O7n9WcH-Q';
const milkOrencoSSId = '19tkyd3jtLH0tCNrMn6C4SDr9q_7o0fT_fL5qdnvUFbE';
const milkHallSSId = '1nAS5DRd8kpm0kIWO-9G04ImOrInzXIw1zKQFWWoGWhc';
const milkProgressSSId = '1-ieZ-AR7tB6avTKX776t6PRyGzCoJVFcSMvQS9SSsbQ';
const breadSSId = '1SBGJ_k7zW6KF3GVfCjEbiZ42vjRHsO0t9liqZ4-J6W4';

export async function POST(request: NextRequest) {
    const requestData = await request.json();
    const { data, activeCateg, storeId } = requestData;

    if (!data || !activeCateg || !storeId) {
        return NextResponse.json(
            {
                error: 'POST api/v1/send-to-gsheet requires data, activeCateg, and storeId',
            },
            { status: 400 }
        );
    }

    if (
        activeCateg.toUpperCase() !== 'MILK' &&
        activeCateg.toUpperCase() !== 'BREAD'
    ) {
        return NextResponse.json(
            { error: 'Invalid activeCateg (MILK or BREAD only)' },
            { status: 400 }
        );
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
    const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    try {
        if (activeCateg.toUpperCase() === 'MILK') {
            // Prepare data as a 2D array
            const values = data.map((order: MilkBreadOrder) => [
                order.name,
                order.cpu,
                order.order_qty,
                order.item_code,
            ]);

            let milkSpreadsheetId: string;
            if (storeId === 1) {
                milkSpreadsheetId = milkHallSSId;
            } else if (storeId === 2) {
                milkSpreadsheetId = milkProgressSSId;
            } else if (storeId === 3) {
                milkSpreadsheetId = milkKruseSSId;
            } else if (storeId === 4) {
                milkSpreadsheetId = milkOrencoSSId;
            } else {
                return NextResponse.json(
                    { error: 'Invalid store ID' },
                    { status: 400 }
                );
            }

            const gsheetResponse = await sheets.spreadsheets.values.batchUpdate(
                {
                    spreadsheetId: milkSpreadsheetId,
                    requestBody: {
                        data: [
                            {
                                range: 'Sheet1!D8:E8',
                                values: [
                                    [
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A85'
                                        )?.[1] || 0,
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A85'
                                        )?.[2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!D9:E9',
                                values: [
                                    [
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A120'
                                        )?.[1] || 0,
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A120'
                                        )?.[2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!D10:E10',
                                values: [
                                    [
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A153'
                                        )?.[1] || 0,
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A153'
                                        )?.[2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!D11:E11',
                                values: [
                                    [
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A25'
                                        )?.[1] || 0,
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A25'
                                        )?.[2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!D12:E12',
                                values: [
                                    [
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A16'
                                        )?.[1] || 0,
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A16'
                                        )?.[2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!D13:E13', // eggnog, which can be deactivated, hence 0 here
                                values: [
                                    [
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A170'
                                        )?.[1] || 0,
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A170'
                                        )?.[2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!D15:E15',
                                values: [
                                    [
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === '64997'
                                        )?.[1] || 0,
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === '64997'
                                        )?.[2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!D16:E16',
                                values: [
                                    [
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === '65001'
                                        )?.[1] || 0,
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === '65001'
                                        )?.[2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!D17:E17',
                                values: [
                                    [
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === '65028'
                                        )?.[1] || 0,
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === '65028'
                                        )?.[2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!D18:E18',
                                values: [
                                    [
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === '65571'
                                        )?.[1] || 0,
                                        values.find(
                                            (v: (string | number)[]) =>
                                                v[3] === '65571'
                                        )?.[2] || 0,
                                    ],
                                ],
                            },
                        ],
                        valueInputOption: 'RAW',
                    },
                }
            );

            if (gsheetResponse.status !== 200) {
                throw new Error('Failed to send to Google Sheet');
            }

            return NextResponse.json(
                { message: 'Successfully sent to Google Sheet' },
                { status: 200 }
            );
        } else if (activeCateg.toUpperCase() === 'BREAD') {
            // output stock, cpu, and par to Grand Central SS

            // data already filtered for specific store
            let values = data.map((order: MilkBreadOrder) => [
                order.cpu,
                order.stock_count,
                order.item_code,
                order.par,
            ]);

            // sort by item code alphabetically
            values = values.sort(
                (a: (string | number)[], b: (string | number)[]) =>
                    a[2].toString().localeCompare(b[2].toString())
            );

            let stockRange: string;
            let cpuRange: string;
            let parRange: string;
            if (storeId === 1) {
                // hall
                stockRange = 'Blank Order Sheet !D4:D6';
                cpuRange = 'Blank Order Sheet !C4:C6';
                parRange = 'Blank Order Sheet !J4:J6';
            } else if (storeId === 2) {
                // progress
                stockRange = 'Blank Order Sheet !D10:D12';
                cpuRange = 'Blank Order Sheet !C10:C12';
                parRange = 'Blank Order Sheet !J10:J12';
            } else if (storeId === 3) {
                // kruse
                stockRange = 'Blank Order Sheet !D16:D18';
                cpuRange = 'Blank Order Sheet !C16:C18';
                parRange = 'Blank Order Sheet !J16:J18';
            } else if (storeId === 4) {
                // orenco
                stockRange = 'Blank Order Sheet !D22:D24';
                cpuRange = 'Blank Order Sheet !C22:C24';
                parRange = 'Blank Order Sheet !J22:J24';
            } else {
                return NextResponse.json(
                    { error: 'Invalid store ID' },
                    { status: 400 }
                );
            }

            const gsheetResponse = await sheets.spreadsheets.values.batchUpdate(
                {
                    spreadsheetId: breadSSId,
                    requestBody: {
                        data: [
                            {
                                range: stockRange,
                                values: values.map((v: (string | number)[]) => [
                                    v[1] ?? 0,
                                ]),
                            },
                            {
                                range: cpuRange,
                                values: values.map((v: (string | number)[]) => [
                                    v[0] ?? 0,
                                ]),
                            },
                            {
                                range: parRange,
                                values: values.map((v: (string | number)[]) => [
                                    v[3] ?? 0,
                                ]),
                            },
                        ],
                        valueInputOption: 'RAW',
                    },
                }
            );

            if (gsheetResponse.status !== 200) {
                throw new Error('Failed to send to Google Sheet');
            }

            return NextResponse.json(
                { message: 'Successfully sent to Google Sheet' },
                { status: 200 }
            );
        }
    } catch (error) {
        // error will return [object object], so we need to check if it's an instance of Error
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
            if (errorMessage.length > 100) {
                errorMessage = errorMessage.slice(0, 100) + '...';
            }
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
