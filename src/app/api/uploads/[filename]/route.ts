import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { promises as fs } from 'fs'
import mime from 'mime'

type Params = {
    params: {
        filename: string
    }
}

export async function GET(req: NextRequest, { params }: Params) {
  const { filename } = params;

  // Path to the uploads directory
  const filePath = join(process.cwd(), 'uploads', filename);

  try {
    // Read the file from the uploads directory
    const fileContents = await fs.readFile(filePath);
    const contentType = mime.getType(filePath) || 'application/octet-stream';

    // Return the file as a response
    return new NextResponse(fileContents, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg', // Adjust content type if needed
      },
    });
  } catch (error) {
    // File not found or other error
    return new NextResponse('File not found', { status: 404 });
  }
}
