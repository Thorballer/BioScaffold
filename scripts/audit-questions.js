// Audit Florida Biology EOC Question Bank
import questionBank from '../data/question-bank.json' with { type: 'json' };

console.log('\n=== FLORIDA BIOLOGY EOC QUESTION BANK AUDIT ===\n');

// Standards covered
const standards = [...new Set(questionBank.questions.map(q => q.standard))];
console.log(`Standards Covered: ${standards.length}`);
standards.sort().forEach(s => {
    const count = questionBank.questions.filter(q => q.standard === s).length;
    console.log(`  ${s}: ${count} questions`);
});

// Florida EOC Required Benchmarks (per CPALMS)
const requiredBenchmarks = {
    'SC.912.L.14.1': 'Cell Theory - REQUIRED',
    'SC.912.L.14.3': 'Cell Structure & Function - REQUIRED',
    'SC.912.L.14.7': 'Photosynthesis & Respiration - REQUIRED',
    'SC.912.L.14.10': 'Cell Division/Mitosis - CHECK',
    'SC.912.L.14.26': 'Transport - CHECK',
    'SC.912.L.15.1': 'Evolution/Natural Selection - REQUIRED',
    'SC.912.L.15.6': 'Classification - REQUIRED',
    'SC.912.L.15.8': 'Origin of Life - REQUIRED',
    'SC.912.L.15.13': 'Fossil Evidence - REQUIRED',
    'SC.912.L.16.1': 'Mendel/Heredity - REQUIRED',
    'SC.912.L.16.2': 'Sexual Reproduction - CHECK',
    'SC.912.L.16.3': 'DNA Replication - REQUIRED',
    'SC.912.L.16.8': 'Genetic Engineering - CHECK',
    'SC.912.L.16.9': 'Protein Synthesis - CHECK',
    'SC.912.L.16.10': 'Biotechnology - REQUIRED',
    'SC.912.L.16.17': 'Mutations - REQUIRED',
    'SC.912.L.17.5': 'Populations/Ecosystems - REQUIRED',
    'SC.912.L.17.9': 'Symbiosis/Succession - REQUIRED',
    'SC.912.L.17.11': 'Energy Flow - REQUIRED',
    'SC.912.L.17.20': 'Human Impact - REQUIRED',
    'SC.912.L.18.1': 'Matter/Energy - REQUIRED',
    'SC.912.L.18.12': 'Enzymes - REQUIRED'
};

console.log('\n=== MISSING STANDARDS ===\n');
Object.keys(requiredBenchmarks).forEach(s => {
    if (!standards.includes(s)) {
        console.log(`⚠️  ${s}: ${requiredBenchmarks[s]} - MISSING`);
    }
});

// Question type analysis
const dataAnalysisQs = questionBank.questions.filter(q => 
    q.text.toLowerCase().includes('graph') ||
    q.text.toLowerCase().includes('table') ||
    q.text.toLowerCase().includes('chart') ||
    q.text.toLowerCase().includes('data') ||
    q.text.toLowerCase().includes('results') ||
    q.text.toLowerCase().includes('experiment') ||
    q.text.toLowerCase().includes('shows')
);
console.log(`\n=== DATA ANALYSIS QUESTIONS ===\n`);
console.log(`Data interpretation questions: ${dataAnalysisQs.length} (${Math.round(dataAnalysisQs.length/questionBank.totalQuestions*100)}%)`);
console.log(`Florida EOC target: 15-20%`);

// Check for graph/table reference patterns
const hasGraphPattern = questionBank.questions.filter(q => 
    /\[graph\]|\[table\]|\[chart\]|figure \d|table \d|the graph|the table/i.test(q.text)
);
console.log(`Questions with explicit graph/table refs: ${hasGraphPattern.length}`);

// Check difficulty per standard
console.log(`\n=== DIFFICULTY BY STANDARD ===\n`);
standards.forEach(s => {
    const qs = questionBank.questions.filter(q => q.standard === s);
    const byDiff = {
        Low: qs.filter(q => q.difficulty === 'Low').length,
        Moderate: qs.filter(q => q.difficulty === 'Moderate').length,
        High: qs.filter(q => q.difficulty === 'High').length
    };
    console.log(`${s}: Low(${byDiff.Low}) Mod(${byDiff.Moderate}) High(${byDiff.High})`);
});

// Check for key Florida EOC concepts
console.log(`\n=== KEY CONCEPT COVERAGE ===\n`);
const keyConcepts = [
    { name: 'Punnett squares', pattern: /punnett|genotype|phenotype|allele/i },
    { name: 'Food webs/chains', pattern: /food web|food chain|trophic|producer|consumer|decomposer/i },
    { name: 'Cell transport', pattern: /osmosis|diffusion|active transport|passive transport|membrane/i },
    { name: 'DNA processes', pattern: /dna replication|transcription|translation|protein synthesis/i },
    { name: 'Evolution evidence', pattern: /fossil|homologous|vestigial|comparative anatomy|embryology/i },
    { name: 'Experimental design', pattern: /hypothesis|variable|control group|experimental group|procedure/i },
    { name: 'Enzyme function', pattern: /enzyme|substrate|active site|catalyst|denature/i },
    { name: 'Photosynthesis', pattern: /photosynthesis|chloroplast|light-dependent|calvin cycle/i },
    { name: 'Respiration', pattern: /respiration|mitochondria|glycolysis|krebs|atp/i }
];

keyConcepts.forEach(c => {
    const matches = questionBank.questions.filter(q => c.pattern.test(q.text)).length;
    console.log(`${c.name}: ${matches} questions`);
});

console.log('\n=== RECOMMENDATIONS ===\n');
const missingStandards = Object.keys(requiredBenchmarks).filter(s => !standards.includes(s));
if (missingStandards.length > 0) {
    console.log('1. Add questions for missing standards:');
    missingStandards.forEach(s => console.log(`   - ${s}`));
}

if (dataAnalysisQs.length < 40) {
    console.log(`\n2. Add ${40 - dataAnalysisQs.length} data analysis questions with graphs/tables`);
}

const expDesignQs = questionBank.questions.filter(q => 
    /hypothesis|variable|control|experiment/i.test(q.text)
);
if (expDesignQs.length < 15) {
    console.log(`\n3. Add more experimental design questions (${expDesignQs.length} currently)`);
}

console.log('\n=== AUDIT COMPLETE ===\n');