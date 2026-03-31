/**
 * Grade Storage with Vercel Blob
 * Free tier: no setup needed, just add BLOB_READ_WRITE_TOKEN env var
 * Get token from: vercel.com > project > Settings > Environment Variables > Add > "BLOB_READ_WRITE_TOKEN"
 */

import { put, list, del } from '@vercel/blob';

const GRADES_KEY = 'biology-eoc-grades.json';
const STUDENTS_KEY = 'biology-eoc-students.json';

// Fallback to in-memory for local dev (when no blob token)
const memStore = {
  grades: [],
  students: [],
};

function hasBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

export async function saveGrade(record) {
  if (!hasBlobToken()) {
    console.log('[Blob] No token, using in-memory fallback');
    memStore.grades.push(record);
    return;
  }

  try {
    // Get existing grades
    const grades = await getGrades();
    grades.push(record);
    
    // Save back to blob
    await put(GRADES_KEY, JSON.stringify(grades), {
      access: 'public',
      addRandomSuffix: false,
    });
    
    console.log('[Blob] Grade saved:', record.studentName, record.percentage + '%');
    
    // Auto-create student if needed
    const students = await getStudents();
    const existing = students.find(s => s.name === record.studentName);
    if (!existing) {
      students.push({
        id: record.studentName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36),
        name: record.studentName,
        createdAt: new Date().toISOString(),
      });
      await put(STUDENTS_KEY, JSON.stringify(students), {
        access: 'public',
        addRandomSuffix: false,
      });
    }
  } catch (err) {
    console.error('[Blob] Save failed:', err);
    // Fallback to memory
    memStore.grades.push(record);
  }
}

export async function getGrades() {
  if (!hasBlobToken()) {
    return memStore.grades;
  }

  try {
    const { blobs } = await list();
    const gradesBlob = blobs.find(b => b.url.includes(GRADES_KEY));
    
    if (!gradesBlob) {
      return [];
    }
    
    const response = await fetch(gradesBlob.url);
    const grades = await response.json();
    return grades || [];
  } catch (err) {
    console.error('[Blob] Get grades failed:', err);
    return memStore.grades;
  }
}

export async function getStudents() {
  if (!hasBlobToken()) {
    return memStore.students;
  }

  try {
    const { blobs } = await list();
    const studentsBlob = blobs.find(b => b.url.includes(STUDENTS_KEY));
    
    if (!studentsBlob) {
      return [];
    }
    
    const response = await fetch(studentsBlob.url);
    const students = await response.json();
    return students || [];
  } catch (err) {
    console.error('[Blob] Get students failed:', err);
    return memStore.students;
  }
}

export async function addStudent(student) {
  if (!hasBlobToken()) {
    memStore.students.push(student);
    return;
  }

  try {
    const students = await getStudents();
    students.push(student);
    await put(STUDENTS_KEY, JSON.stringify(students), {
      access: 'public',
      addRandomSuffix: false,
    });
  } catch (err) {
    console.error('[Blob] Add student failed:', err);
    memStore.students.push(student);
  }
}