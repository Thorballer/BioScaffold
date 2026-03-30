import React from 'react';

interface GraphProps {
  type: 'line' | 'bar';
  title?: string;
  data: { label: string; value: number }[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showTrend?: boolean;
}

/**
 * Renders an actual SVG graph with real data visualization
 */
const DataGraph: React.FC<GraphProps> = ({ type, title, data, xAxisLabel, yAxisLabel, showTrend }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  // SVG dimensions
  const width = 400;
  const height = 200;
  const padding = { top: 40, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Scale functions
  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartWidth;
  const yScale = (val: number) => padding.top + chartHeight - ((val - minValue) / range) * chartHeight;
  
  if (type === 'line') {
    // Generate path for line
    const pathPoints = data.map((d, i) => `${xScale(i)},${yScale(d.value)}`);
    const linePath = `M ${pathPoints.join(' L ')}`;
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg bg-white rounded-lg">
        {/* Title */}
        {title && (
          <text x={width / 2} y={20} textAnchor="middle" className="fill-slate-700 font-semibold text-sm">
            {title}
          </text>
        )}
        
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + p * chartHeight}
            x2={width - padding.right}
            y2={padding.top + p * chartHeight}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}
        
        {/* Y-axis labels */}
        {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, minValue].map((val, i) => (
          <text
            key={i}
            x={padding.left - 10}
            y={padding.top + i * (chartHeight / 4) + 4}
            textAnchor="end"
            className="fill-slate-500 text-xs"
          >
            {Math.round(val)}
          </text>
        ))}
        
        {/* Y-axis label */}
        {yAxisLabel && (
          <text x={15} y={height / 2} textAnchor="middle" className="fill-slate-600 text-xs" transform={`rotate(-90 15 ${height / 2})`}>
            {yAxisLabel}
          </text>
        )}
        
        {/* Line path */}
        <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Data points */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xScale(i)} cy={yScale(d.value)} r="4" fill="#6366f1" stroke="#4f46e5" strokeWidth="2" />
          </g>
        ))}
        
        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={xScale(i)}
            y={height - 15}
            textAnchor="middle"
            className="fill-slate-600 text-xs"
          >
            {d.label}
          </text>
        ))}
        
        {/* X-axis label */}
        {xAxisLabel && (
          <text x={width / 2} y={height - 5} textAnchor="middle" className="fill-slate-600 text-xs">
            {xAxisLabel}
          </text>
        )}
        
        {/* Trend arrow (optional) */}
        {showTrend && data.length > 1 && data[data.length - 1].value > data[0].value && (
          <g>
            <path
              d={`M ${xScale(data.length - 2)} ${yScale(data[data.length - 2].value) - 15} L ${xScale(data.length - 1) + 15} ${yScale(data[data.length - 1].value) - 15}`}
              stroke="#10b981"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
              </marker>
            </defs>
            <text x={xScale(data.length - 1) + 25} y={yScale(data[data.length - 1].value) - 20} className="fill-emerald-600 text-xs font-semibold">
              ↑ Increasing
            </text>
          </g>
        )}
      </svg>
    );
  }
  
  if (type === 'bar') {
    const barWidth = chartWidth / data.length - 10;
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg bg-white rounded-lg">
        {/* Title */}
        {title && (
          <text x={width / 2} y={20} textAnchor="middle" className="fill-slate-700 font-semibold text-sm">
            {title}
          </text>
        )}
        
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + p * chartHeight}
            x2={width - padding.right}
            y2={padding.top + p * chartHeight}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}
        
        {/* Y-axis labels */}
        {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, 0].map((val, i) => (
          <text
            key={i}
            x={padding.left - 10}
            y={padding.top + i * (chartHeight / 4) + 4}
            textAnchor="end"
            className="fill-slate-500 text-xs"
          >
            {Math.round(val)}
          </text>
        ))}
        
        {/* Bars */}
        {data.map((d, i) => (
          <g key={i}>
            <rect
              x={xScale(i) - barWidth / 2}
              y={yScale(d.value)}
              width={barWidth}
              height={chartHeight - (yScale(d.value) - padding.top)}
              fill="#6366f1"
              rx="4"
              className="hover:fill-indigo-500 transition-colors"
            />
            {/* Value label on bar */}
            <text
              x={xScale(i)}
              y={yScale(d.value) - 8}
              textAnchor="middle"
              className="fill-slate-700 text-xs font-semibold"
            >
              {d.value}
            </text>
            {/* Category label */}
            <text
              x={xScale(i)}
              y={height - 15}
              textAnchor="middle"
              className="fill-slate-600 text-xs"
            >
              {d.label}
            </text>
          </g>
        ))}
        
        {/* X-axis label */}
        {xAxisLabel && (
          <text x={width / 2} y={height - 5} textAnchor="middle" className="fill-slate-600 text-xs">
            {xAxisLabel}
          </text>
        )}
      </svg>
    );
  }
  
  return null;
};

export default DataGraph;