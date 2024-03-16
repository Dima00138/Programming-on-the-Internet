import express from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  try {
    res.sendFile(__dirname+'/10-04.html');
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: '404'});
  }
});

app.get('/api/pulpits/teacherCount', async (req, res) => {
  try {
    const pulpitsWithTeacherCount = await prisma.pulpit.findMany({
      select: {
        pulpit: true,
        pulpit_name: true,
        faculty: true,
        subjects: true,
        _count: {
          select: {
            teachers: true,
          },
        },
      },
   });
 
     res.json(pulpitsWithTeacherCount);
  } catch (error) {
     console.error('Error fetching teacher count:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

app.get('/api/faculties', async (req, res) => {
  const faculties = await prisma.faculty.findMany();
  res.json(faculties);
});

app.get('/api/pulpits', async (req, res) => {
  const pulpits = await prisma.pulpit.findMany();
  res.json(pulpits);
});

app.get('/api/subjects', async (req, res) => {
  const subjects = await prisma.subject.findMany();
  res.json(subjects);
});

app.get('/api/teachers', async (req, res) => {
  const teachers = await prisma.teacher.findMany();
  res.json(teachers);
});

app.get('/api/auditoriumstypes', async (req, res) => {
  const auditoriumTypes = await prisma.auditorium_Type.findMany();
  res.json(auditoriumTypes);
});

app.get('/api/auditoriums', async (req, res) => {
  const auditoriums = await prisma.auditorium.findMany();
  res.json(auditoriums);
});

app.get('/api/faculties/:xyz/subjects', async (req, res) => {
  const { xyz } = req.params;
  const facultyWithPulpitsAndSubjects = await prisma.faculty.findUnique({
     where: { faculty: xyz },
     include: {
       pulpits: {
         include: {
           subjects: true,
         },
       },
     },
  });
  res.json(facultyWithPulpitsAndSubjects);
 });

 app.get('/api/auditoriumtypes/:xyz/auditoriums', async (req, res) => {
  const { xyz } = req.params;
  const auditoriumTypeWithAuditoriums = await prisma.auditorium_Type.findMany({
     where: { auditorium_type: xyz },
     include: {
       auditoriums: true,
     },
  });
  const totalAuditoriums = auditoriumTypeWithAuditoriums.reduce((total, item) => total + item.auditoriums.length, 0);
  res.json(totalAuditoriums);
 });

 app.get('/api/auditoriumsWithComp1', async (req, res) => {
  const auditoriumsWithComp1 = await prisma.auditorium.findMany({
     where: {
       auditorium_type_id: 'AUD_TYPE1',
       auditorium: {
        endsWith: '%-1'
       },
     },
  });
  res.json(auditoriumsWithComp1);
 });

 app.get('/api/pulpitsWithoutTeachers', async (req, res) => {
  const pulpitsWithoutTeachers = await prisma.pulpit.findMany({
     where: {
       NOT: {
         teachers: {
           some: {},
         },
       },
     },
  });
  res.json(pulpitsWithoutTeachers);
 });

 app.get('/api/pulpitsWithVladimir', async (req, res) => {
  const pulpitsWithVladimir = await prisma.pulpit.findMany({
     where: {
       teachers: {
         some: {
           teacher_name: {
            startsWith: 'Vladimir %'
           },
         },
       },
     },
     include: {
       teachers: true,
     },
  });
  res.json(pulpitsWithVladimir);
 });

 app.get('/api/auditoriumsSameCount', async (req, res) => {
  const { capacity, type } = req.query;
 
  if (!capacity || !type) {
     return res.status(400).json({ error: 'Capacity & type is required' });
  }
 
  try {
     const auditoriums = await prisma.auditorium.findMany({
       where: {
         auditorium_capacity: parseInt(capacity as string),
         auditorium_type_id: type as string,
       },
     });
 
     res.json(auditoriums);
  } catch (error) {
     console.error('Error fetching auditoriums:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });
 
 app.post('/api/faculties', async (req, res) => {
   const { faculty, faculty_name, pulpits } = req.body;
   
  try {
     const newFaculty = await prisma.faculty.create({
       data: {
         faculty,
         faculty_name,
         pulpits: {
           create: pulpits || [],
         },
       },
     });
 
     res.status(201).json(newFaculty);
  } catch (error) {
     console.error('Error creating faculty:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.post('/api/pulpits', async (req, res) => {
  const { faculty, faculty_name, pulpit_name, pulpit } = req.body;
 
  try {
     let facultyRecord = await prisma.faculty.findUnique({
       where: { faculty: faculty },
     });
 
     if (!facultyRecord) {
       facultyRecord = await prisma.faculty.create({
         data: {
           faculty,
           faculty_name,
         },
       });
     }
 
     const newPulpit = await prisma.pulpit.create({
       data: {
         pulpit,
         pulpit_name,
         faculty_id: facultyRecord.faculty,
       },
     });
 
     res.status(201).json(newPulpit);
  } catch (error) {
     console.error('Error creating pulpit:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.post('/api/subjects', async (req, res) => {
  const { pulpit_id, subject_name, subject } = req.body;
 
  try { 
     const newSubject = await prisma.subject.create({
       data: {
        subject,
         subject_name,
         pulpit: {
          connect: {
            pulpit: pulpit_id,
          },
        },
       },
     });
 
     res.status(201).json(newSubject);
  } catch (error) {
     console.error('Error creating subject:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.post('/api/teachers', async (req, res) => {
  const { teacher_name, teacher, pulpit_id } = req.body;
 
  try {
     const newTeacher = await prisma.teacher.create({
       data: {
        teacher,
         teacher_name,
         pulpit: {
           connect: {
             pulpit: pulpit_id,
           },
         },
       },
     });
 
     res.status(201).json(newTeacher);
  } catch (error) {
     console.error('Error creating teacher:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.post('/api/auditoriumstypes', async (req, res) => {
  const { auditorium_type, auditorium_typename } = req.body;
 
  try {
     const newAuditoriumType = await prisma.auditorium_Type.create({
       data: {
         auditorium_type,
         auditorium_typename,
       },
     });
 
     res.status(201).json(newAuditoriumType);
  } catch (error) {
     console.error('Error creating auditorium type:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.post('/api/auditoriums', async (req, res) => {
  const { auditorium, auditorium_name, auditorium_capacity, auditorium_type_id } = req.body;
 
  try {
     const newAuditorium = await prisma.auditorium.create({
       data: {
         auditorium,
         auditorium_name,
         auditorium_capacity,
         auditorium_type: {
           connect: {
             auditorium_type: auditorium_type_id,
           },
         },
       },
     });
 
     res.status(201).json(newAuditorium);
  } catch (error) {
     console.error('Error creating auditorium:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.put('/api/faculties/:faculty', async (req, res) => {
  const { faculty: facultyId } = req.params;
  const { faculty_name } = req.body;
 
  try {
     const updatedFaculty = await prisma.faculty.update({
       where: { faculty: facultyId },
       data: { faculty_name },
     });
 
     res.status(200).json(updatedFaculty);
  } catch (error) {
     console.error('Error updating faculty:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.put('/api/pulpits/:pulpit', async (req, res) => {
  const { pulpit: pulpitId } = req.params;
  const { pulpit_name, faculty_id } = req.body;
 
  try {
     const updatedPulpit = await prisma.pulpit.update({
       where: { pulpit: pulpitId },
       data: {
         pulpit_name,
         faculty_id,
       },
     });
 
     res.status(200).json(updatedPulpit);
  } catch (error) {
     console.error('Error updating pulpit:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.put('/api/subjects/:subject', async (req, res) => {
  const { subject: subjectId } = req.params;
  const { subject_name, pulpit_id } = req.body;
 
  try {
     const updatedSubject = await prisma.subject.update({
       where: { subject: subjectId },
       data: {
         subject_name,
         pulpit: {
           connect: {
             pulpit: pulpit_id,
           },
         },
       },
     });
 
     res.status(200).json(updatedSubject);
  } catch (error) {
     console.error('Error updating subject:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.put('/api/teachers/:teacher', async (req, res) => {
  const { teacher: teacherId } = req.params;
  const { teacher_name, pulpit_id } = req.body;
 
  try {
     const updatedTeacher = await prisma.teacher.update({
       where: { teacher: teacherId },
       data: {
         teacher_name,
         pulpit: {
           connect: {
             pulpit: pulpit_id,
           },
         },
       },
     });
 
     res.status(200).json(updatedTeacher);
  } catch (error) {
     console.error('Error updating teacher:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.put('/api/auditoriumstypes/:auditorium_type', async (req, res) => {
  const { auditorium_type: auditoriumTypeId } = req.params;
  const { auditorium_typename } = req.body;
 
  try {
     const updatedAuditoriumType = await prisma.auditorium_Type.update({
       where: { auditorium_type: auditoriumTypeId },
       data: { auditorium_typename },
     });
 
     res.status(200).json(updatedAuditoriumType);
  } catch (error) {
     console.error('Error updating auditorium type:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.put('/api/auditoriums/:auditorium', async (req, res) => {
  const { auditorium: auditoriumId } = req.params;
  const { auditorium_name, auditorium_capacity, auditorium_type_id } = req.body;
 
  try {
     const updatedAuditorium = await prisma.auditorium.update({
       where: { auditorium: auditoriumId },
       data: {
         auditorium_name,
         auditorium_capacity,
         auditorium_type: {
           connect: {
             auditorium_type: auditorium_type_id,
           },
         },
       },
     });
 
     res.status(200).json(updatedAuditorium);
  } catch (error) {
     console.error('Error updating auditorium:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.delete('/api/faculties/:faculty', async (req, res) => {
  const { faculty: facultyCode } = req.params;
 
  try {
     const deletedFaculty = await prisma.faculty.delete({
       where: { faculty: facultyCode },
     });
 
     res.status(200).json(deletedFaculty);
  } catch (error) {
     console.error('Error deleting faculty:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.delete('/api/pulpits/:pulpit', async (req, res) => {
  const { pulpit: pulpitId } = req.params;
 
  try {
     const deletedPulpit = await prisma.pulpit.delete({
       where: { pulpit: pulpitId },
     });
 
     res.status(200).json(deletedPulpit);
  } catch (error) {
     console.error('Error deleting pulpit:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 app.delete('/api/subjects/:subject', async (req, res) => {
  const { subject: subjectId } = req.params;
 
  try {
     const deletedSubject = await prisma.subject.delete({
       where: { subject: subjectId },
     });
 
     res.status(200).json(deletedSubject);
  } catch (error) {
     console.error('Error deleting subject:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });
 
 app.delete('/api/teachers/:teacher', async (req, res) => {
  const { teacher: teacherId } = req.params;
 
  try {
     const deletedTeacher = await prisma.teacher.delete({
       where: { teacher: teacherId },
     });
 
     res.status(200).json(deletedTeacher);
  } catch (error) {
     console.error('Error deleting teacher:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });
 
 app.delete('/api/auditoriumstypes/:auditorium_type', async (req, res) => {
  const { auditorium_type: auditoriumTypeId } = req.params;
 
  try {
     const deletedAuditoriumType = await prisma.auditorium_Type.delete({
       where: { auditorium_type: auditoriumTypeId },
     });
 
     res.status(200).json(deletedAuditoriumType);
  } catch (error) {
     console.error('Error deleting auditorium type:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });
 
 app.delete('/api/auditoriums/:auditorium', async (req, res) => {
  const { auditorium: auditoriumId } = req.params;
 
  try {
     const deletedAuditorium = await prisma.auditorium.delete({
       where: { auditorium: auditoriumId },
     });
 
     res.status(200).json(deletedAuditorium);
  } catch (error) {
     console.error('Error deleting auditorium:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
 });
 

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
