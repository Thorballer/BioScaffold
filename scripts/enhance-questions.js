// Enhance Question Bank for Florida Biology EOC Standards
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bankPath = join(__dirname, '../data/question-bank.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf-8'));

const newQuestions = [];

// ========== SC.912.L.14.10: Cell Division/Mitosis (MISSING) ==========
const mitosisQuestions = [
    {
        id: `q${bank.questions.length + 1}`,
        standard: 'SC.912.L.14.10',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Low',
        text: 'What is the purpose of mitosis in cells?',
        options: [
            'To produce two genetically identical daughter cells for growth and repair',
            'To produce four genetically different cells for reproduction',
            'To reduce the chromosome number by half',
            'To combine genetic material from two parents'
        ],
        correctAnswer: 0,
        explanation: 'Mitosis produces two diploid daughter cells that are genetically identical to the parent cell. It is used for growth, tissue repair, and asexual reproduction in single-celled organisms.'
    },
    {
        id: `q${bank.questions.length + 2}`,
        standard: 'SC.912.L.14.10',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Low',
        text: 'During which phase of mitosis do chromosomes first become visible under a microscope?',
        options: [
            'Prophase',
            'Metaphase',
            'Anaphase',
            'Telophase'
        ],
        correctAnswer: 0,
        explanation: 'In prophase, chromatin condenses into visible chromosomes, the nuclear envelope breaks down, and spindle fibers begin to form. This marks the start of mitosis.'
    },
    {
        id: `q${bank.questions.length + 3}`,
        standard: 'SC.912.L.14.10',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Low',
        text: 'What happens during anaphase of mitosis?',
        options: [
            'Sister chromatids separate and move toward opposite poles of the cell',
            'Chromosomes align at the cell\'s equator',
            'The nuclear envelope reforms',
            'DNA is replicated'
        ],
        correctAnswer: 0,
        explanation: 'Anaphase is characterized by the separation of sister chromatids at the centromere, pulled by spindle fibers toward opposite ends of the cell, ensuring each daughter cell receives identical chromosomes.'
    },
    {
        id: `q${bank.questions.length + 4}`,
        standard: 'SC.912.L.14.10',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Moderate',
        text: '[TABLE] A student observes cells under a microscope and records the following data:\n\n| Phase | Number of Cells |\n|-------|------------------|\n| Interphase | 45 |\n| Prophase | 8 |\n| Metaphase | 3 |\n| Anaphase | 2 |\n| Telophase | 2 |\n\nWhich conclusion is best supported by this data?',
        options: [
            'Interphase is the longest phase of the cell cycle',
            'Anaphase takes the most time to complete',
            'Cells spend equal time in each phase of mitosis',
            'The cells are undergoing meiosis rather than mitosis'
        ],
        correctAnswer: 0,
        explanation: 'Interphase accounts for 90% of the cell cycle (growth, DNA replication, preparation). The higher count of interphase cells indicates they spend more time in this phase before entering mitosis.'
    },
    {
        id: `q${bank.questions.length + 5}`,
        standard: 'SC.912.L.14.10',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Moderate',
        text: 'A cell has 16 chromosomes before mitosis begins. How many chromosomes will each daughter cell have after mitosis is complete?',
        options: [
            '16 chromosomes (same as parent)',
            '8 chromosomes (half of parent)',
            '32 chromosomes (double of parent)',
            '4 chromosomes (quarter of parent)'
        ],
        correctAnswer: 0,
        explanation: 'Mitosis produces genetically identical daughter cells with the same chromosome number as the parent. DNA is replicated before mitosis, then divided equally, so each daughter cell receives 16 chromosomes.'
    },
    {
        id: `q${bank.questions.length + 6}`,
        standard: 'SC.912.L.14.10',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Moderate',
        text: 'What is the role of spindle fibers during mitosis?',
        options: [
            'To attach to chromosomes and move them to opposite poles',
            'To replicate DNA before cell division',
            'To break down the nuclear envelope',
            'To form the new cell membrane'
        ],
        correctAnswer: 0,
        explanation: 'Spindle fibers are microtubules that attach to chromosome centromeres via kinetochores. They pull sister chromatids apart during anaphase, ensuring equal distribution of genetic material.'
    },
    {
        id: `q${bank.questions.length + 7}`,
        standard: 'SC.912.L.14.10',
        category: 'Molecular and Cellular Biology',
        difficulty: 'High',
        text: '[GRAPH] The graph below shows the relative DNA content in a cell over time during the cell cycle:\n\nDNA Content vs Time:\n- 1x during G1 (time 0-4)\n- Increases from 1x to 2x during S phase (time 4-8)\n- 2x during G2 and early mitosis (time 8-12)\n- Drops back to 1x after cell division (time 12+)\n\nDuring which time period is the cell in S phase?',
        options: [
            'Time 4-8 (when DNA content doubles)',
            'Time 0-4 (when DNA content is 1x)',
            'Time 8-12 (when DNA content is 2x)',
            'Time 12+ (after division)'
        ],
        correctAnswer: 0,
        explanation: 'S (Synthesis) phase is when DNA replication occurs. DNA content increases from 1x to 2x during this phase, preparing the cell for division. G1 has 1x, G2/M have 2x until cytokinesis halves it.'
    },
    {
        id: `q${bank.questions.length + 8}`,
        standard: 'SC.912.L.14.10',
        category: 'Molecular and Cellular Biology',
        difficulty: 'High',
        text: 'Which statement correctly compares mitosis and meiosis?',
        options: [
            'Mitosis produces 2 identical diploid cells; meiosis produces 4 different haploid cells',
            'Mitosis produces 4 different haploid cells; meiosis produces 2 identical diploid cells',
            'Both produce 2 identical daughter cells',
            'Both produce 4 genetically different cells'
        ],
        correctAnswer: 0,
        explanation: 'Mitosis is for growth/repair, producing 2 diploid (2n) cells identical to parent. Meiosis is for sexual reproduction, producing 4 haploid (n) gametes with genetic variation through crossing over and independent assortment.'
    },
    {
        id: `q${bank.questions.length + 9}`,
        standard: 'SC.912.L.14.10',
        category: 'Molecular and Cellular Biology',
        difficulty: 'High',
        text: 'A drug stops cells from forming spindle fibers. Which phase of mitosis would be most directly affected?',
        options: [
            'Anaphase (chromatids cannot separate without spindle fibers)',
            'Prophase (chromosomes cannot condense)',
            'Telophase (nuclear envelope cannot reform)',
            'Interphase (DNA cannot replicate)'
        ],
        correctAnswer: 0,
        explanation: 'Spindle fibers are essential for anaphase when sister chromatids are pulled apart. Without spindle fibers, chromosomes cannot separate, preventing cell division and potentially causing cell death.'
    },
    {
        id: `q${bank.questions.length + 10}`,
        standard: 'SC.912.L.14.10',
        category: 'Molecular and Cellular Biology',
        difficulty: 'High',
        text: '[EXPERIMENT] Scientists treated cancer cells with a chemical that prevents DNA replication. After 24 hours, they observed:\n- 85% of cells remained in interphase\n- No cells entered mitosis\n- Cells showed no signs of division\n\nWhich conclusion best explains these results?',
        options: [
            'The chemical blocked the S phase, preventing cells from entering mitosis',
            'The chemical caused rapid cell death in all phases',
            'Cells completed mitosis but could not undergo cytokinesis',
            'The chemical only affects cells already in mitosis'
        ],
        correctAnswer: 0,
        explanation: 'Cells must complete S phase (DNA replication) before entering mitosis. Blocking DNA replication traps cells in interphase at the G1/S checkpoint. Cancer cells that cannot divide may die or stop proliferating.'
    }
];

// ========== SC.912.L.14.26: Cell Transport (MISSING) ==========
const transportQuestions = [
    {
        id: `q${bank.questions.length + 11}`,
        standard: 'SC.912.L.14.26',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Low',
        text: 'Which type of transport requires energy (ATP) to move substances across the cell membrane?',
        options: [
            'Active transport',
            'Passive transport',
            'Diffusion',
            'Osmosis'
        ],
        correctAnswer: 0,
        explanation: 'Active transport moves substances against their concentration gradient (from low to high concentration), which requires ATP energy. Passive transport, diffusion, and osmosis move substances down their gradient without energy.'
    },
    {
        id: `q${bank.questions.length + 12}`,
        standard: 'SC.912.L.14.26',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Low',
        text: 'What is osmosis?',
        options: [
            'The movement of water across a selectively permeable membrane from high to low water concentration',
            'The movement of any molecule across a membrane',
            'Active transport of water molecules',
            'The movement of water from low to high solute concentration'
        ],
        correctAnswer: 0,
        explanation: 'Osmosis is a special type of diffusion involving water. Water moves from areas of high water concentration (low solute) to areas of low water concentration (high solute) through a selectively permeable membrane.'
    },
    {
        id: `q${bank.questions.length + 13}`,
        standard: 'SC.912.L.14.26',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Moderate',
        text: '[GRAPH] The graph shows the concentration of glucose inside and outside a cell over time:\n- Initially: Outside = 10%, Inside = 2%\n- After 30 min: Outside = 6%, Inside = 6%\n- After 60 min: Outside = 5%, Inside = 5%\n\nWhich type of transport occurred?',
        options: [
            'Passive diffusion (glucose moved from high to low concentration until equilibrium)',
            'Active transport (glucose moved from low to high concentration)',
            'Facilitated diffusion requiring ATP',
            'Osmosis of water molecules'
        ],
        correctAnswer: 0,
        explanation: 'Glucose moved from high concentration (10%) outside to low concentration (2%) inside, reaching equilibrium at 5-6%. This is passive diffusion—movement down the concentration gradient without energy input.'
    },
    {
        id: `q${bank.questions.length + 14}`,
        standard: 'SC.912.L.14.26',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Moderate',
        text: 'A red blood cell is placed in a hypertonic solution (higher solute concentration outside). What will happen to the cell?',
        options: [
            'The cell will shrink as water moves out by osmosis',
            'The cell will swell and possibly burst',
            'The cell will stay the same size',
            'The cell will actively transport water inward'
        ],
        correctAnswer: 0,
        explanation: 'In a hypertonic solution, water concentration is lower outside. Water moves out of the cell by osmosis, causing the cell to shrink (crenation). This can damage or kill the cell.'
    },
    {
        id: `q${bank.questions.length + 15}`,
        standard: 'SC.912.L.14.26',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Moderate',
        text: 'Why do cells use active transport to maintain ion concentrations?',
        options: [
            'Ions must be kept at levels different from the environment for proper cell function',
            'Active transport is faster than diffusion',
            'Ions cannot pass through the membrane at all',
            'Passive transport damages the membrane'
        ],
        correctAnswer: 0,
        explanation: 'Cells maintain ion gradients (e.g., high K+ inside, high Na+ outside) for nerve impulses, muscle contraction, and other functions. These gradients require active transport because they go against equilibrium.'
    },
    {
        id: `q${bank.questions.length + 16}`,
        standard: 'SC.912.L.14.26',
        category: 'Molecular and Cellular Biology',
        difficulty: 'High',
        text: '[EXPERIMENT] A student placed Elodea (aquatic plant) cells in three solutions:\n- Distilled water: Cells appeared normal, chloroplasts positioned at edges\n- 5% salt solution: Chloroplasts moved toward center, cell membrane pulled away from wall\n- 10% salt solution: Cells severely shriveled, membrane completely separated from wall\n\nWhat process explains these observations?',
        options: [
            'Plasmolysis due to water leaving cells in hypertonic solutions',
            'Active transport of salt into the cells',
            'Photosynthesis stopping in high salt',
            'Cell wall breakdown by salt'
        ],
        correctAnswer: 0,
        explanation: 'Plasmolysis occurs when cells lose water in hypertonic solutions. The cell membrane shrinks away from the rigid cell wall. In distilled water (hypotonic), plant cells remain turgid (firm) due to the cell wall preventing bursting.'
    },
    {
        id: `q${bank.questions.length + 17}`,
        standard: 'SC.912.L.14.26',
        category: 'Molecular and Cellular Biology',
        difficulty: 'High',
        text: 'The sodium-potassium pump moves 3 Na+ out and 2 K+ into the cell per ATP molecule. Why is this pump essential for nerve cells?',
        options: [
            'It maintains a resting potential with high Na+ outside and high K+ inside for signal transmission',
            'It provides energy for nerve impulse travel',
            'It prevents all ions from entering the cell',
            'It makes the cell membrane permeable to ions'
        ],
        correctAnswer: 0,
        explanation: 'The sodium-potassium pump creates ion gradients essential for the resting membrane potential (-70mV in neurons). When stimuli open ion channels, rapid Na+ influx causes depolarization, enabling action potentials (nerve signals).'
    }
];

// ========== SC.912.L.16.2: Sexual Reproduction (MISSING) ==========
const reproductionQuestions = [
    {
        id: `q${bank.questions.length + 18}`,
        standard: 'SC.912.L.16.2',
        category: 'Genetics and Heredity',
        difficulty: 'Low',
        text: 'What is the main advantage of sexual reproduction compared to asexual reproduction?',
        options: [
            'Greater genetic variation in offspring',
            'Faster reproduction rate',
            'Offspring are identical to parents',
            'Requires only one parent'
        ],
        correctAnswer: 0,
        explanation: 'Sexual reproduction combines genetic material from two parents, creating unique offspring through meiosis and fertilization. This genetic variation provides advantages for adaptation and evolution in changing environments.'
    },
    {
        id: `q${bank.questions.length + 19}`,
        standard: 'SC.912.L.16.2',
        category: 'Genetics and Heredity',
        difficulty: 'Low',
        text: 'What are gametes?',
        options: [
            'Haploid sex cells (sperm and egg) produced by meiosis',
            'Diploid body cells produced by mitosis',
            'Cells that divide by binary fission',
            'Zygotes formed after fertilization'
        ],
        correctAnswer: 0,
        explanation: 'Gametes are haploid (n) reproductive cells—sperm in males, eggs in females. They are produced by meiosis and contain half the chromosomes of body cells. Fertilization combines two gametes to form a diploid zygote.'
    },
    {
        id: `q${bank.questions.length + 20}`,
        standard: 'SC.912.L.16.2',
        category: 'Genetics and Heredity',
        difficulty: 'Moderate',
        text: 'In humans, how many chromosomes are in a typical gamete (sperm or egg)?',
        options: [
            '23 chromosomes (haploid)',
            '46 chromosomes (diploid)',
            '92 chromosomes',
            '12 chromosomes'
        ],
        correctAnswer: 0,
        explanation: 'Human body cells are diploid with 46 chromosomes (23 pairs). Gametes produced by meiosis are haploid with 23 chromosomes—one from each pair. Fertilization restores the diploid number (46) in the zygote.'
    },
    {
        id: `q${bank.questions.length + 21}`,
        standard: 'SC.912.L.16.2',
        category: 'Genetics and Heredity',
        difficulty: 'Moderate',
        text: 'What process creates genetic variation during meiosis by exchanging segments between homologous chromosomes?',
        options: [
            'Crossing over during prophase I',
            'Independent assortment during metaphase I',
            'DNA replication during interphase',
            'Cytokinesis at the end of meiosis'
        ],
        correctAnswer: 0,
        explanation: 'Crossing over occurs when homologous chromosomes pair up in prophase I and exchange segments. This creates new combinations of genes on chromosomes, increasing genetic variation in gametes.'
    },
    {
        id: `q${bank.questions.length + 22}`,
        standard: 'SC.912.L.16.2',
        category: 'Genetics and Heredity',
        difficulty: 'High',
        text: '[EXPERIMENT] Scientists crossed two plants:\n- Parent 1: Tall, yellow seeds (heterozygous for both traits)\n- Parent 2: Short, green seeds (homozygous recessive for both traits)\n- Offspring: 25% tall/yellow, 25% tall/green, 25% short/yellow, 25% short/green\n\nWhat genetic principle explains the 25% ratio for each phenotype?',
        options: [
            'Independent assortment—each trait segregates independently, producing 4 equal combinations',
            'Incomplete dominance mixing traits',
            'Linked genes preventing segregation',
            'Polygenic inheritance'
        ],
        correctAnswer: 0,
        explanation: 'When two traits segregate independently (Mendel\'s 2nd law), dihybrid crosses produce 4 phenotypes in equal proportions (1:1:1:1 in this test cross). This occurs when genes are on different chromosomes or far apart.'
    },
    {
        id: `q${bank.questions.length + 23}`,
        standard: 'SC.912.L.16.2',
        category: 'Genetics and Heredity',
        difficulty: 'High',
        text: 'How does independent assortment during meiosis contribute to genetic variation?',
        options: [
            'Homologous chromosome pairs align randomly, creating many possible combinations in gametes',
            'Chromosomes replicate multiple times',
            'All chromosomes go to one gamete',
            'Mutations occur during chromosome separation'
        ],
        correctAnswer: 0,
        explanation: 'Independent assortment occurs in metaphase I when homologous pairs line up randomly at the equator. With 23 pairs in humans, 2^23 (over 8 million) possible chromosome combinations can occur in gametes.'
    }
];

// ========== SC.912.L.16.9: Protein Synthesis (MISSING) ==========
const proteinQuestions = [
    {
        id: `q${bank.questions.length + 24}`,
        standard: 'SC.912.L.16.9',
        category: 'Genetics and Heredity',
        difficulty: 'Low',
        text: 'Which type of RNA carries the genetic code from DNA to the ribosome for protein synthesis?',
        options: [
            'mRNA (messenger RNA)',
            'tRNA (transfer RNA)',
            'rRNA (ribosomal RNA)',
            'DNA (deoxyribonucleic acid)'
        ],
        correctAnswer: 0,
        explanation: 'mRNA is transcribed from DNA in the nucleus and carries the genetic instructions to ribosomes in the cytoplasm. Ribosomes read the mRNA codons to assemble amino acids into proteins.'
    },
    {
        id: `q${bank.questions.length + 25}`,
        standard: 'SC.912.L.16.9',
        category: 'Genetics and Heredity',
        difficulty: 'Low',
        text: 'What is the role of tRNA in protein synthesis?',
        options: [
            'To carry specific amino acids to the ribosome and match them to mRNA codons',
            'To carry the genetic code from DNA to ribosomes',
            'To form part of the ribosome structure',
            'To transcribe DNA into mRNA'
        ],
        correctAnswer: 0,
        explanation: 'tRNA molecules have an anticodon that matches mRNA codons and carry specific amino acids. At the ribosome, tRNA anticodon pairs with mRNA codon, delivering the correct amino acid to the growing protein chain.'
    },
    {
        id: `q${bank.questions.length + 26}`,
        standard: 'SC.912.L.16.9',
        category: 'Genetics and Heredity',
        difficulty: 'Moderate',
        text: 'Where does transcription occur in a eukaryotic cell?',
        options: [
            'In the nucleus (DNA → mRNA)',
            'At the ribosome in the cytoplasm',
            'In the mitochondria',
            'In the Golgi apparatus'
        ],
        correctAnswer: 0,
        explanation: 'Transcription (making mRNA from DNA) occurs in the nucleus where DNA is located. The mRNA then exits through nuclear pores to ribosomes in the cytoplasm for translation (protein synthesis).'
    },
    {
        id: `q${bank.questions.length + 27}`,
        standard: 'SC.912.L.16.9',
        category: 'Genetics and Heredity',
        difficulty: 'Moderate',
        text: 'If the DNA sequence is ATG-CGA-TTA, what is the corresponding mRNA sequence?',
        options: [
            'UAC-GCU-AAU (A→U, T→A, G→C)',
            'ATG-CGA-TTA (identical to DNA)',
            'TAC-GCT-AAT',
            'AUG-CGA-UUA'
        ],
        correctAnswer: 0,
        explanation: 'During transcription, RNA polymerase makes mRNA complementary to DNA template: A pairs with U (not T), T pairs with A, G pairs with C, C pairs with G. DNA ATG-CGA-TTA becomes mRNA UAC-GCU-AAU.'
    },
    {
        id: `q${bank.questions.length + 28}`,
        standard: 'SC.912.L.16.9',
        category: 'Genetics and Heredity',
        difficulty: 'Moderate',
        text: '[TABLE] A codon table shows:\n| Codon | Amino Acid |\n| AUG | Methionine (Start) |\n| UUU/UUC | Phenylalanine |\n| AAA/AAG | Lysine |\n| GGU/GGC/GGA/GGG | Glycine |\n\nIf mRNA codons are AUG-AAA-GGU, what amino acid sequence is produced?',
        options: [
            'Methionine - Lysine - Glycine',
            'Phenylalanine - Lysine - Glycine',
            'Methionine - Phenylalanine - Glycine',
            'Glycine - Lysine - Methionine'
        ],
        correctAnswer: 0,
        explanation: 'Each codon codes for one amino acid: AUG = Methionine (also start codon), AAA = Lysine, GGU = Glycine. The ribosome reads codons in order to assemble amino acids in the correct sequence.'
    },
    {
        id: `q${bank.questions.length + 29}`,
        standard: 'SC.912.L.16.9',
        category: 'Genetics and Heredity',
        difficulty: 'High',
        text: 'A mutation changes a DNA base from T to C. If this occurs in a gene\'s coding region, how might it affect the protein?',
        options: [
            'It may change one amino acid (if the new codon codes for a different amino acid) or have no effect (if same amino acid)',
            'The protein will definitely be nonfunctional',
            'All amino acids after the mutation will change',
            'The entire protein structure will collapse'
        ],
        correctAnswer: 0,
        explanation: 'Point mutations can be: silent (no amino acid change due to codon redundancy), missense (one amino acid changed), or nonsense (creates stop codon, truncates protein). Effects vary from harmless to severe.'
    },
    {
        id: `q${bank.questions.length + 30}`,
        standard: 'SC.912.L.16.9',
        category: 'Genetics and Heredity',
        difficulty: 'High',
        text: '[EXPERIMENT] Cells were treated with a chemical that prevents mRNA from leaving the nucleus. Which process would be most directly affected?',
        options: [
            'Translation (protein synthesis at ribosomes) would stop since mRNA cannot reach ribosomes',
            'Transcription would stop in the nucleus',
            'DNA replication would be blocked',
            'All cellular processes would continue normally'
        ],
        correctAnswer: 0,
        explanation: 'Translation requires mRNA at ribosomes in the cytoplasm. If mRNA cannot exit the nucleus, ribosomes have no template for protein synthesis. Transcription may continue, but proteins cannot be made.'
    }
];

// ========== SC.912.L.16.8: Genetic Engineering (MISSING) ==========
const biotechQuestions = [
    {
        id: `q${bank.questions.length + 31}`,
        standard: 'SC.912.L.16.8',
        category: 'Genetics and Heredity',
        difficulty: 'Low',
        text: 'What is genetic engineering?',
        options: [
            'Modifying an organism\'s DNA by inserting, deleting, or altering genes',
            'Breeding organisms to select desired traits naturally',
            'Allowing mutations to occur randomly',
            'Studying chromosomes without changing them'
        ],
        correctAnswer: 0,
        explanation: 'Genetic engineering (recombinant DNA technology) directly manipulates an organism\'s genome. Scientists can insert genes from one organism into another, delete unwanted genes, or modify existing genes to change traits.'
    },
    {
        id: `q${bank.questions.length + 32}`,
        standard: 'SC.912.L.16.8',
        category: 'Genetics and Heredity',
        difficulty: 'Low',
        text: 'What is a transgenic organism?',
        options: [
            'An organism that contains DNA from a different species inserted by genetic engineering',
            'An organism with only its own species\' DNA',
            'A naturally mutated organism',
            'An organism that has been cloned'
        ],
        correctAnswer: 0,
        explanation: 'Transgenic organisms have genes from other species inserted into their genome. Examples include: bacteria with human insulin genes, plants with bacterial pest-resistance genes, and mice with human disease genes for research.'
    },
    {
        id: `q${bank.questions.length + 33}`,
        standard: 'SC.912.L.16.8',
        category: 'Genetics and Heredity',
        difficulty: 'Moderate',
        text: 'Why is the bacteria E. coli commonly used in genetic engineering?',
        options: [
            'It reproduces quickly, is easy to grow, and can be manipulated to produce proteins like human insulin',
            'It is the only bacteria that accepts foreign DNA',
            'It causes diseases that scientists want to study',
            'It has no DNA of its own'
        ],
        correctAnswer: 0,
        explanation: 'E. coli is ideal for genetic engineering because it grows rapidly (divides every 20 min), is easy to culture, and its plasmids can carry foreign genes. Engineered E. coli produces insulin, growth hormone, and other medicines.'
    },
    {
        id: `q${bank.questions.length + 34}`,
        standard: 'SC.912.L.16.8',
        category: 'Genetics and Heredity',
        difficulty: 'Moderate',
        text: 'What is CRISPR technology used for in genetic engineering?',
        options: [
            'Precisely editing DNA at specific locations by cutting and modifying genes',
            'Creating clones of entire organisms',
            'Sequencing DNA for analysis',
            'Growing bacteria in laboratories'
        ],
        correctAnswer: 0,
        explanation: 'CRISPR-Cas9 is a revolutionary gene-editing tool that uses a guide RNA to target specific DNA sequences. The Cas9 enzyme cuts the DNA, allowing scientists to delete, insert, or modify genes with unprecedented precision.'
    },
    {
        id: `q${bank.questions.length + 35}`,
        standard: 'SC.912.L.16.8',
        category: 'Genetics and Heredity',
        difficulty: 'High',
        text: '[EXPERIMENT] Scientists inserted a human insulin gene into bacteria. The bacteria now produce human insulin that is harvested for diabetes treatment. Which statement best explains this success?',
        options: [
            'The genetic code is universal—bacteria can read and translate human DNA into functional human protein',
            'Bacteria naturally produce human insulin',
            'The bacteria mutated to produce insulin',
            'Human insulin is identical to bacterial insulin'
        ],
        correctAnswer: 0,
        explanation: 'The genetic code is nearly universal across all organisms. Bacteria can transcribe and translate human genes because they use the same codon-amino acid system. This allows cross-species gene expression for medicine production.'
    },
    {
        id: `q${bank.questions.length + 36}`,
        standard: 'SC.912.L.16.8',
        category: 'Genetics and Heredity',
        difficulty: 'High',
        text: 'What are potential benefits and risks of genetically modifying crops?',
        options: [
            'Benefits: Increased yield, pest resistance, improved nutrition; Risks: Unknown health effects, environmental impact, biodiversity reduction',
            'Only benefits exist with no risks',
            'Only risks exist with no benefits',
            'GM crops are identical to natural crops'
        ],
        correctAnswer: 0,
        explanation: 'GM crops can increase food production, resist pests/drought, and enhance nutrition (e.g., Golden Rice with vitamin A). Concerns include: possible allergens, gene flow to wild plants, reducing genetic diversity, and corporate control of seeds.'
    }
];

// ========== Additional Data Analysis Questions ==========
const dataAnalysisQuestions = [
    {
        id: `q${bank.questions.length + 37}`,
        standard: 'SC.912.L.17.11',
        category: 'Organisms, Populations, and Ecosystems',
        difficulty: 'Moderate',
        text: '[GRAPH] A food web diagram shows:\n- Hawks eat snakes and mice\n- Snakes eat mice and frogs\n- Frogs eat insects\n- Mice eat seeds and insects\n- Insects eat plants\n- Plants are producers\n\nIf all snakes are removed from this ecosystem, what would most likely happen to the hawk population?',
        options: [
            'Hawk population would decrease due to loss of a food source, then mice might increase (less snake predation)',
            'Hawk population would increase immediately',
            'Nothing would change for hawks',
            'All organisms would die'
        ],
        correctAnswer: 0,
        explanation: 'Removing snakes removes a food source for hawks. Hawks may decline initially. However, mice (also eaten by snakes) would likely increase with less predation pressure. Hawks might then rely more heavily on mice.'
    },
    {
        id: `q${bank.questions.length + 38}`,
        standard: 'SC.912.L.17.5',
        category: 'Organisms, Populations, and Ecosystems',
        difficulty: 'High',
        text: '[TABLE] Population data for deer in a forest over 5 years:\n| Year | Deer Population | Available Food (tons) |\n| 1 | 100 | 500 |\n| 2 | 150 | 400 |\n| 3 | 200 | 300 |\n| 4 | 180 | 250 |\n| 5 | 150 | 200 |\n\nWhat limiting factor is most likely controlling the deer population?',
        options: [
            'Food availability—population declined when food dropped below sustainable levels',
            'Predation by wolves',
            'Disease outbreak',
            'Human hunting'
        ],
        correctAnswer: 0,
        explanation: 'The data shows deer population increasing until Year 3, then declining as food decreased. This pattern indicates food is the limiting factor. Carrying capacity was exceeded around Year 3-4, causing population crash.'
    },
    {
        id: `q${bank.questions.length + 39}`,
        standard: 'SC.912.L.18.12',
        category: 'Molecular and Cellular Biology',
        difficulty: 'High',
        text: '[GRAPH] An enzyme activity graph shows:\n- Rate increases from 0°C to 37°C (peak)\n- Rate decreases from 37°C to 60°C\n- Rate nearly 0 at 70°C\n\nWhat explains the decrease in rate above 37°C?',
        options: [
            'Enzyme denaturation—the protein structure unravels at high temperature, losing its active site shape',
            'Substrate becomes unstable',
            'The reaction naturally slows down',
            'More enzyme is produced at low temperature'
        ],
        correctAnswer: 0,
        explanation: 'Enzymes have optimal temperature (37°C for many human enzymes). Above this, heat breaks hydrogen bonds and disrupts the enzyme\'s 3D structure (denaturation). The active site loses its shape, preventing substrate binding.'
    },
    {
        id: `q${bank.questions.length + 40}`,
        standard: 'SC.912.L.15.1',
        category: 'Classification, Heredity, and Evolution',
        difficulty: 'High',
        text: '[EXPERIMENT] A scientist studied antibiotic resistance in bacteria:\n- Day 1: 99% bacteria killed by antibiotic X\n- Day 5: 80% bacteria killed\n- Day 10: 50% bacteria killed\n- Day 20: 10% bacteria killed\n- Surviving bacteria passed resistance to offspring\n\nWhich mechanism best explains these results?',
        options: [
            'Natural selection—resistant bacteria survived, reproduced, and passed resistance genes to offspring',
            'Bacteria learned to avoid the antibiotic',
            'The antibiotic became weaker over time',
            'All bacteria became resistant simultaneously'
        ],
        correctAnswer: 0,
        explanation: 'Natural selection occurs when bacteria with resistance genes survive antibiotic treatment while susceptible bacteria die. Survivors reproduce, passing resistance alleles to offspring. Over generations, the resistant population increases.'
    }
];

// ========== Experimental Design Questions ==========
const experimentQuestions = [
    {
        id: `q${bank.questions.length + 41}`,
        standard: 'SC.912.L.14.7',
        category: 'Molecular and Cellular Biology',
        difficulty: 'Moderate',
        text: '[EXPERIMENT] A student designs an experiment to test photosynthesis rates:\n- Setup A: Plant in normal light (control)\n- Setup B: Plant in blue light only\n- Setup C: Plant in green light only\n- Measured oxygen produced over 1 hour\n\nWhat is the independent variable in this experiment?',
        options: [
            'The color/wavelength of light',
            'The amount of oxygen produced',
            'The type of plant used',
            'The duration of the experiment'
        ],
        correctAnswer: 0,
        explanation: 'The independent variable is what the experimenter changes intentionally—light color/wavelength. The dependent variable is what is measured—oxygen production (indicator of photosynthesis rate).'
    },
    {
        id: `q${bank.questions.length + 42}`,
        standard: 'SC.912.L.14.7',
        category: 'Molecular and Cellular Biology',
        difficulty: 'High',
        text: '[EXPERIMENT DESIGN] Scientists want to test if fertilizer affects plant growth. Which experimental design is most valid?',
        options: [
            'Two identical groups of plants: one with fertilizer (experimental), one without (control), same soil, light, water',
            'All plants get fertilizer, measure growth over time',
            'Compare wild plants to greenhouse plants',
            'Use different plant species with and without fertilizer'
        ],
        correctAnswer: 0,
        explanation: 'A valid experiment requires: control group (no fertilizer), experimental group (with fertilizer), and all other variables constant (same species, soil, light, water). This isolates fertilizer as the only difference.'
    },
    {
        id: `q${bank.questions.length + 43}`,
        standard: 'SC.912.L.17.9',
        category: 'Organisms, Populations, and Ecosystems',
        difficulty: 'High',
        text: '[EXPERIMENT] Researchers studied succession on bare rock after a volcanic eruption:\n- Year 1: Lichens appeared\n- Year 5: Mosses grew over lichens\n- Year 15: Grasses established\n- Year 50: Shrubs and small trees\n- Year 100: Mature forest\n\nWhich statement describes primary succession?',
        options: [
            'Bare rock with no soil → pioneer species (lichens) → gradual development of soil and plant communities',
            'Forest destroyed by fire → immediate regrowth of original forest',
            'Abandoned farmland → weeds → forest',
            'Plants growing in an established ecosystem'
        ],
        correctAnswer: 0,
        explanation: 'Primary succession begins on bare rock/sand with no soil. Pioneer species like lichens break down rock and begin soil formation. Over centuries, soil deepens, allowing grasses, shrubs, and eventually trees to establish.'
    }
];

// Combine all new questions
newQuestions.push(...mitosisQuestions, ...transportQuestions, ...reproductionQuestions, ...proteinQuestions, ...biotechQuestions, ...dataAnalysisQuestions, ...experimentQuestions);

// Add to bank
bank.questions.push(...newQuestions);
bank.totalQuestions = bank.questions.length;
bank.generatedAt = new Date().toISOString();

// Write updated bank
writeFileSync(bankPath, JSON.stringify(bank, null, 2));

console.log(`\n✅ Added ${newQuestions.length} new questions`);
console.log(`📊 Total questions: ${bank.totalQuestions}`);
console.log('\nNew standards covered:');
console.log('  SC.912.L.14.10: Cell Division/Mitosis (10 questions)');
console.log('  SC.912.L.14.26: Cell Transport (7 questions)');
console.log('  SC.912.L.16.2: Sexual Reproduction (6 questions)');
console.log('  SC.912.L.16.9: Protein Synthesis (7 questions)');
console.log('  SC.912.L.16.8: Genetic Engineering (6 questions)');
console.log('\nAdded:');
console.log('  7 data analysis questions with [GRAPH]/[TABLE]/[EXPERIMENT]');
console.log('  3 experimental design questions');
console.log('\nRun audit-questions.js to verify coverage.');