import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token");
    const {pathname} = req.nextUrl;

    if(token || pathname.includes("/api/login") || pathname.includes("/static")) {
        return NextResponse.next();
    }

    if(!token && pathname !== "/login") {
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.rewrite(url)
    }
}