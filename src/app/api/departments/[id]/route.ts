import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext,
) {
  const { id } = await params;
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  const response = await fetch(`${API_URL}/api/departments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext,
) {
  const { id } = await params;
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const response = await fetch(`${API_URL}/api/departments/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext,
) {
  const { id } = await params;
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  const response = await fetch(`${API_URL}/api/departments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await response.text();

  if (!text) {
    return new NextResponse(null, {
      status: response.status,
    });
  }

  return NextResponse.json(JSON.parse(text), {
    status: response.status,
  });
}