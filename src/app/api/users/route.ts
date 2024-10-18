import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generatePassword } from "../../../../lib/hashPassword"
import UserModel from "../../models/userModel"
import { jwtMiddleware } from "../../../../middleware/jwtMiddleware";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  role: z.string().optional(),
})

//req is short for request
export async function GET(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  const users = await UserModel.findAll()

  return NextResponse.json(
    { message: "this is a get request", data: users },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  const response = schema.safeParse(await req.json());
  if (!response.success) {
    return NextResponse.json(
      response
    );
  }

  const {name, email, password, role} = response.data;
  const checkUser = await UserModel.findByEmail(email);
  
  if (checkUser && checkUser.email) {
    return NextResponse.json(
      { message: "User is already registered" },
      { status: 200 }
    );    
  }
  let userDataForm = {
    name: name,
    email: email,
    role: 'user'
  }
  if (password !== undefined) {
    Object.assign(userDataForm, { password: await generatePassword(password) })
  }
  if (role !== undefined) {
    Object.assign(userDataForm, { role: role })
  }
  const userData = await UserModel.create(userDataForm)

  return NextResponse.json(
    { success: true, data: userData},
    { status: 200 }
  );
}

export async function PATCH(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  const {id, name, email, password, role} = await req.json();
  const updateData = {}
  if (name) Object.assign(updateData, { name })
  if (email) Object.assign(updateData, { email })
  if (password) Object.assign(updateData, { password: await generatePassword(password) })
  if (role) Object.assign(updateData, { role })
  const userData = await UserModel.update(id, updateData)

  return NextResponse.json(
    { message: "This is a patch request", data: userData },
    { status: 200 }
  );
}


export async function DELETE(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  const {id} = await req.json();
  const userData = await UserModel.delete(id)

  return NextResponse.json(
    { message: "This is a delete request", data: userData },
    { status: 200 }
  );
}
