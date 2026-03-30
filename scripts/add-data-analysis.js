// Add More Data Analysis Questions for Florida EOC Standard
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bankPath = join(__dirname, '../data/question-bank.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf-8'));

const newQuestions = [];

// More Data Analysis Questions with Graphs/Tables
const dataAnalysisQs = [
    // Photosynthesis/Respiration Data
    {
        id: `q${bank.questions.length + 1}`,
        standard: 'SC.912.L.14.7',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Moderate',
        text: '[GRAPH] A graph shows oxygen production by aquatic plants under different light intensities:\n- 0 light: O₂ decreases (respiration only)\n- Low light: O₂ production = consumption\n- Medium light: O₂ production > consumption (net positive)\n- High light: O₂ production plateaus\n\nWhat is happening at the point where O₂ production equals consumption?',
        options: [
            'The plant is at its compensation point—photosynthesis equals respiration, no net gas exchange',
            'Photosynthesis has stopped completely',
            'The plant is dying',
            'Only respiration is occurring'
        ],
        correctAnswer: 0,
        explanation: 'The compensation point occurs when photosynthetic O₂ production equals respiratory O₂ consumption. Below this light level, respiration exceeds photosynthesis (net O₂ consumption). Above it, net O₂ is produced.'
    },
    {
        id: `q${bank.questions.length + 2}`,
        standard: 'SC.912.L.14.7',
        category: 'Molecular and Cellular Biology',
        difficulty: 'High',
        text: '[TABLE] Carbon dioxide uptake by plants at different temperatures:\n| Temperature (°C) | CO₂ Uptake (mg/hr) |\n| 10 | 5 |\n| 20 | 15 |\n| 30 | 25 |\n| 35 | 20 |\n| 40 | 8 |\n\nWhy does CO₂ uptake decrease above 30°C?',
        options: [
            'Enzymes involved in photosynthesis begin denaturing at high temperatures',
            'Plants stop photosynthesizing when warm',
            'CO₂ becomes unavailable at high temperature',
            'More respiration occurs at low temperature'
        ],
        correctAnswer: 0,
        explanation: 'Photosynthesis relies on enzymes (Rubisco, ATP synthase). Above optimal temperature (~30°C for many plants), enzymes denature, reducing efficiency. The 40°C value shows severe enzyme damage.'
    },
    // Population Ecology Data
    {
        id: `q${bank.questions.length + 3}`,
        standard: 'SC.912.L.17.5',
        category: 'Organisms, Populations, and Ecosystems',
        difficulty: 'Moderate',
        text: '[GRAPH] A population growth curve shows:\n- Phase A: Slow growth, few individuals\n- Phase B: Rapid exponential growth\n- Phase C: Growth slows, population fluctuates around 500\n- Phase D: Stable at 500\n\nWhat term describes Phase C where growth slows and stabilizes?',
        options: [
            'Carrying capacity—the maximum population the environment can sustain long-term',
            'Population crash',
            'Extinction phase',
            'Migration period'
        ],
        correctAnswer: 0,
        explanation: 'Carrying capacity (K) is the maximum population an environment can support with available resources. As population approaches K, limiting factors (food, space, disease) slow growth until it stabilizes.'
    },
    {
        id: `q${bank.questions.length + 4}`,
        standard: 'SC.912.L.17.11',
        category: 'Organisms, Populations, and Ecosystems',
        difficulty: 'Moderate',
        text: '[TABLE] Energy flow through trophic levels in a grassland ecosystem:\n| Trophic Level | Energy (kcal/m²/year) |\n| Producers (grass) | 10,000 |\n| Primary consumers (rabbits) | 1,000 |\n| Secondary consumers (foxes) | 100 |\n| Tertiary consumers (hawks) | 10 |\n\nWhat explains the 90% energy loss between each trophic level?',
        options: [
            'Energy is lost as heat through metabolism and incomplete consumption/digestion at each level',
            'Organisms at higher levels are smaller',
            'Producers create extra energy',
            'Measurement errors'
        ],
        correctAnswer: 0,
        explanation: 'Only ~10% of energy transfers between trophic levels. Organisms use most energy for metabolism (lost as heat), some biomass is not eaten, and digestion is incomplete. This limits food chain length (typically 4-5 levels).'
    },
    // Genetics Data Analysis
    {
        id: `q${bank.questions.length + 5}`,
        standard: 'SC.912.L.16.1',
        category: 'Genetics and Heredity',
        difficulty: 'Moderate',
        text: '[TABLE] Results from crossing tall (T) and short (t) pea plants:\n| Parent Cross | Offspring Tall | Offshort Short |\n| TT × tt | 100% | 0% |\n| Tt × tt | 50% | 50% |\n| Tt × Tt | 75% | 25% |\n\nWhich cross represents a test cross used to determine if a tall plant is homozygous or heterozygous?',
        options: [
            'Tt × tt (crossing with homozygous recessive reveals parent\'s genotype)',
            'TT × tt',
            'Tt × Tt',
            'tt × tt'
        ],
        correctAnswer: 0,
        explanation: 'A test cross mates an unknown genotype with homozygous recessive (tt). If unknown is TT, all offspring are tall. If unknown is Tt, half are tall, half short. The 50/50 ratio reveals heterozygosity.'
    },
    {
        id: `q${bank.questions.length + 6}`,
        standard: 'SC.912.L.16.17',
        category: 'Genetics and Heredity',
        difficulty: 'High',
        text: '[GRAPH] A pedigree chart shows inheritance of a genetic disorder:\n- Generation I: Father affected (filled square), Mother unaffected (open circle)\n- Generation II: All 4 children unaffected (2 males, 2 females)\n- Generation III: 2 grandchildren affected (one male, one female) from unaffected parents\n\nWhat inheritance pattern is most likely?',
        options: [
            'Autosomal recessive—affected individuals have homozygous recessive genotype; carriers are unaffected',
            'Autosomal dominant—all affected individuals would pass trait to offspring',
            'X-linked recessive—only males would be affected',
            'X-linked dominant—all daughters of affected father would be affected'
        ],
        correctAnswer: 0,
        explanation: 'Autosomal recessive traits can "skip" generations. Generation II children are unaffected carriers (heterozygous). When two carriers mate, ~25% of offspring are affected (homozygous recessive). Both sexes can be affected equally.'
    },
    // Evolution Data
    {
        id: `q${bank.questions.length + 7}`,
        standard: 'SC.912.L.15.1',
        category: 'Classification, Heredity, and Evolution',
        difficulty: 'High',
        text: '[GRAPH] A graph shows frequency of a antibiotic-resistant gene in bacteria over generations:\n- Gen 0: 5% have resistance gene\n- Gen 5: 20% have resistance gene\n- Gen 10: 45% have resistance gene\n- Gen 15: 70% have resistance gene\n- Gen 20: 85% have resistance gene\n\nThe population was continuously exposed to the antibiotic. Which process explains this pattern?',
        options: [
            'Natural selection—bacteria with resistance genes survive and reproduce more than non-resistant bacteria',
            'Random mutation creating new genes',
            'Bacteria learning to resist the antibiotic',
            'Gene flow from another population'
        ],
        correctAnswer: 0,
        explanation: 'When antibiotic is present, resistant bacteria have a survival advantage. They reproduce more, passing resistance genes to offspring. Over generations, the resistance allele frequency increases—a classic natural selection example.'
    },
    // Enzyme Data
    {
        id: `q${bank.questions.length + 8}`,
        standard: 'SC.912.L.18.12',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Moderate',
        text: '[TABLE] Enzyme activity at different pH levels:\n| pH | Enzyme A Activity | Enzyme B Activity |\n| 2 | 80% | 0% |\n| 4 | 60% | 10% |\n| 6 | 20% | 50% |\n| 7 | 0% | 80% |\n| 8 | 0% | 100% |\n| 10 | 0% | 60% |\n\nWhich enzyme would work best in the stomach, and why?',
        options: [
            'Enzyme A—stomach pH is ~2, matching Enzyme A\'s optimal pH',
            'Enzyme B—it has higher maximum activity',
            'Both work equally well in stomach',
            'Neither enzyme works in stomach'
        ],
        correctAnswer: 0,
        explanation: 'The stomach has acidic pH (~2) due to gastric acid. Enzyme A shows maximum activity (80%) at pH 2, making it adapted for stomach conditions. This is characteristic of pepsin, a stomach protease.'
    },
    {
        id: `q${bank.questions.length + 9}`,
        standard: 'SC.912.L.18.12',
        category: 'Molecular and Cellular Biology',
        difficulty: 'High',
        text: '[GRAPH] Substrate concentration vs. enzyme reaction rate shows:\n- Rate increases linearly at low substrate (0-2 mM)\n- Rate increases more slowly at medium substrate (2-5 mM)\n- Rate plateaus at high substrate (5+ mM)\n\nWhat causes the rate to plateau at high substrate concentration?',
        options: [
            'Enzyme saturation—all active sites are occupied; adding more substrate cannot increase rate',
            'Substrate inhibits the enzyme at high concentration',
            'Enzyme is denatured by excess substrate',
            'The reaction reaches equilibrium'
        ],
        correctAnswer: 0,
        explanation: 'At low substrate, rate increases because more enzyme-substrate complexes form. At saturation point, all enzyme active sites are occupied (working at maximum velocity Vmax). Additional substrate has nowhere to bind.'
    },
    // Cell Biology Data
    {
        id: `q${bank.questions.length + 10}`,
        standard: 'SC.912.L.14.3',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Moderate',
        text: '[TABLE] Comparison of three cell types:\n| Feature | Cell A | Cell B | Cell C |\n| Nucleus | Present | Absent | Present |\n| Mitochondria | Present | Absent | Absent |\n| Cell Wall | Absent | Present | Present |\n| Chloroplasts | Absent | Absent | Present |\n\nWhich cell types are prokaryotic and eukaryotic respectively?',
        options: [
            'Prokaryotic: Cell B (no nucleus); Eukaryotic: Cells A and C (have nucleus)',
            'Prokaryotic: Cells A and C; Eukaryotic: Cell B',
            'All are prokaryotic',
            'All are eukaryotic'
        ],
        correctAnswer: 0,
        explanation: 'Prokaryotes (bacteria like Cell B) lack nucleus and membrane-bound organelles. Eukaryotes (Cells A and C) have nucleus. Cell A is an animal cell (no wall/chloroplasts); Cell C is a plant cell (has wall, chloroplasts).'
    },
    // Ecological Succession
    {
        id: `q${bank.questions.length + 11}`,
        standard: 'SC.912.L.17.9',
        category: 'Organisms, Populations, and Ecosystems',
        difficulty: 'High',
        text: '[GRAPH] Species diversity over time after forest fire:\n- Year 0: Diversity = 0 (all destroyed)\n- Year 5: Diversity = 15 species\n- Year 10: Diversity = 30 species\n- Year 20: Diversity = 45 species\n- Year 50: Diversity = 50 species\n- Year 100: Diversity = 50 species (stable)\n\nWhich type of succession is occurring, and what is the climax community?',
        options: [
            'Secondary succession (soil present after fire); climax community at 50 species when diversity stabilizes',
            'Primary succession (starting on bare rock)',
            'No succession—species spontaneously appear',
            'Climax community occurs at Year 10'
        ],
        correctAnswer: 0,
        explanation: 'Secondary succession occurs when disturbance (fire) destroys existing community but leaves soil intact. Recovery is faster than primary succession. Climax community (stable, mature ecosystem) forms when species diversity stabilizes (~Year 50).'
    },
    // DNA/Biotechnology Data
    {
        id: `q${bank.questions.length + 12}`,
        standard: 'SC.912.L.16.3',
        category: 'Genetics and Heredity',
        difficulty: 'High',
        text: '[EXPERIMENT] DNA extraction results from three samples:\n| Sample | Source | DNA Amount (μg) |\n| A | Strawberry | 25 |\n| B | Banana | 15 |\n| C | Human cheek cell | 3 |\n\nWhy does Sample A yield the most DNA?',
        options: [
            'Strawberries have 8 sets of chromosomes (octoploid) vs. bananas (triploid, 3 sets) and humans (diploid, 2 sets)',
            'Strawberries are larger than bananas and human cells',
            'Human cells have no DNA',
            'Banana DNA is harder to extract'
        ],
        correctAnswer: 0,
        explanation: 'Strawberries are octoploid (8n, 8 sets of chromosomes), yielding more DNA per cell. Bananas are often triploid (3n). Humans are diploid (2n). Polyploid organisms provide more DNA for extraction experiments.'
    },
    // Classification Data
    {
        id: `q${bank.questions.length + 13}`,
        standard: 'SC.912.L.15.6',
        category: 'Classification, Heredity, and Evolution',
        difficulty: 'Moderate',
        text: '[TABLE] Characteristics of three organisms:\n| Feature | Organism X | Organism Y | Organism Z |\n| Backbone | Yes | No | Yes |\n| Feathers | No | No | Yes |\n| Mammary glands | Yes | No | No |\n| Lays eggs | No | Yes | Yes |\n\nWhich organism is a mammal, bird, and fish/invertebrate respectively?',
        options: [
            'Mammal: X (mammary glands); Bird: Z (feathers, lays eggs); Invertebrate: Y (no backbone)',
            'Mammal: Z; Bird: X; Fish: Y',
            'Mammal: Y; Bird: Z; Fish: X',
            'All are mammals'
        ],
        correctAnswer: 0,
        explanation: 'X has mammary glands—defines mammals. Z has feathers and lays eggs—defines birds. Y lacks backbone—defines invertebrates. Backbone + no feathers/mammary glands could indicate fish, reptile, or amphibian.'
    },
    // Human Impact Data
    {
        id: `q${bank.questions.length + 14}`,
        standard: 'SC.912.L.17.20',
        category: 'Organisms, Populations, and Ecosystems',
        difficulty: 'High',
        text: '[GRAPH] Atmospheric CO₂ concentration over 100 years:\n- 1900: 280 ppm\n- 1950: 310 ppm\n- 2000: 370 ppm\n- 2020: 420 ppm\n- Rate of increase accelerating\n\nWhich human activities contribute most to this trend?',
        options: [
            'Burning fossil fuels (releases stored CO₂) and deforestation (removes CO₂-absorbing trees)',
            'Agricultural irrigation',
            'Solar panel installation',
            'Wind energy production'
        ],
        correctAnswer: 0,
        explanation: 'Fossil fuel combustion releases CO₂ trapped for millions of years. Deforestation removes trees that absorb CO₂ through photosynthesis. Both activities increase atmospheric CO₂, contributing to climate change.'
    },
    {
        id: `q${bank.questions.length + 15}`,
        standard: 'SC.912.L.17.20',
        category: 'Organisms, Populations, and Ecosystems',
        difficulty: 'Moderate',
        text: '[TABLE] Water quality measurements in a river before and after factory construction:\n| Parameter | Before Factory | After Factory |\n| Dissolved O₂ (mg/L) | 8 | 4 |\n| Fish species count | 12 | 3 |\n| Nitrate level (mg/L) | 0.5 | 5 |\n| Temperature (°C) | 18 | 25 |\n\nWhich factor most likely caused the decrease in fish species?',
        options: [
            'Low dissolved oxygen (4 mg/L) and high temperature—most fish cannot survive these conditions',
            'Increased nitrate helps fish survive',
            'Temperature has no effect on fish',
            'Dissolved oxygen increased'
        ],
        correctAnswer: 0,
        explanation: 'Factory discharge likely raised temperature and released nutrients (nitrates). Higher temperature decreases oxygen solubility. Low dissolved oxygen (4 mg/L) stresses or kills many fish species. Thermal pollution is a major water quality issue.'
    }
];

newQuestions.push(...dataAnalysisQs);

// Add to bank
bank.questions.push(...newQuestions);
bank.totalQuestions = bank.questions.length;
bank.generatedAt = new Date().toISOString();

// Write updated bank
writeFileSync(bankPath, JSON.stringify(bank, null, 2));

console.log(`\n✅ Added ${newQuestions.length} more data analysis questions`);
console.log(`📊 Total questions: ${bank.totalQuestions}`);
console.log(`📊 Data analysis coverage: ~${Math.round(40/bank.totalQuestions*100)}% (target: 15-20%)`);
console.log('\nRun audit-questions.js to verify final coverage.');