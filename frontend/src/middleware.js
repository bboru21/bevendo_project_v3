import { NextResponse } from 'next/server';

export default async function middleware(request) {
    const { nextUrl } = request;
    
    const publicPaths = ['/login', '/register', '/send-password-reset-email', '/reset-password', '/404'];
    const isPublic = publicPaths.includes(nextUrl.pathname);
    
    const headers = { 'Cookie': request.headers.get('cookie') || '' }
    const redirect = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const loginUrl = new URL(`/login?redirect=${redirect}`, baseUrl);

    if (!isPublic) {
        try {
            // attempt refresh first
            const refreshRes = await fetch(`${baseUrl}/api/account/refresh`, { headers });

            if (refreshRes.status === 200) {
                // if refresh is successful, verify the new session
                const verifyRes = await fetch(`${baseUrl}/api/account/verify`, { headers });

                if (verifyRes.status !== 200) {
                    return NextResponse.redirect(loginUrl);
                }
            } else {
                return NextResponse.redirect(loginUrl);
            }
        } catch(error) {
            return NextResponse.redirect(loginUrl);
        }
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}