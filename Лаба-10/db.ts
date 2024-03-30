import { PrismaClient } from '@prisma/client';

class DbController {

prisma = new PrismaClient();

async createRecords(prisma : PrismaClient) {
  const fac1 = await prisma.faculty.create({
    data: {
      faculty: 'FAC123',
      faculty_name: 'Computer Science',
    },
 });
 const upFac1 = await prisma.faculty.update({
    where: {faculty: 'FAC123'},
    data: {
      faculty_name: 'NEW NAME'
    }
 });
 const delFac1 = await prisma.faculty.delete({
  where: {faculty: 'FAC123'}
 });

 const faculty1 = await prisma.faculty.create({
  data: {
    faculty: 'FAC123',
    faculty_name: 'Computer Science',
  },
});

 const faculty2 = await prisma.faculty.create({
    data: {
      faculty: 'FAC124',
      faculty_name: 'Mechanical Engineering',
    },
 });

 // Example Pulpits
 const pulpit1 = await prisma.pulpit.create({
    data: {
      pulpit: 'PUL123',
      pulpit_name: 'Computer Science Pulpit',
      faculty_id: faculty1.faculty,
    },
 });

 const pulpit2 = await prisma.pulpit.create({
    data: {
      pulpit: 'PUL124',
      pulpit_name: 'Mechanical Engineering Pulpit',
      faculty_id: faculty1.faculty,
    },
 });

 // Example Teachers
 const teacher1 = await prisma.teacher.create({
    data: {
      teacher: 'TEA123',
      teacher_name: 'John Doe',
      pulpit_id: pulpit1.pulpit,
    },
 });

 const teacher2 = await prisma.teacher.create({
    data: {
      teacher: 'TEA124',
      teacher_name: 'Vladimir Smith',
      pulpit_id: pulpit1.pulpit,
    },
 });

 // Example Subjects
 const subject1 = await prisma.subject.create({
    data: {
      subject: 'SUB123',
      subject_name: 'Introduction to Programming',
      pulpit_id: pulpit1.pulpit,
    },
 });

 const subject2 = await prisma.subject.create({
    data: {
      subject: 'SUB124',
      subject_name: 'Mechanical Design',
      pulpit_id: pulpit1.pulpit,
    },
 });

 // Example Auditorium Types
 const auditoriumType1 = await prisma.auditorium_Type.create({
    data: {
      auditorium_type: 'AUD_TYPE1',
      auditorium_typename: 'Lecture Hall',
    },
 });

 const auditoriumType2 = await prisma.auditorium_Type.create({
    data: {
      auditorium_type: 'AUD_TYPE2',
      auditorium_typename: 'Lab',
    },
 });

 // Example Auditoriums
 const auditorium1 = await prisma.auditorium.create({
    data: {
      auditorium: '232-1',
      auditorium_name: 'Main Auditorium',
      auditorium_capacity: 200,
      auditorium_type_id: auditoriumType1.auditorium_type,
    },
 });

 const auditorium2 = await prisma.auditorium.create({
    data: {
      auditorium: '101-1',
      auditorium_name: 'Engineering Lab',
      auditorium_capacity: 50,
      auditorium_type_id: auditoriumType1.auditorium_type,
    },
 });
 const auditorium3 = await prisma.auditorium.create({
  data: {
    auditorium: '101-4',
    auditorium_name: 'Engineering Lab',
    auditorium_capacity: 50,
    auditorium_type_id: auditoriumType2.auditorium_type,
  },
});
const auditorium4 = await prisma.auditorium.create({
  data: {
    auditorium: '231-3',
    auditorium_name: 'Lab',
    auditorium_capacity: 50,
    auditorium_type_id: auditoriumType1.auditorium_type,
  },
});
 await prisma.$disconnect();
  console.log("Records created successfully!");
 }

 async incrementCapacityAndRollback() {
  const transaction = await dbController.prisma.$transaction([
     this.prisma.auditorium.updateMany({
       data: {
        auditorium_capacity: {
           increment: 100,
         },
       },
     }),
  ]);
 
  await this.prisma.$disconnect();
 
  console.log('Transaction rolled back. No changes were made to the database.');
 }
}

const dbController = new DbController();
dbController.createRecords(dbController.prisma)
  .then(() => {
    console.log('Records created successfully!');
  })
  .catch((error) => {
    console.error('Error creating records:', error);
  });


  dbController.incrementCapacityAndRollback();
export default dbController;