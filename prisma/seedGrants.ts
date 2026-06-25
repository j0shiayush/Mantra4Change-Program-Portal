import { PrismaClient } from '@prisma/client';
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const prisma = new PrismaClient();

async function processCsv(filePath: string, rowProcessor: (data: any) => any) {
  const records: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: any) => records.push(rowProcessor(data)))
      .on('end', () => resolve(records))
      .on('error', (err: any) => reject(err));
  });
}

async function main() {
  console.log('Starting Grant Data seeding...');

  const financeFile = path.join(process.cwd(), 'data', '01_Grant_Profile_and_Finance.csv');
  const financeRecords = await processCsv(financeFile, (data) => ({
    grantId: data['grant_id'],
    grantName: data['grant_name'],
    reportingMonth: data['reporting_month'],
    budgetLine: data['budget_line'],
    approvedUnits: parseInt(data['approved_budget_units']) || 0,
    monthlyUtilized: parseInt(data['monthly_utilized_units']) || 0,
    cumulativeUtilized: parseInt(data['cumulative_utilized_units']) || 0,
    utilizationRate: parseFloat(data['cumulative_utilization_rate']) || 0,
    financeNote: data['finance_note'],
  })) as any[];
  await prisma.grantFinance.deleteMany();
  await prisma.grantFinance.createMany({ data: financeRecords });
  console.log(`Seeded ${financeRecords.length} Finance records.`);

  const perfFile = path.join(process.cwd(), 'data', '02_Grant_Performance_and_Report_Material.csv');
  const perfRecords = await processCsv(perfFile, (data) => ({
    grantId: data['grant_id'],
    grantName: data['grant_name'],
    reportingMonth: data['reporting_month'],
    reportStatus: data['report_status'],
    pblCompletionRate: parseFloat(data['pbl_completion_rate']) || 0,
    evidenceSubmissionRate: parseFloat(data['evidence_submission_rate']) || 0,
    attendanceRate: parseFloat(data['attendance_rate']) || 0,
    riskStatus: data['risk_status'],
    milestoneSummary: data['milestone_summary'],
    draftReportText: data['draft_report_text'],
  })) as any[];
  await prisma.grantPerformance.deleteMany();
  await prisma.grantPerformance.createMany({ data: perfRecords });
  console.log(`Seeded ${perfRecords.length} Performance records.`);

  const mediaFile = path.join(process.cwd(), 'data', '03_Evidence_and_Media_Index.csv');
  const mediaRecords = await processCsv(mediaFile, (data) => ({
    recordId: data['record_id'],
    recordType: data['record_type'],
    grantId: data['grant_id'],
    reportingMonth: data['reporting_month'],
    title: data['title'],
    summary: data['summary_or_caption'],
    fileName: data['file_name'],
    relativePath: data['relative_path'],
  })) as any[];
  await prisma.grantMedia.deleteMany();
  await prisma.grantMedia.createMany({ data: mediaRecords });
  console.log(`Seeded ${mediaRecords.length} Media records.`);

  console.log('Grant Data Seeding Completed Successfully!');
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());