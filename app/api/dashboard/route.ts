import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const district = searchParams.get('district');
    const block = searchParams.get('block');

    const where: any = {};
    if (month && month !== 'All') where.reportingMonth = month;
    if (district && district !== 'All') where.district = district;
    if (block && block !== 'All') where.block = block;

    const data = await prisma.pblSchoolResponse.findMany({ where });

    const totalSchools = data.length;
    
    const participatingSchools = data.filter((r) => r.projectConducted === 'Yes').length;
    const participationRate = totalSchools > 0 ? (participatingSchools / totalSchools) * 100 : 0;

    const evidenceSubmitted = data.filter((r) => r.evidenceSubmitted === 'Yes').length;

    const evidenceRate = participatingSchools > 0 ? (evidenceSubmitted / participatingSchools) * 100 : 0;

    const totalEnrollment = data.reduce((acc, curr) => acc + curr.totalEnrollment, 0);
    const totalAttendance = data.reduce((acc, curr) => acc + curr.totalAttendance, 0);
    const attendanceRate = totalEnrollment > 0 ? (totalAttendance / totalEnrollment) * 100 : 0;

    const performanceByDistrict = data.reduce((acc: any, curr) => {
      if (!acc[curr.district]) {
        acc[curr.district] = { attendance: 0, enrollment: 0, schools: 0 };
      }
      acc[curr.district].schools += 1;
      acc[curr.district].attendance += curr.totalAttendance;
      acc[curr.district].enrollment += curr.totalEnrollment;
      return acc;
    }, {});

    const districtPerformance = Object.keys(performanceByDistrict).map((d) => {
      const dist = performanceByDistrict[d];
      const rate = dist.enrollment > 0 ? (dist.attendance / dist.enrollment) * 100 : 0;
      
      let riskStatus = "Critical";
      if (rate >= 75) riskStatus = "On Track";
      else if (rate >= 60) riskStatus = "Behind";
      else if (rate >= 35) riskStatus = "At Risk";

      return {
        district: d,
        schools: dist.schools,
        attendanceRate: rate,
        riskStatus
      };
    }).sort((a, b) => b.attendanceRate - a.attendanceRate);

    return NextResponse.json({
      summary: {
        totalSchools,
        participatingSchools,
        participationRate: parseFloat(participationRate.toFixed(1)),
        evidenceRate: parseFloat(evidenceRate.toFixed(1)),
        totalEnrollment,
        totalAttendance,
        attendanceRate: parseFloat(attendanceRate.toFixed(1)),
      },
      geography: districtPerformance
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to compute program intelligence" }, { status: 500 });
  }
}