import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import generateSlug from "../../../../lib/generateSlug";
import UploadModel from '../../models/uploadModel'
import PortfolioModel from '../../models/portfolioModel'
import { uploadFile } from "../../../../lib/uploadFile";
import { jwtMiddleware } from "../../../../middleware/jwtMiddleware";

const schema = z.object({
  portfolioId: z.number(),
  name: z.string(),
  type: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  const { nextUrl: { search } } = req;
  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());
  console.log('params', params)

  const where = {}
  if (params.portfolioId) Object.assign(where, { portfolioId: parseInt(params.portfolioId) })

  const uploads = await UploadModel.findAll(where)

  return NextResponse.json(
    { data: uploads },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = (body.file as Blob) || null;

  const postUpload = {
    portfolioId: parseInt(body.portfolioId.toString()),
    name: body.name,
  };
  if (body.type !== undefined) {
    Object.assign(postUpload, { type: body.type })
  }

  const response = schema.safeParse(postUpload);
  if (!response.success) {
    return NextResponse.json(
      response
    );
  }
  const { portfolioId, name, type } = response.data;
  const portfolioModel = await PortfolioModel.findById(portfolioId)
  
  if (!portfolioModel) {
    return NextResponse.json({
      success: false,
      message: "Portfolio is not found"
    });
  }

  if (file) {
    const {fileName, directory, success, error} = await uploadFile(file);
    console.log(fileName, directory, success, error)
    if (error !== undefined) {
      return NextResponse.json({
        success: false,
        error: error
      });
    } else if (!success){
      return NextResponse.json({
        success: success,
        error: error
      });
    }
    const slug = generateSlug(name.toString());
    const uploadData = await UploadModel.create({
        name: fileName,
        type: type ?? 'image',
        slug: slug,
        directory: directory,
        portfolioId: portfolioId
    })
    return NextResponse.json({
      success: true,
      data: uploadData
    });
  } else {
    return NextResponse.json({
      success: false,
    });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  const {id} = await req.json();
  const data = await UploadModel.delete(id)

  return NextResponse.json(
    { message: "This is a delete request", data: data },
    { status: 200 }
  );
}