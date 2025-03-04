import { NextResponse } from 'next/server';

export default async function middleware(request) {
    const { nextUrl } = request;
    
    const publicPaths = ['/login', '/register', '/send-password-reset-email', '/reset-password', '/404'];
    const isPublic = publicPaths.includes(nextUrl.pathname);
    
    const origin = request.nextUrl.origin;
    const headers = { 'Cookie': request.headers.get('cookie') || '' }
    const redirect = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    const loginUrl = new URL(`/login?redirect=${redirect}`, request.url);

    if (!isPublic) {
        try {
            // attempt refresh first
            const refreshRes = await fetch(`${origin}/api/account/refresh`, { headers });
            console.log("*** refreshRes.status ***", refreshRes.status);

            if (refreshRes.status === 200) {
                // if refresh is successful, verify the new session
                const verifyRes = await fetch(`${origin}/api/account/verify`, { headers });
                console.log("*** verifyRes.status ***", verifyRes.status);

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