import { NextRequest ,NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json",
        },
            body: JSON.stringify(body),  
        });


        if (!response.ok) {
            return NextResponse.json(
                { message: "Invalid username or password." },
                { status: response.status }
            );
        }

        const data = await response.json();

        const res = NextResponse.json({
            username: data.username,
            role: data.role
        });

        res.cookies.set("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60,
        });

        return res;

    } catch {
        return NextResponse.json(
            {message: "Authentication service unavaible. "},
            {status: 503}
        );
    }
}
