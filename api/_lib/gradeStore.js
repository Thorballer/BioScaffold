/**
 * Grade Storage Service
 * Uses Vercel KV (Redis) when available, falls back to in-memory for local dev.
 * 
 * For Vercel KV setup:
 *   1. Go to Vercel Dashboard > Storage > Create > KV
 *   2. Link to your project — env vars are auto-set
 *   3. Run: vercel env pull .env.local
 */

let store = null;
let useKV = false;

// In-memory fallback
const memStore = {
    grades: [],
    students: [],
};

async function initStore() {
    if (store !== null) return;
    try {
        const kv = await import('@vercel/kv');
        store = kv;
        useKV = true;
    } catch {
        // @vercel/kv not available — use in-memory 
        store = memStore;
        useKV = false;
    }
}

export async function saveGrade(record) {
    await initStore();
    if (useKV) {
        const grades = (await store.get('grades')) || [];
        grades.push(record);
        await store.set('grades', grades);

        // Auto-create student entry if needed
        const students = (await store.get('students')) || [];
        const existing = students.find(s => s.name === record.studentName);
        if (!existing) {
            students.push({
                id: record.studentName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36),
                name: record.studentName,
                createdAt: new Date().toISOString(),
            });
            await store.set('students', students);
        }
    } else {
        memStore.grades.push(record);
        const existing = memStore.students.find(s => s.name === record.studentName);
        if (!existing) {
            memStore.students.push({
                id: record.studentName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36),
                name: record.studentName,
                createdAt: new Date().toISOString(),
            });
        }
    }
}

export async function getGrades() {
    await initStore();
    if (useKV) {
        return (await store.get('grades')) || [];
    }
    return memStore.grades;
}

export async function getStudents() {
    await initStore();
    if (useKV) {
        return (await store.get('students')) || [];
    }
    return memStore.students;
}

export async function addStudent(student) {
    await initStore();
    if (useKV) {
        const students = (await store.get('students')) || [];
        students.push(student);
        await store.set('students', students);
    } else {
        memStore.students.push(student);
    }
}
