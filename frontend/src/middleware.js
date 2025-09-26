import { NextResponse } from 'next/server';

export default async function middleware(request) {
    
    const { nextUrl } = request;
    const publicPaths = ['/login', '/register', '/send-password-reset-email', '/reset-password'];
    const isPublic = publicPaths.includes(nextUrl.pathname);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || nextUrl.origin;

    // Add security checks
    const blockedPaths = ['.circleci', '.aws', '.env', '.git', 'config', '.config', '.ssh'];
    const isBlocked = blockedPaths.some(path => nextUrl.pathname.toLowerCase().includes(path));
    
    if (isBlocked) {
        // Log attempt and return 403 Forbidden
        console.log(`Blocked suspicious request to: ${nextUrl.pathname}`);
        return new NextResponse(null, { status: 403 });
    }
    
    if (!isPublic) {

        const headers = { 'Cookie': request.headers.get('cookie') || '' };

        const redirect = encodeURIComponent(nextUrl.pathname + nextUrl.search);
        const redirectUrl = new URL(`/login?redirect=${redirect}`, baseUrl);

        try {
            // Try refresh first
            const refreshRes = await fetch(`${baseUrl}/api/account/refresh`, { headers });
            if (refreshRes.status === 200) {
                // If refresh successful, verify the new session
                const verifyRes = await fetch(`${baseUrl}/api/account/verify`, { headers });
                if (verifyRes.status !== 200) {
                    return NextResponse.redirect(redirectUrl);
                    
                }
            } else {
                return NextResponse.redirect(redirectUrl); 
            }
        } catch(error) {
            return NextResponse.redirect(redirectUrl);
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
        '/((?!api|_next/static|_next/image|favicon).*)',
    ],
}
