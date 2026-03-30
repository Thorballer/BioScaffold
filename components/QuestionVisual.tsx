import React from 'react';

interface QuestionVisualProps {
  text: string;
}

/**
 * Parses question text and renders appropriate visualizations
 * for [GRAPH], [TABLE], and [EXPERIMENT] sections
 */
const QuestionVisual: React.FC<QuestionVisualProps> = ({ text }) => {
  // Parse the text to extract visual sections
  const parts = parseQuestionText(text);
  
  return (
    <div className="space-y-4">
      {parts.map((part, idx) => (
        <div key={idx}>
          {part.type === 'text' && (
            <p className="text-slate-800 leading-relaxed">{part.content}</p>
          )}
          {part.type === 'table' && (
            <div className="my-4 overflow-x-auto">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                {part.title && (
                  <p className="text-sm font-bold text-slate-600 mb-2">{part.title}</p>
                )}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-300">
                      {part.headers?.map((h: string, i: number) => (
                        <th key={i} className="px-3 py-2 text-left font-semibold text-slate-700">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {part.rows?.map((row: string[], i: number) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        {row.map((cell: string, j: number) => (
                          <td key={j} className="px-3 py-2 text-slate-600">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {part.type === 'graph' && (
            <div className="my-4">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                {part.title && (
                  <p className="text-sm font-bold text-slate-600 mb-3">{part.title}</p>
                )}
                <div className="bg-white rounded p-4 border border-slate-100">
                  {renderGraph(part)}
                </div>
              </div>
            </div>
          )}
          {part.type === 'experiment' && (
            <div className="my-4">
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-600">🔬</span>
                  <p className="text-sm font-bold text-amber-700">Experimental Data</p>
                </div>
                {part.content && (
                  <p className="text-slate-700 text-sm mb-3">{part.content}</p>
                )}
                {part.data && (
                  <div className="bg-white rounded p-3 border border-amber-100">
                    {part.data}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Parse question text into structured parts
 */
function parseQuestionText(text: string): any[] {
  const parts: any[] = [];
  
  // Handle markdown-style tables
  if (text.includes('|') && text.includes('---')) {
    const lines = text.split('\n');
    let currentText = '';
    let tableLines: string[] = [];
    let inTable = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check for separator line FIRST (before adding to tableLines)
      if (inTable && trimmed.startsWith('|') && trimmed.includes('---')) {
        // This is the separator line, skip it
        continue;
      }
      
      // Check if line is a table row
      if (trimmed.startsWith('|') && trimmed.includes('|')) {
        if (!inTable) {
          if (currentText.trim()) {
            parts.push({ type: 'text', content: currentText.trim() });
          }
          currentText = '';
          inTable = true;
        }
        tableLines.push(line);
      } else if (inTable && !trimmed.startsWith('|')) {
        // End of table (empty line or non-table text)
        if (tableLines.length > 0) {
          const tableData = parseMarkdownTable(tableLines);
          parts.push({ type: 'table', ...tableData });
        }
        tableLines = [];
        inTable = false;
        currentText += line + '\n';
      } else {
        currentText += line + '\n';
      }
    }
    
    // Handle remaining content
    if (inTable && tableLines.length > 0) {
      const tableData = parseMarkdownTable(tableLines);
      parts.push({ type: 'table', ...tableData });
    }
    if (currentText.trim()) {
      parts.push({ type: 'text', content: currentText.trim() });
    }
  } else {
    // No tables, just text
    parts.push({ type: 'text', content: text });
  }
  
  return parts;
}

/**
 * Parse markdown table into headers and rows
 */
function parseMarkdownTable(lines: string[]): { headers: string[], rows: string[][] } {
  const headers: string[] = [];
  const rows: string[][] = [];
  
  // First line is headers
  if (lines.length > 0) {
    const headerLine = lines[0].trim();
    const cells = headerLine.split('|').filter(c => c.trim());
    headers.push(...cells.map(c => c.trim()));
  }
  
  // Remaining lines are data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|---') || !line.startsWith('|')) continue;
    
    const cells = line.split('|').filter(c => c.trim());
    rows.push(cells.map(c => c.trim()));
  }
  
  return { headers, rows };
}

/**
 * Render a graph based on parsed data
 */
function renderGraph(part: any): React.ReactNode {
  // For now, render a simple SVG visualization
  // The graph data should be embedded in the question
  
  // Default bar chart for generic graphs
  if (part.bars) {
    return (
      <svg viewBox="0 0 300 150" className="w-full max-w-md">
        <text x="150" y="10" textAnchor="middle" className="fill-slate-600 text-xs font-semibold">
          {part.title || 'Data Visualization'}
        </text>
        {part.bars.map((bar: any, i: number) => (
          <g key={i}>
            <rect
              x={40 + i * 50}
              y={130 - bar.height}
              width="40"
              height={bar.height}
              fill="#6366f1"
              rx="4"
            />
            <text x={60 + i * 50} y="145" textAnchor="middle" className="fill-slate-500 text-xs">
              {bar.label}
            </text>
            <text x={60 + i * 50} y={125 - bar.height} textAnchor="middle" className="fill-slate-700 text-xs font-semibold">
              {bar.value}
            </text>
          </g>
        ))}
      </svg>
    );
  }
  
  // Line graph for trends
  if (part.points) {
    const maxVal = Math.max(...part.points.map((p: any) => p.y));
    const xScale = 280 / (part.points.length - 1);
    const yScale = 100 / maxVal;
    
    const pathD = part.points.map((p: any, i: number) => 
      `${i === 0 ? 'M' : 'L'} ${20 + i * xScale} ${130 - p.y * yScale}`
    ).join(' ');
    
    return (
      <svg viewBox="0 0 300 150" className="w-full max-w-md">
        <text x="150" y="10" textAnchor="middle" className="fill-slate-600 text-xs font-semibold">
          {part.title || 'Trend Data'}
        </text>
        <path d={pathD} stroke="#6366f1" strokeWidth="2" fill="none" />
        {part.points.map((p: any, i: number) => (
          <g key={i}>
            <circle cx={20 + i * xScale} cy={130 - p.y * yScale} r="4" fill="#6366f1" />
            <text x={20 + i * xScale} y="145" textAnchor="middle" className="fill-slate-500 text-xs">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    );
  }
  
  // Generic placeholder if no specific graph data
  return (
    <div className="flex items-center justify-center h-32 text-slate-500">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-xs">See data description below</p>
      </div>
    </div>
  );
}

export default QuestionVisual;