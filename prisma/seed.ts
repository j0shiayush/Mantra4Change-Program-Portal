import { PrismaClient } from '@prisma/client';
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const prisma = new PrismaClient();

const CSV_FILES = [
  path.join(process.cwd(), 'data', 'PBL_School_Response_Data_July_2025.csv'),
  path.join(process.cwd(), 'data', 'PBL_School_Response_Data_August_2025.csv'),
  path.join(process.cwd(), 'data', 'PBL_School_Response_Data_September_2025.csv'),
];

async function processCsv(filePath: string) {
  const records: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: any) => {
        records.push({
          reportingMonth: data['Reporting Month'],
          timestamp: data['Timestamp'],
          schoolName: data['What is the name of your school?'],
          schoolCode: data["What is your school's synthetic school code?"],
          district: data['What is the name of your district?'],
          block: data['Block Details'],
          projectConducted: data['Was the PBL project conducted in your school this month?'],
          evidenceSubmitted: data['Was evidence submitted for the completed PBL project?'],
          classesConducted: data['In which class/classes did you conduct the PBL project?'],
          subjectTaught: data['Which subject do you teach?'],
          
          class6Enrollment: parseInt(data['Total number of students enrolled in Class 6, including all sections']) || 0,
          class6SciAttendance: parseInt(data['Average student attendance during the Class 6 PBL Science session. If you did not teach Science in Class 6, enter 0.']) || 0,
          class6MathAttendance: parseInt(data['Average student attendance during the Class 6 PBL Math session. If you did not teach Math in Class 6, enter 0.']) || 0,
          
          class7Enrollment: parseInt(data['Total number of students enrolled in Class 7, including all sections']) || 0,
          class7SciAttendance: parseInt(data['Average student attendance during the Class 7 PBL Science session. If you did not teach Science in Class 7, enter 0.']) || 0,
          class7MathAttendance: parseInt(data['Average student attendance during the Class 7 PBL Math session. If you did not teach Math in Class 7, enter 0.']) || 0,
          
          class8Enrollment: parseInt(data['Total number of students enrolled in Class 8, including all sections']) || 0,
          class8SciAttendance: parseInt(data['Average student attendance during the Class 8 PBL Science session. If you did not teach Science in Class 8, enter 0.']) || 0,
          class8MathAttendance: parseInt(data['Average student attendance during the Class 8 PBL Math session. If you did not teach Math in Class 8, enter 0.']) || 0,
          
          totalEnrollment: parseInt(data['Derived: Total enrollment across Classes 6-8']) || 0,
          totalAttendance: parseInt(data['Derived: Total attendance across PBL Science and Math sessions']) || 0,
          attendanceRate: parseFloat(data['Derived: Overall PBL attendance rate']) || 0,
          riskStatus: data['Derived: Risk status']
        });
      })
      .on('end', () => {
         resolve(records);
      })
      .on('error', (err: any) => reject(err));
  });
}

async function main() {
  console.log('Starting data seed pipeline...');
  
  await prisma.pblSchoolResponse.deleteMany();
  console.log('Cleared existing database records.');

  for (const file of CSV_FILES) {
    console.log(`Processing file: ${path.basename(file)}...`);
    try {
       const records = await processCsv(file) as any[];
       await prisma.pblSchoolResponse.createMany({
         data: records
       });
       console.log(`Successfully inserted ${records.length} records from ${path.basename(file)}.`);
    } catch (error) {
       console.error(`Error processing ${file}:`, error);
    }
  }
  
  console.log('Database seeding completely successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });