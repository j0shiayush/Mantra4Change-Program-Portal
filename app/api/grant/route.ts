import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const grantId = searchParams.get('grantId');
    const month = searchParams.get('month');

    if (!grantId || !month) {
      return NextResponse.json({ error: "Missing grantId or month" }, { status: 400 });
    }

    const performance = await prisma.grantPerformance.findFirst({
      where: { grantId, reportingMonth: month }
    });

    const finance = await prisma.grantFinance.findMany({
      where: { grantId, reportingMonth: month }
    });

    const media = await prisma.grantMedia.findMany({
      where: { grantId, reportingMonth: month }
    });

    return NextResponse.json({
      performance,
      finance,
      media
    });

  } catch (error) {
    console.error("Fact API Error:", error);
    return NextResponse.json({ error: "Failed to fetch grant facts" }, { status: 500 });
  }
}