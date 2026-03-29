#!/usr/bin/env node
import { writeFileSync, readFileSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const DATA_FILE = './data/question-bank.json';
const EMBED_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const EMBED_MODEL = 'nomic-embed-text';

console.log('🔗 Starting embedding generation...\n');

// Load questions
const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
const questions = data.questions;

console.log(`📊 Processing ${questions.length} questions\n`);

// Embed function using fetch
async function embed(text) {
    const prompt = `${data.embeddingModel || 'nomic-embed-text'} ${text}`;
    try {
        const response = await fetch(`${EMBED_URL}/api/embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: EMBED_MODEL, prompt })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        return result.embedding;
    } catch (err) {
        console.error('Embed error:', err.message);
        return [];
    }
}

// Process in batches with progress
let completed = 0;
let errors = 0;

async function processBatch(batch) {
    const results = [];
    for (const q of batch) {
        const embedText = `${q.category} ${q.difficulty} ${(q.themes || []).join(' ')} ${q.text}`;
        const embedding = await embed(embedText);
        if (embedding.length > 0) {
            q.embedding = embedding;
            completed++;
        } else {
            errors++;
            q.embedding = new Array(768).fill(0);
        }
        if (completed % 50 === 0) {
            process.stdout.write(`\r✅ ${completed}/${questions.length} (${errors} errors)`);
        }
    }
    return results;
}

// Main processing
async function main() {
    const batchSize = 10;
    for (let i = 0; i < questions.length; i += batchSize) {
        const batch = questions.slice(i, i + batchSize);
        await processBatch(batch);
    }
    
    console.log(`\n\n✅ Completed: ${completed}/${questions.length}`);
    console.log(`❌ Errors: ${errors}`);
    
    // Save updated file
    data.totalQuestions = questions.length;
    data.questions = questions;
    data.embeddingsComplete = new Date().toISOString();
    
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`\n💾 Saved to ${DATA_FILE}`);
    console.log(`📊 File size: ${(require('fs').statSync(DATA_FILE).size / 1024 / 1024).toFixed(2)} MB\n`);
}

main().catch(console.error);
