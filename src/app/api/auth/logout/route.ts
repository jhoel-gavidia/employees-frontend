import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({
        message: "Logged out Successfully"
    });
    
    response.cookies.delete("token");

    return response;
}
