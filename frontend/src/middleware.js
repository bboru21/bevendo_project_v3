export default function middleware(request) {
    // temporary to test auth with baseUrl
    console.log("*** middleware ***", process.env.NEXT_PUBLIC_API_URL, request.nextUrl.origin);
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
