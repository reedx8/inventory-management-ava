import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { google } from 'googleapis';
import { MilkBreadOrder } from '@/app/(main)/orders/types';

const milkKruseSSId = '1cLQ-Q8ATSnlEprd5mJ8bbaYlISPWc5Ppt6O7n9WcH-Q';

export async function POST(request: NextRequest) {
    const requestData = await request.json();
    const { data, activeCateg, storeId } = requestData;

    // TODO; check auth here

    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
    const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare your data as a 2D array
    const values = data.map((order: MilkBreadOrder) => [
        order.name,
        order.cpu,
        order.order_qty,
        order.item_code,
    ]);

    let milkSpreadsheetId: string;

    // if (storeId === 2) {
    milkSpreadsheetId = milkKruseSSId;
    // }

    try {
        if (activeCateg === 'MILK') {
            const gsheetResponse = await sheets.spreadsheets.values.batchUpdate(
                {
                    spreadsheetId: milkSpreadsheetId,
                    requestBody: {
                        data: [
                            {
                                range: 'Sheet1!E8',
                                values: [
                                    [
                                        values.filter(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A85'
                                        )[0][2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!E9',
                                values: [
                                    [
                                        values.filter(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A120'
                                        )[0][2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!E10',
                                values: [
                                    [
                                        values.filter(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A153'
                                        )[0][2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!E11',
                                values: [
                                    [
                                        values.filter(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A25'
                                        )[0][2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!E12',
                                values: [
                                    [
                                        values.filter(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A16'
                                        )[0][2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!E13', // eggnog, which can be deactivated, hence 0 here
                                values: [
                                    [
                                        values.filter(
                                            (v: (string | number)[]) =>
                                                v[3] === 'A170'
                                        )[0][2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!E15',
                                values: [
                                    [
                                        values.filter(
                                            (v: (string | number)[]) =>
                                                v[3] === '64997'
                                        )[0][2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!E16',
                                values: [
                                    [
                                        values.filter(
                                            (v: (string | number)[]) =>
                                                v[3] === '65001'
                                        )[0][2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!E17',
                                values: [
                                    [
                                        values.filter(
                                            (v: (string | number)[]) =>
                                                v[3] === '65028'
                                        )[0][2] || 0,
                                    ],
                                ],
                            },
                            {
                                range: 'Sheet1!E18',
                                values: [
                                    [
                                        values.filter(
                                            (v: (string | number)[]) =>
                                                v[3] === '65571'
                                        )[0][2] || 0,
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

            // for (const v of values) {
            //     switch (
            //         v[3] // v[3] is order.item_code
            //     ) {
            //         case 'A85':
            //             await sheets.spreadsheets.values.update({
            //                 spreadsheetId: milkSpreadsheetId,
            //                 range: 'Sheet1!E8', // column E is Order column
            //                 valueInputOption: 'RAW',
            //                 requestBody: {
            //                     values: [[v[2]]], // v[2] is order.order_qty
            //                 },
            //             });
            //             break;
            //         case 'A120':
            //             break;
            //         case 'A153':
            //         case 'A25':
            //         case 'A16':
            //         case 'A170':
            //         case '64997':
            //         case '65001':
            //         case '65028':
            //         case '65571':
            //     }
            // }
        } else if (activeCateg === 'BREAD') {
            // const spreadsheetId =
            //     '1-0000000000000000000000000000000000000000000000000000000000000000';
            // const range = 'Sheet1!A1'; // Adjust as needed
        }
    } catch (error) {
        // console.error('Error sending to Google Sheet:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
