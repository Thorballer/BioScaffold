// Fix question formatting - tables, graphs, experiments
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bankPath = join(__dirname, '../data/question-bank.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf-8'));

// Fix specific questions with better formatting
const fixes = {
  // Cell Division - Table format fix
  'q305': {
    text: 'A student observes cells under a microscope and records the following data:\n\n| Phase | Number of Cells |\n|-------|------------------|\n| Interphase | 45 |\n| Prophase | 8 |\n| Metaphase | 3 |\n| Anaphase | 2 |\n| Telophase | 2 |\n\nWhich conclusion is best supported by this data?'
  },
  
  // DNA Content Graph - add proper structure
  'q309': {
    text: 'The graph below shows the relative DNA content in a cell over time during the cell cycle:\n\n📊 DNA doubles during S phase (time 4-8), then halves after division\n\nDuring which time period is the cell in S phase?',
    graphData: {
      type: 'line',
      title: 'DNA Content Over Time',
      points: [
        { label: 'G1', x: 0, y: 100 },
        { label: 'S', x: 4, y: 200 },
        { label: 'G2', x: 8, y: 200 },
        { label: 'M', x: 12, y: 100 }
      ]
    }
  },
  
  // Transport - Graph format
  'q313': {
    text: 'The graph shows the concentration of glucose inside and outside a cell:\n\n📊 Outside: 10% → Inside: 2% initially\n📊 After 30 min: both at 6%\n\nWhich type of transport occurred?'
  },
  
  // Elodea Experiment - better format
  'q316': {
    text: '🔬 Experimental Setup: A student placed Elodea (aquatic plant) cells in three solutions:\n\n| Solution | Observation |\n|----------|-------------|\n| Distilled water | Cells normal, chloroplasts at edges |\n| 5% salt | Chloroplasts toward center, membrane pulled from wall |\n| 10% salt | Cells shriveled, membrane separated from wall |\n\nWhat process explains these observations?'
  },
  
  // Sodium-Potassium Pump - clearer format
  'q317': {
    text: 'The sodium-potassium pump moves ions across the membrane:\n\n📊 3 Na+ OUT / 2 K+ IN per ATP molecule\n\nWhy is this pump essential for nerve cells?'
  },
  
  // Plant Cross - table format
  'q322': {
    text: 'Scientists crossed two plants with different traits:\n\n| Parent | Traits | Genotype |\n|--------|--------|----------|\n| Parent 1 | Tall, yellow | Heterozygous (TtYy) |\n| Parent 2 | Short, green | Homozygous recessive (ttyy) |\n\nResults:\n| Offspring Type | Percentage |\n|----------------|------------|\n| Tall/yellow | 25% |\n| Tall/green | 25% |\n| Short/yellow | 25% |\n| Short/green | 25% |\n\nWhat genetic principle explains the 25% ratio for each phenotype?'
  },
  
  // Codon Table - proper format
  'q328': {
    text: 'Use the codon table to translate mRNA:\n\n| Codon | Amino Acid |\n|-------|------------|\n| AUG | Methionine (Start) |\n| UUU/UUC | Phenylalanine |\n| AAA/AAG | Lysine |\n| GGU/GGC/GGA/GGG | Glycine |\n\nmRNA sequence: AUG-AAA-GGU\n\nWhat amino acid sequence is produced?'
  },
  
  // DNA Extraction - table format  
  'q330': {
    text: '🔬 DNA extraction experiment results:\n\n| Sample | Source | DNA Amount (μg) |\n|--------|--------|-----------------|\n| A | Strawberry | 25 |\n| B | Banana | 15 |\n| C | Human cheek cell | 3 |\n\nWhy does Sample A yield the most DNA?'
  },
  
  // Enzyme pH table
  'q349': {
    text: 'Enzyme activity measured at different pH levels:\n\n| pH | Enzyme A Activity | Enzyme B Activity |\n|----|-------------------|-------------------|\n| 2 | 80% | 0% |\n| 4 | 60% | 10% |\n| 6 | 20% | 50% |\n| 7 | 0% | 80% |\n| 8 | 0% | 100% |\n| 10 | 0% | 60% |\n\nWhich enzyme would work best in the stomach, and why?'
  },
  
  // Cell comparison table
  'q351': {
    text: 'Comparison of three cell types:\n\n| Feature | Cell A | Cell B | Cell C |\n|---------|--------|--------|--------|\n| Nucleus | Yes | No | Yes |\n| Mitochondria | Present | Absent | Absent |\n| Cell Wall | Absent | Present | Present |\n| Chloroplasts | Absent | Absent | Present |\n\nWhich cell types are prokaryotic and eukaryotic respectively?'
  },
  
  // Organism classification table
  'q353': {
    text: 'Characteristics of three organisms:\n\n| Feature | Organism X | Organism Y | Organism Z |\n|---------|------------|------------|------------|\n| Backbone | Yes | No | Yes |\n| Feathers | No | No | Yes |\n| Mammary glands | Yes | No | No |\n| Lays eggs | No | Yes | Yes |\n\nWhich organism is a mammal, bird, and invertebrate respectively?'
  },
  
  // Water quality table
  'q355': {
    text: '🔬 Water quality measurements before and after factory construction:\n\n| Parameter | Before Factory | After Factory |\n|-----------|----------------|---------------|\n| Dissolved O₂ (mg/L) | 8 | 4 |\n| Fish species count | 12 | 3 |\n| Nitrate level (mg/L) | 0.5 | 5 |\n| Temperature (°C) | 18 | 25 |\n\nWhich factor most likely caused the decrease in fish species?'
  },
  
  // Deer population table
  'q339': {
    text: 'Population data for deer in a forest over 5 years:\n\n| Year | Deer Population | Available Food (tons) |\n|------|-----------------|----------------------|\n| 1 | 100 | 500 |\n| 2 | 150 | 400 |\n| 3 | 200 | 300 |\n| 4 | 180 | 250 |\n| 5 | 150 | 200 |\n\nWhat limiting factor is most likely controlling the deer population?'
  },
  
  // Energy flow table
  'q340': {
    text: 'Energy flow through trophic levels in a grassland ecosystem:\n\n| Trophic Level | Energy (kcal/m²/year) |\n|---------------|----------------------|\n| Producers (grass) | 10,000 |\n| Primary consumers (rabbits) | 1,000 |\n| Secondary consumers (foxes) | 100 |\n| Tertiary consumers (hawks) | 10 |\n\nWhat explains the 90% energy loss between each trophic level?'
  },
  
  // Pea plant crosses table
  'q341': {
    text: 'Results from crossing tall (T) and short (t) pea plants:\n\n| Parent Cross | Offspring Tall | Offspring Short |\n|--------------|----------------|-----------------|\n| TT × tt | 100% | 0% |\n| Tt × tt | 50% | 50% |\n| Tt × Tt | 75% | 25% |\n\nWhich cross represents a test cross used to determine genotype?'
  },
  
  // Photosynthesis light graph
  'q337': {
    text: '📊 Oxygen production by aquatic plants under different light intensities:\n\n- 0 light: O₂ decreases (respiration only)\n- Low light: O₂ production = consumption (compensation point)\n- Medium light: O₂ production > consumption\n- High light: O₂ production plateaus\n\nWhat is happening at the compensation point?'
  },
  
  // CO2 uptake table
  'q338': {
    text: 'Carbon dioxide uptake by plants at different temperatures:\n\n| Temperature (°C) | CO₂ Uptake (mg/hr) |\n|------------------|--------------------|\n| 10 | 5 |\n| 20 | 15 |\n| 30 | 25 |\n| 35 | 20 |\n| 40 | 8 |\n\nWhy does CO₂ uptake decrease above 30°C?'
  },
  
  // Population growth curve
  'q343': {
    text: '📊 Population growth phases over time:\n\n- Phase A: Slow growth, few individuals\n- Phase B: Rapid exponential growth\n- Phase C: Growth slows, stabilizes around 500\n- Phase D: Stable at 500\n\nWhat term describes Phase C where growth slows?'
  },
  
  // Bacterial resistance graph  
  'q347': {
    text: '📊 Frequency of antibiotic-resistant gene in bacteria over generations:\n\n- Gen 0: 5% resistant\n- Gen 5: 20% resistant\n- Gen 10: 45% resistant\n- Gen 15: 70% resistant\n- Gen 20: 85% resistant\n\nPopulation continuously exposed to antibiotic. Which process explains this pattern?'
  },
  
  // Species diversity graph
  'q352': {
    text: '📊 Species diversity after forest fire:\n\n- Year 0: 0 species (all destroyed)\n- Year 5: 15 species\n- Year 10: 30 species\n- Year 20: 45 species\n- Year 50: 50 species (stable)\n- Year 100: 50 species\n\nWhich type of succession is occurring?'
  },
  
  // CO2 atmospheric graph
  'q354': {
    text: '📊 Atmospheric CO₂ concentration over 100 years:\n\n- 1900: 280 ppm\n- 1950: 310 ppm\n- 2000: 370 ppm\n- 2020: 420 ppm\n\nRate of increase is accelerating. Which human activities contribute most?'
  },
  
  // Enzyme saturation graph
  'q350': {
    text: '📊 Substrate concentration vs. enzyme reaction rate:\n\n- Low substrate (0-2 mM): Rate increases linearly\n- Medium substrate (2-5 mM): Rate increases more slowly\n- High substrate (5+ mM): Rate plateaus\n\nWhat causes the rate to plateau?'
  },
  
  // Antibiotic experiment - clear format
  'q340': {
    text: '🔬 Scientists tested antibiotic resistance in bacteria:\n\n| Day | Bacteria Killed |\n|-----|------------------|\n| 1 | 99% |\n| 5 | 80% |\n| 10 | 50% |\n| 20 | 10% |\n\nSurviving bacteria passed resistance to offspring.\n\nWhich mechanism best explains these results?'
  },
  
  // mRNA export experiment
  'q330': {
    text: '🔬 Cells were treated with a chemical that prevents mRNA from leaving the nucleus.\n\nObservation: No protein synthesis occurred in cytoplasm.\n\nWhich process would be most directly affected?'
  }
};

// Apply fixes to questions
let fixedCount = 0;
bank.questions = bank.questions.map(q => {
  if (fixes[q.id]) {
    fixedCount++;
    const fix = fixes[q.id];
    
    // Replace text if provided
    if (fix.text) {
      q.text = fix.text;
    }
    
    // Add graphData if provided
    if (fix.graphData) {
      q.graphData = fix.graphData;
    }
  }
  return q;
});

// Also clean up any remaining [GRAPH], [TABLE], [EXPERIMENT] markers
bank.questions = bank.questions.map(q => {
  // Remove markers but keep content
  q.text = q.text
    .replace('[GRAPH]', '📊')
    .replace('[TABLE]', '')
    .replace('[EXPERIMENT]', '🔬')
    .replace(/\[EXPERIMENT DESIGN\]/gi, '🔬 Experimental Design:');
  
  return q;
});

// Write updated bank
writeFileSync(bankPath, JSON.stringify(bank, null, 2));

console.log(`✅ Fixed ${fixedCount} questions with proper formatting`);
console.log(`📊 Total questions: ${bank.totalQuestions}`);
console.log('\nTables now render as proper HTML tables');
console.log('Graphs show visual indicators (📊)');
console.log('Experiments show clear markers (🔬)');