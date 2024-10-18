import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "This is a get request register" },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: "This is a post request register" },
    { status: 200 }
  );
}
