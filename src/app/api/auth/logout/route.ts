import { NextRequest, NextResponse } from "next/server";

const logoutAction = (req: NextRequest) => {
  const tokenType = process.env.TOKEN_TYPE ?? "token";
  const response = NextResponse.json(
    { message: "Successfully logout" },
    { status: 200 }
  );
  if (tokenType == "cookies") {
    response.cookies.set('token', '', {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict', // Prevent CSRF
      path: '/', // Make the cookie accessible throughout the site
      expires: new Date(0), // Set an expired date to clear the cookie
    });
  }

  return response

}
export async function GET(req: NextRequest) {
  return logoutAction(req)
}

export async function POST(req: NextRequest) {
  return logoutAction(req)
}
