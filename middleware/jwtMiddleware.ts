import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const jwtMiddleware = async (req: NextRequest) => {
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
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, SECRET_KEY);
    // Attach the decoded user info to the request
    (req as any).user = decoded;
    return null; // Indicates that the request is authenticated
  } catch (error) {
    return NextResponse.json({ message: 'Invalid or expired token', status: false }, { status: 401 });
  }
};
