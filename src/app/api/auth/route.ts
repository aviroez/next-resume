import UserModel from "@/app/models/userModel";
import { checkPassword, generateToken } from "@/hashPassword";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const tokenType = process.env.TOKEN_TYPE ?? "token";
export async function GET(req: NextRequest) {
  let token: string | undefined
  if (tokenType == "cookies") {
    const tokenCookie = req.cookies.get('token')?.value;

    token = tokenCookie
  } else {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'No token provided', status: false }, { status: 401 });
    }

    const tokenAuth = authHeader.split(' ')[1];
    if (!tokenAuth) {
      return NextResponse.json({ message: 'No token provided', status: false }, { status: 401 });
    }
    token = tokenAuth
  }
  const checkUser = await UserModel.findByToken(token);
  
  if (checkUser) {
    const { password, ...userWithoutPassword } = checkUser;
    void password

    const response = NextResponse.json(
      { success: true, data: userWithoutPassword},
      { status: 200 }
    );

    return response
  }
  return NextResponse.json(
    { success: false, message: "Login failed" },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const response = schema.safeParse(await req.json());
  if (!response.success) {
    return NextResponse.json(
      response
    );
  }

  const respData = response.data;
  const checkUser = await UserModel.findByEmail(respData.email);
  
  if (checkUser) {
    const validPassword = await checkPassword(respData.password, checkUser.password)
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Password is not valid" },
        { status: 200 }
      );
    }

    const token = generateToken(checkUser.id)


    await UserModel.update(checkUser.id, {token: token});

    // Convert to a plain object and cast to a more permissive type
    const { password, ...userWithoutPassword } = checkUser;
    void password
    Object.assign(userWithoutPassword, {token: token})

    const response = NextResponse.json(
      { success: true, data: userWithoutPassword},
      { status: 200 }
    );

    if (tokenType == "cookies") {
      response.cookies.set('token', token, {
        httpOnly: true, // Prevent JavaScript access
        secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
        sameSite: 'strict', // Prevent CSRF
        path: '/', // Make the cookie accessible throughout the site
        maxAge: 60 * 60, // 1 hour in seconds
      });
    }

    return response
  }
  return NextResponse.json(
    { success: false, message: "Login failed" },
    { status: 200 }
  );
}
