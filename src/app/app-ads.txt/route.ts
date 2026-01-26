import { NextResponse } from 'next/server';

export async function GET() {
    const content = 'google.com, pub-3061696204290590, DIRECT, f08c47fec0942fa0';
    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-store, max-age=0',
        },
    });
}
