import React from 'react';
import DataGraph from './DataGraph';

interface QuestionVisualProps {
  text: string;
  graphData?: any;
}

/**
 * Parses question text and renders appropriate visualizations
 */
const QuestionVisual: React.FC<QuestionVisualProps> = ({ text, graphData }) => {
  const parts = parseQuestionText(text, graphData);
  
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
                {part.title && !part.graphData?.title && (
                  <p className="text-sm font-bold text-slate-600 mb-3">{part.title}</p>
                )}
                <div className="bg-white rounded p-4 border border-slate-100">
                  <DataGraph
                    type={part.graphData?.type || 'line'}
                    title={part.graphData?.title || part.title}
                    data={part.graphData?.data || part.inlineData}
                    xAxisLabel={part.graphData?.xAxisLabel}
                    yAxisLabel={part.graphData?.yAxisLabel}
                    showTrend={part.graphData?.showTrend}
                  />
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
function parseQuestionText(text: string, providedGraphData?: any): any[] {
  const parts: any[] = [];
  const lines = text.split('\n');
  let currentText = '';
  let tableLines: string[] = [];
  let inTable = false;
  let graphPoints: { label: string; value: number }[] = [];
  let graphTitle = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip separator lines in tables
    if (inTable && trimmed.startsWith('|') && trimmed.includes('---')) {
      continue;
    }
    
    // Handle table rows
    if (trimmed.startsWith('|') && trimmed.includes('|') && !trimmed.includes('---')) {
      if (!inTable) {
        if (currentText.trim()) parts.push({ type: 'text', content: currentText.trim() });
        currentText = '';
        inTable = true;
      }
      tableLines.push(line);
      continue;
    }
    
    // End table if we hit non-table content
    if (inTable && !trimmed.startsWith('|')) {
      if (tableLines.length > 0) {
        parts.push({ type: 'table', ...parseMarkdownTable(tableLines) });
        tableLines = [];
      }
      inTable = false;
    }
    
    // Handle inline graph data: "- Label: value" pattern
    const graphMatch = trimmed.match(/^-\s*(.+?):\s*(\d+)/);
    if (graphMatch) {
      const label = graphMatch[1].trim();
      const value = parseInt(graphMatch[2]);
      
      // Check if this is graph-worthy data (time series, percentages, etc.)
      const isGraphData = 
        label.includes('Year') || 
        label.includes('Gen') || 
        label.match(/\d{4}/) || // Years like 1900, 1950
        value <= 100 && trimmed.includes('%') ||
        label.match(/^Day\s*\d+/);
      
      if (isGraphData) {
        // Extract graph title from 📊 marker
        if (currentText.includes('📊')) {
          const titleMatch = currentText.match(/📊\s*(.+?):/);
          if (titleMatch) graphTitle = titleMatch[1].trim();
          currentText = currentText.replace(/📊[^:]*:/, '').trim();
        }
        
        graphPoints.push({ label: label.replace(/^\d+\s*/, '').replace(/\s*\d+$/, ''), value });
        continue;
      }
    }
    
    // If we collected graph points and hit non-graph content, emit the graph
    if (graphPoints.length > 0 && !trimmed.startsWith('-')) {
      parts.push({
        type: 'graph',
        title: graphTitle,
        inlineData: graphPoints,
        graphData: providedGraphData || {
          type: 'line',
          title: graphTitle,
          data: graphPoints,
          showTrend: graphPoints.length > 1 && graphPoints[graphPoints.length - 1].value > graphPoints[0].value
        }
      });
      graphPoints = [];
      graphTitle = '';
    }
    
    currentText += line + '\n';
  }
  
  // Handle remaining content
  if (tableLines.length > 0) {
    parts.push({ type: 'table', ...parseMarkdownTable(tableLines) });
  }
  if (graphPoints.length > 0) {
    parts.push({
      type: 'graph',
      title: graphTitle,
      inlineData: graphPoints,
      graphData: providedGraphData || {
        type: 'line',
        title: graphTitle,
        data: graphPoints,
        showTrend: true
      }
    });
  }
  if (currentText.trim()) {
    parts.push({ type: 'text', content: currentText.trim() });
  }
  
  return parts;
}

/**
 * Parse markdown table into headers and rows
 */
function parseMarkdownTable(lines: string[]): { headers: string[], rows: string[][] } {
  const headers: string[] = [];
  const rows: string[][] = [];
  
  if (lines.length > 0) {
    const cells = lines[0].split('|').filter(c => c.trim());
    headers.push(...cells.map(c => c.trim()));
  }
  
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split('|').filter(c => c.trim());
    if (cells.length > 0) rows.push(cells.map(c => c.trim()));
  }
  
  return { headers, rows };
}

export default QuestionVisual;