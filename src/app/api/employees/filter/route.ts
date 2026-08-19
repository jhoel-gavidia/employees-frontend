import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);

  const response = await fetch(
    `${API_URL}/api/employees/filter?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}