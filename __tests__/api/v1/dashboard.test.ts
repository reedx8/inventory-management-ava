// import request from 'supertest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/v1/dashboard/route';
import * as supabaseServer from '@/app/utils/supabase/server';
import * as queries from '@/db/queries/select';

// Mock the dependencies
jest.mock('@/app/utils/supabase/server', () => ({
    createClient: jest.fn(),
}));

jest.mock('@/db/queries/select', () => ({
    getBakeryDueTodayCount: jest.fn(),
    getItemCount: jest.fn(),
    getStoreCount: jest.fn(),
}));

describe('Dashboard API Mock Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock Supabase authentication
        (supabaseServer.createClient as jest.Mock).mockResolvedValue({
            auth: {
                getUser: jest.fn().mockResolvedValue({
                    data: { user: { id: 'user-123' } },
                }),
            },
        });
    });

    it('API returns bakeryDueToday data with status 200', async () => {
        // Mock the query function to return test data
        (queries.getBakeryDueTodayCount as jest.Mock).mockResolvedValue({
            success: true,
            data: { count: 5 },
        });

        // Create a NextRequest with the appropriate query parameters
        const req = new NextRequest(
            new URL(
                'http://localhost:3000/api/v1/dashboard?fetch=bakeryDueToday'
            )
        );

        // Call the handler function
        const response = await GET(req);

        // Assert on the response
        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData).toEqual({
            success: true,
            data: { count: 5 },
        });
        expect(queries.getBakeryDueTodayCount).toHaveBeenCalledTimes(1);
    });

    it('API returns storeCount data with status 200', async () => {
        // Mock the query function
        (queries.getStoreCount as jest.Mock).mockResolvedValue({
            success: true,
            data: { count: 10 },
        });

        const req = new NextRequest(
            new URL('http://localhost:3000/api/v1/dashboard?fetch=storeCount')
        );

        const response = await GET(req);

        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData).toEqual({
            success: true,
            data: { count: 10 },
        });
        expect(queries.getStoreCount).toHaveBeenCalledTimes(1);
    });

    it('API returns itemCount data with status 200', async () => {
        // Mock the query function
        (queries.getItemCount as jest.Mock).mockResolvedValue({
            success: true,
            data: { count: 42 },
        });

        const req = new NextRequest(
            new URL('http://localhost:3000/api/v1/dashboard?fetch=itemCount')
        );

        const response = await GET(req);

        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData).toEqual({
            success: true,
            data: { count: 42 },
        });
        expect(queries.getItemCount).toHaveBeenCalledTimes(1);
    });

    it('API returns 401 when user is not authenticated', async () => {
        // Mock Supabase to return no user
        (supabaseServer.createClient as jest.Mock).mockResolvedValue({
            auth: {
                getUser: jest.fn().mockResolvedValue({
                    data: { user: null },
                }),
            },
        });

        const req = new NextRequest(
            new URL(
                'http://localhost:3000/api/v1/dashboard?fetch=bakeryDueToday'
            )
        );

        const response = await GET(req);

        expect(response.status).toBe(401);
        const responseData = await response.json();
        expect(responseData).toEqual({ error: 'Unauthorized' });
    });

    it('API returns 400 when fetch parameter is missing', async () => {
        const req = new NextRequest(
            new URL('http://localhost:3000/api/v1/dashboard')
        );

        const response = await GET(req);

        expect(response.status).toBe(400);
        const responseData = await response.json();
        expect(responseData.error).toBeDefined();
    });

    it('API returns 400 when fetch parameter is invalid', async () => {
        // Create request with invalid fetch parameter
        const req = new NextRequest(
            new URL('http://localhost:3000/api/v1/dashboard?fetch=invalidType')
        );

        const response = await GET(req);

        expect(response.status).toBe(400);
        const responseData = await response.json();
        expect(responseData.error).toContain(
            'You need to pass "fetch" in API url'
        );
    });
});
