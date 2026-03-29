#!/usr/bin/env node
/**
 * Teacher Dashboard Server Extension
 * Adds authentication, analytics, and export features
 */

import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

const teacherApp = express();
const TEACHER_PORT = process.env.TEACHER_PORT || 3001;

teacherApp.use(express.json());
teacherApp.use(express.static('teacher'));

// Simple session storage (in production, use Redis/database)
const sessions = new Map();
const teachers = new Map();

// Default teacher accounts (in production, use proper auth)
const defaultTeachers = [
    { username: 'admin', password: 'admin123', name: 'Administrator', school: 'Main Campus' },
    { username: 'teacher', password: 'teacher123', name: 'John Smith', school: 'Biology Dept' }
];

defaultTeachers.forEach(t => teachers.set(t.username, { ...t, id: crypto.randomBytes(8).toString('hex') }));

// Student data storage
const studentDataFile = './data/student-progress.json';
if (!existsSync(studentDataFile)) {
    writeFileSync(studentDataFile, JSON.stringify({ students: [], sessions: [] }, null, 2));
}

function getStudentData() {
    return JSON.parse(readFileSync(studentDataFile, 'utf8'));
}

function saveStudentData(data) {
    writeFileSync(studentDataFile, JSON.stringify(data, null, 2));
}

// Auth middleware
function requireAuth(req, res, next) {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !sessions.has(sessionId)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.teacher = sessions.get(sessionId);
    next();
}

// API Routes
teacherApp.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const teacher = teachers.get(username);
    
    if (!teacher || teacher.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const sessionId = crypto.randomBytes(32).toString('hex');
    sessions.set(sessionId, { ...teacher, password: undefined });
    
    // Session expires in 8 hours
    setTimeout(() => sessions.delete(sessionId), 8 * 60 * 60 * 1000);
    
    res.json({ success: true, sessionId, teacher: sessions.get(sessionId) });
});

teacherApp.post('/api/logout', (req, res) => {
    const sessionId = req.headers['x-session-id'];
    if (sessionId) sessions.delete(sessionId);
    res.json({ success: true });
});

teacherApp.get('/api/auth/check', requireAuth, (req, res) => {
    res.json({ authenticated: true, teacher: req.teacher });
});

// Analytics Routes
teacherApp.get('/api/analytics/overview', requireAuth, (req, res) => {
    const data = getStudentData();
    const sessions = data.sessions || [];
    
    const totalSessions = sessions.length;
    const avgScore = sessions.length > 0 
        ? sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length 
        : 0;
    
    const categoryBreakdown = {
        'Molecular and Cellular Biology': { avg: 0, count: 0 },
        'Genetics and Heredity': { avg: 0, count: 0 },
        'Classification, Heredity, and Evolution': { avg: 0, count: 0 },
        'Organisms, Populations, and Ecosystems': { avg: 0, count: 0 }
    };
    
    sessions.forEach(s => {
        if (s.categoryBreakdown) {
            Object.entries(s.categoryBreakdown).forEach(([cat, score]) => {
                if (categoryBreakdown[cat]) {
                    categoryBreakdown[cat].avg += score;
                    categoryBreakdown[cat].count++;
                }
            });
        }
    });
    
    Object.entries(categoryBreakdown).forEach(([cat, data]) => {
        categoryBreakdown[cat].avg = data.count > 0 ? data.avg / data.count : 0;
    });
    
    const difficultyBreakdown = {
        Low: { correct: 0, total: 0 },
        Moderate: { correct: 0, total: 0 },
        High: { correct: 0, total: 0 }
    };
    
    sessions.forEach(s => {
        if (s.difficultyBreakdown) {
            Object.entries(s.difficultyBreakdown).forEach(([diff, data]) => {
                if (difficultyBreakdown[diff]) {
                    difficultyBreakdown[diff].correct += data.correct || 0;
                    difficultyBreakdown[diff].total += data.total || 0;
                }
            });
        }
    });
    
    res.json({
        totalSessions,
        avgScore: Math.round(avgScore * 100) / 100,
        categoryBreakdown,
        difficultyBreakdown,
        recentSessions: sessions.slice(-10).reverse()
    });
});

teacherApp.get('/api/students', requireAuth, (req, res) => {
    const data = getStudentData();
    const students = data.students || [];
    
    const studentStats = students.map(s => {
        const studentSessions = data.sessions.filter(sess => sess.studentId === s.id);
        const avgScore = studentSessions.length > 0
            ? studentSessions.reduce((sum, sess) => sum + (sess.score || 0), 0) / studentSessions.length
            : 0;
        
        return {
            ...s,
            sessionCount: studentSessions.length,
            avgScore: Math.round(avgScore * 100) / 100,
            lastSession: studentSessions.length > 0 ? studentSessions[studentSessions.length - 1].date : null
        };
    });
    
    res.json({ students: studentStats });
});

teacherApp.post('/api/students', requireAuth, (req, res) => {
    const { name, studentId, grade } = req.body;
    const data = getStudentData();
    
    const newStudent = {
        id: studentId || crypto.randomBytes(8).toString('hex'),
        name,
        grade,
        createdAt: new Date().toISOString()
    };
    
    data.students.push(newStudent);
    saveStudentData(data);
    
    res.json({ success: true, student: newStudent });
});

teacherApp.get('/api/sessions', requireAuth, (req, res) => {
    const data = getStudentData();
    const { studentId, limit = 50 } = req.query;
    
    let sessions = data.sessions || [];
    if (studentId) {
        sessions = sessions.filter(s => s.studentId === studentId);
    }
    
    res.json({ sessions: sessions.slice(-parseInt(limit)).reverse() });
});

// Export Routes
teacherApp.get('/api/export/scores', requireAuth, (req, res) => {
    const data = getStudentData();
    const sessions = data.sessions || [];
    
    let csv = 'Student Name,Student ID,Date,Score,Category,Difficulty,Questions Answered\n';
    
    sessions.forEach(s => {
        csv += `"${s.studentName || 'Unknown'}",${s.studentId},${s.date},${s.score || 0},${s.category || 'Mixed'},${s.difficulty || 'Mixed'},${s.questionsAnswered || 0}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=scores.csv');
    res.send(csv);
});

teacherApp.get('/api/export/students', requireAuth, (req, res) => {
    const data = getStudentData();
    const students = data.students || [];
    
    let csv = 'Student Name,Student ID,Grade,Sessions,Avg Score,Created\n';
    
    students.forEach(s => {
        const studentSessions = data.sessions.filter(sess => sess.studentId === s.id);
        const avgScore = studentSessions.length > 0
            ? studentSessions.reduce((sum, sess) => sum + (sess.score || 0), 0) / studentSessions.length
            : 0;
        
        csv += `"${s.name}",${s.id},${s.grade || 'N/A'},${studentSessions.length},${Math.round(avgScore * 100) / 100},${s.createdAt}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    res.send(csv);
});

teacherApp.get('/api/export/summary', requireAuth, (req, res) => {
    const data = getStudentData();
    const sessions = data.sessions || [];
    
    const totalSessions = sessions.length;
    const avgScore = sessions.length > 0 
        ? sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length 
        : 0;
    
    const summary = {
        reportDate: new Date().toISOString(),
        totalSessions,
        averageScore: Math.round(avgScore * 100) / 100,
        totalStudents: data.students?.length || 0,
        categoryPerformance: {},
        difficultyPerformance: {}
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=summary.json');
    res.json(summary);
});

// Record session endpoint (called from main app)
teacherApp.post('/api/sessions/record', (req, res) => {
    const { studentId, studentName, score, categoryBreakdown, difficultyBreakdown, questionsAnswered } = req.body;
    const data = getStudentData();
    
    const session = {
        id: crypto.randomBytes(8).toString('hex'),
        studentId,
        studentName,
        score,
        categoryBreakdown,
        difficultyBreakdown,
        questionsAnswered,
        date: new Date().toISOString()
    };
    
    data.sessions.push(session);
    
    // Auto-create student if doesn't exist
    if (!data.students.find(s => s.id === studentId)) {
        data.students.push({
            id: studentId,
            name: studentName,
            createdAt: new Date().toISOString()
        });
    }
    
    saveStudentData(data);
    res.json({ success: true });
});

teacherApp.listen(TEACHER_PORT, '0.0.0.0', () => {
    console.log(`📚 Teacher Dashboard running on port ${TEACHER_PORT}`);
    console.log(`   http://localhost:${TEACHER_PORT}`);
});
