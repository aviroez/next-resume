import UserModel from "@/app/models/userModel";
import { generatePassword } from "@/hashPassword";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export async function POST(req: NextRequest) {
    const response = schema.safeParse(await req.json());
    if (!response.success) {
      return NextResponse.json(
        response
      );
    }

    const {name, email, password} = response.data;
    const checkUser = await UserModel.findByEmail(email);
    
    if (checkUser && checkUser.email) {
      return NextResponse.json(
        { message: "User is already registered" },
        { status: 200 }
      );    
    }
    const userDataForm = {
      name: name,
      email: email,
      password: await generatePassword(password),
      role: 'user',
      token: ''
    }
    const userData = await UserModel.create(userDataForm)

    return NextResponse.json(
      { success: true, data: userData},
      { status: 200 }
    );
}
