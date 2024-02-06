import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_FFRAME_BASE_URL) {
    return new NextResponse('error: missing NEXT_PUBLIC_FFRAME_BASE_URL env variable');
  }
  if (request.method === 'POST' || (request.method === 'GET' && request.nextUrl.toString().includes('images'))) {
    const frameId = request.nextUrl.searchParams.get('frameId');
    if (!frameId) {
      return new NextResponse('error: frameId is required', { status: 400 });
    }
  }
}
