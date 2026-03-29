# Generate Question Bank

Instructions for generating the Biology EOC question bank for the adaptive test system.

## Output File

Save the generated bank to: `data/question-bank.json`

## Required JSON Structure

```json
{
  "generatedAt": "2026-03-28T12:00:00.000Z",
  "embeddingModel": "nomic-embed-text",
  "totalQuestions": 300,
  "questions": [
    {
      "id": "unique-string",
      "category": "Molecular and Cellular Biology",
      "difficulty": "Moderate",
      "themes": ["cell membrane", "transport", "osmosis"],
      "standard": "SC.912.L.14.1",
      "text": "A student places a red blood cell into a beaker of distilled water...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why the answer is correct...",
      "embedding": [0.12, -0.34, ...]
    }
  ]
}
```

## Categories & Standards

Generate questions across these **4 categories** with the listed Florida NGSSS standards:

### 1. Molecular and Cellular Biology
- SC.912.L.14.1 — Cell Theory
- SC.912.L.14.3 — Cell Structure & Organelles
- SC.912.L.14.7 — Cell Membrane & Transport
- SC.912.L.18.1 — Macromolecules (proteins, lipids, carbs, nucleic acids)
- SC.912.L.18.12 — Water Properties, pH, Buffers

**Theme groups:** cell theory, organelle function, membrane transport (osmosis, diffusion, active transport), macromolecules & enzymes, cellular respiration & ATP, photosynthesis, cell cycle & mitosis, water properties & pH

### 2. Genetics and Heredity
- SC.912.L.16.1 — Mendelian Genetics
- SC.912.L.16.3 — DNA Replication
- SC.912.L.16.10 — Biotechnology
- SC.912.L.16.17 — Meiosis & Genetic Variation

**Theme groups:** Punnett squares & inheritance, DNA structure & replication, transcription & translation, mutations (point, frameshift, chromosomal), biotechnology (PCR, gel electrophoresis, CRISPR), meiosis & crossing over

### 3. Classification, Heredity, and Evolution
- SC.912.L.15.1 — Evolution Theory & Evidence
- SC.912.L.15.6 — Classification & Taxonomy
- SC.912.L.15.8 — Hardy-Weinberg & Population Genetics
- SC.912.L.15.13 — Natural Selection & Adaptation

**Theme groups:** natural selection & fitness, fossil record & homologous structures, speciation & reproductive isolation, taxonomy & cladograms, allele frequency & genetic drift, coevolution & convergent evolution

### 4. Organisms, Populations, and Ecosystems
- SC.912.L.17.5 — Interdependence
- SC.912.L.17.9 — Energy Flow
- SC.912.L.17.11 — Biogeochemical Cycles
- SC.912.L.17.20 — Human Impact

**Theme groups:** food chains/webs & trophic levels, biogeochemical cycles (carbon, nitrogen, water), population dynamics & carrying capacity, symbiosis (mutualism, commensalism, parasitism), ecological succession, biodiversity & invasive species, human impact & climate change, biomes & abiotic/biotic factors

## Difficulty Levels

Generate roughly **equal distribution** across all three levels:

| Level | Description | Question Style |
|-------|-------------|----------------|
| **Low** | Basic recall & terminology | "What is the function of..." / "Which organelle..." |
| **Moderate** | Application & interpretation | Scenario-based, data tables, diagram interpretation |
| **High** | Analysis, synthesis & evaluation | Multi-step reasoning, experimental design, compare/contrast complex systems |

## Quality Requirements

> [!IMPORTANT]
> These are the most critical requirements. Low-quality questions ruin the adaptive system.

1. **4 answer options per question** — always exactly 4, labeled A–D
2. **Plausible distractors** — wrong answers must be real biology concepts that a student might confuse, never filler like "None of the above", "Random", "No effect"
3. **Unique explanations** — each question must have a specific explanation (2-3 sentences) about *why* the correct answer is right and common misconceptions. Never use generic text like "Key concept for EOC"
4. **No duplicate questions** — every question text must be unique
5. **Scenario-based for Moderate/High** — use lab situations, data tables, real-world applications
6. **Correct `correctAnswer` index** — must be 0, 1, 2, or 3 and must match the actual correct option
7. **Each `id` must be unique** — use random alphanumeric strings

## Embedding Each Question

After generating questions, embed each one using Ollama's embedding API:

```bash
curl http://localhost:18789/api/embeddings \
  -d '{"model": "nomic-embed-text", "prompt": "Molecular and Cellular Biology Moderate cell membrane transport osmosis A student places a red blood cell..."}'
```

The embed text should be: `"{category} {difficulty} {themes joined by space} {question text}"`

Store the resulting vector in the `embedding` field of each question.

## Target Count

Aim for **~300 questions** total:
- ~75 per category
- ~25 per difficulty level per category
- Cover all theme groups and standards listed above

## Validation Checklist

Before saving, verify:
- [ ] All questions have exactly 4 options
- [ ] `correctAnswer` is 0–3 and matches the right option
- [ ] No duplicate question texts
- [ ] All questions have non-generic explanations (>20 chars, unique)
- [ ] All embeddings are present (array of floats)
- [ ] Difficulty distribution is roughly even (not >50% in any one level)
- [ ] All 4 categories are represented
- [ ] JSON is valid and matches the schema above
