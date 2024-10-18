import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import PortfolioModel from '../../models/portfolioModel'
import { jwtMiddleware } from "../../../../middleware/jwtMiddleware";

const schema = z.object({
  company: z.string(),
  title: z.string(),
  tag: z.string().optional(),
  description: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

const schemaUpdate = z.object({
  id: z.number(),
  company: z.string().optional(),
  title: z.string().optional(),
  tag: z.string().optional(),
  description: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  const portfolios = await PortfolioModel.findAll()

  return NextResponse.json(
    { message: "this is a get request", data: portfolios },
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

  const {company, title, tag, description, dateFrom, dateTo} = response.data;
  let portfolioDataForm = {
    company: company,
    title: title,
    tag: tag ? tag : ''
  }
  if (description !== undefined) {
    Object.assign(portfolioDataForm, { description: description })
  }
  if (dateFrom !== undefined) {
    Object.assign(portfolioDataForm, { dateFrom: new Date(dateFrom) })
  }
  if (dateTo !== undefined) {
    Object.assign(portfolioDataForm, { dateTo: new Date(dateTo) })
  }
  const portfolioData = await PortfolioModel.create(portfolioDataForm)

  return NextResponse.json(
    { success: true, data: portfolioData},
    { status: 200 }
  );
}

export async function PATCH(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  const response = schemaUpdate.safeParse(await req.json())
  if (!response.success) {
    return NextResponse.json(
      response
    );
  }
  const {id, company, title, tag, description, dateFrom, dateTo} = response.data

  let portfolioDataForm = { id }
  if (company !== undefined) {
    Object.assign(portfolioDataForm, { company: company })
  }
  if (title !== undefined) {
    Object.assign(portfolioDataForm, { title: title })
  }
  if (tag !== undefined) {
    Object.assign(portfolioDataForm, { tag: tag })
  }
  if (description !== undefined) {
    Object.assign(portfolioDataForm, { description: description })
  }
  if (dateFrom !== undefined) {
    Object.assign(portfolioDataForm, { dateFrom: new Date(dateFrom) })
  }
  if (dateTo !== undefined) {
    Object.assign(portfolioDataForm, { dateTo: new Date(dateTo) })
  }
  const portfolioData = await PortfolioModel.update(id, portfolioDataForm)

  return NextResponse.json(
    { success: true, data: portfolioData },
    { status: 200 }
  );
}


export async function DELETE(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  return NextResponse.json(
    { message: "This is a delete request" },
    { status: 200 }
  );
}
