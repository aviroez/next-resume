import UserModel from "@/app/models/userModel";
import { checkPassword, generateToken } from "@/hashPassword";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function GET(req: NextRequest) {
  const tokenCookie = req.cookies.get('token')?.value;
  let token = ''

  if (!tokenCookie) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'No token provided', status: false }, { status: 401 });
    }
  
    const tokenAuth = authHeader.split(' ')[1];
    if (!tokenAuth) {
      return NextResponse.json({ message: 'No token provided', status: false }, { status: 401 });
    }
    token = tokenAuth
  } else {
    token = tokenCookie
  }
  let checkUser = await UserModel.findByToken(token);
  
  if (checkUser) {
    const userObject = { ...checkUser } as { [key: string]: any; password?: string };
    delete userObject.password;

    const response = NextResponse.json(
      { success: true, data: userObject},
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
  console.log('response', response)
  if (!response.success) {
    return NextResponse.json(
      response
    );
  }

  const {email, password} = response.data;
  let checkUser = await UserModel.findByEmail(email);
  
  if (checkUser) {    
    const validPassword = await checkPassword(password, checkUser.password)
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Password is not valid" },
        { status: 200 }
      );
    }

    const token = generateToken(checkUser.id)

    // Convert to a plain object and cast to a more permissive type
    const userObject = { ...checkUser, token: token } as { [key: string]: any; password?: string };
    delete userObject.password;

    await UserModel.update(checkUser.id, {token: token});

    const response = NextResponse.json(
      { success: true, data: userObject},
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      sameSite: 'strict', // Prevent CSRF
      path: '/', // Make the cookie accessible throughout the site
      maxAge: 60 * 60, // 1 hour in seconds
    });

    return response
  }
  return NextResponse.json(
    { success: false, message: "Login failed" },
    { status: 200 }
  );
}
