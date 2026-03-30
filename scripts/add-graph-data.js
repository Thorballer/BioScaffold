// Add real graph data structures to graph questions
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bankPath = join(__dirname, '../data/question-bank.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf-8'));

// Map of question IDs to their graph data
const graphConfigs = {
  // CO2 atmospheric concentration (q354)
  'q354': {
    type: 'line',
    title: 'Atmospheric CO₂ (ppm) Over Time',
    data: [
      { label: '1900', value: 280 },
      { label: '1950', value: 310 },
      { label: '2000', value: 370 },
      { label: '2020', value: 420 }
    ],
    xAxisLabel: 'Year',
    yAxisLabel: 'CO₂ (ppm)',
    showTrend: true
  },
  
  // Antibiotic resistance (q347)
  'q347': {
    type: 'line',
    title: 'Antibiotic Resistance Gene Frequency',
    data: [
      { label: 'Gen 0', value: 5 },
      { label: 'Gen 5', value: 20 },
      { label: 'Gen 10', value: 45 },
      { label: 'Gen 15', value: 70 },
      { label: 'Gen 20', value: 85 }
    ],
    xAxisLabel: 'Generation',
    yAxisLabel: '% Resistant',
    showTrend: true
  },
  
  // Species diversity after fire (q352)
  'q352': {
    type: 'line',
    title: 'Species Diversity After Forest Fire',
    data: [
      { label: 'Yr 0', value: 0 },
      { label: 'Yr 5', value: 15 },
      { label: 'Yr 10', value: 30 },
      { label: 'Yr 20', value: 45 },
      { label: 'Yr 50', value: 50 },
      { label: 'Yr 100', value: 50 }
    ],
    xAxisLabel: 'Years After Fire',
    yAxisLabel: 'Species Count',
    showTrend: true
  },
  
  // Substrate vs enzyme rate (q350)
  'q350': {
    type: 'line',
    title: 'Enzyme Reaction Rate vs Substrate',
    data: [
      { label: '0mM', value: 0 },
      { label: '1mM', value: 40 },
      { label: '2mM', value: 75 },
      { label: '3mM', value: 90 },
      { label: '5mM', value: 98 },
      { label: '7mM', value: 100 },
      { label: '10mM', value: 100 }
    ],
    xAxisLabel: 'Substrate Concentration',
    yAxisLabel: 'Reaction Rate (%)',
    showTrend: false
  },
  
  // Population growth phases (q343)
  'q343': {
    type: 'line',
    title: 'Population Growth Over Time',
    data: [
      { label: 'Phase A', value: 50 },
      { label: 'Phase B', value: 300 },
      { label: 'Phase C', value: 480 },
      { label: 'Phase D', value: 500 }
    ],
    xAxisLabel: 'Time',
    yAxisLabel: 'Population',
    showTrend: true
  },
  
  // Oxygen production light intensity (q337)
  'q337': {
    type: 'line',
    title: 'O₂ Production vs Light Intensity',
    data: [
      { label: '0', value: -10 },
      { label: 'Low', value: 0 },
      { label: 'Medium', value: 50 },
      { label: 'High', value: 60 }
    ],
    xAxisLabel: 'Light Intensity',
    yAxisLabel: 'O₂ Rate',
    showTrend: false
  },
  
  // CO2 uptake temperature (q338)
  'q338': {
    type: 'bar',
    title: 'CO₂ Uptake at Different Temperatures',
    data: [
      { label: '10°C', value: 5 },
      { label: '20°C', value: 15 },
      { label: '30°C', value: 25 },
      { label: '35°C', value: 20 },
      { label: '40°C', value: 8 }
    ],
    xAxisLabel: 'Temperature',
    yAxisLabel: 'CO₂ (mg/hr)',
    showTrend: false
  }
};

// Apply graph data to questions
let addedCount = 0;
bank.questions = bank.questions.map(q => {
  if (graphConfigs[q.id]) {
    addedCount++;
    q.graphData = graphConfigs[q.id];
    // Clean up text to remove inline data
    q.text = q.text.replace(/\n-\s*(.+?):\s*\d+/g, '');
    q.text = q.text.replace(/\n\n📊/, '');
    q.text = q.text.trim();
  }
  return q;
});

// Write updated bank
writeFileSync(bankPath, JSON.stringify(bank, null, 2));

console.log(`✅ Added real graph data to ${addedCount} questions`);
console.log(`📊 Graphs will now render as actual SVG visualizations`);
console.log('\nGraph types: line charts (trends), bar charts (comparisons)');