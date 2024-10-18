import { NextRequest, NextResponse } from "next/server";
import { jwtMiddleware } from "../../../../../middleware/jwtMiddleware";
import PortfolioModel from "@/app/models/portfolioModel";

export async function GET(req: NextRequest) {
  const authResult = await jwtMiddleware(req);
  if (authResult) return authResult;

  const id = parseInt(req.url.slice(req.url.lastIndexOf('/')+1))

  if (id < 0) {
    return NextResponse.json(
      { status: false, message: "Portfolio is not found"},
      { status: 200 }
    );
  }

  const portfolio = await PortfolioModel.findById(id)

  return NextResponse.json(
    { status: true, message: "this is a get request", data: portfolio },
    { status: 200 }
  );
}
