
import React, { useEffect, useState } from 'react';
import { TestState, StandardCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsViewProps {
  testState: TestState;
  onReset: () => void;
  finishData?: any;
  studentName?: string;
}

const ResultsView: React.FC<ResultsViewProps> = ({ testState, onReset, finishData, studentName }) => {
  const [aiReport, setAiReport] = useState<{ summary: string; recommendations: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  // Use server-provided data if available, otherwise compute locally
  const totalCorrect = finishData?.totalCorrect ?? testState.questions.reduce((acc, q, idx) => {
    return acc + (testState.userAnswers[idx] === q.correctAnswer ? 1 : 0);
  }, 0);

  const totalQ = finishData?.totalQuestions ?? testState.totalQuestions;
  const percentage = finishData?.percentage ?? (totalCorrect / totalQ) * 100;
  const categoryPerformance = finishData?.categoryPerformance ?? testState.categoryPerformance;

  let level: 1 | 2 | 3 | 4 | 5 = finishData?.level ?? 1;
  if (!finishData) {
    const ability = testState.currentAbilityLevel;
    if (ability >= 4.2 && percentage > 85) level = 5;
    else if (ability >= 3.5 && percentage > 70) level = 4;
    else if (ability >= 2.8 && percentage > 55) level = 3;
    else if (ability >= 2.0 && percentage > 40) level = 2;
    else level = 1;
  }

  const chartData = Object.values(StandardCategory).map(cat => ({
    name: cat.split(' ').slice(0, 2).join(' '),
    score: categoryPerformance[cat]?.total > 0
      ? Math.round((categoryPerformance[cat].correct / categoryPerformance[cat].total) * 100)
      : 0
  }));

  useEffect(() => {
    if (finishData?.aiReport) {
      setAiReport(finishData.aiReport);
      setLoading(false);
    } else {
      // Fallback: no server data
      setAiReport({
        summary: 'Simulation complete. Review your performance by category below.',
        recommendations: [
          'Focus on standards with lower accuracy.',
          'Practice high-complexity data analysis questions.',
        ],
      });
      setLoading(false);
    }
  }, [finishData]);

  const getLevelColor = (l: number) => {
    switch (l) {
      case 5: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 4: return 'text-blue-600 bg-blue-50 border-blue-200';
      case 3: return 'text-amber-600 bg-amber-50 border-amber-200';
      case 2: return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-rose-600 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-10 text-white text-center">
          {studentName && (
            <p className="text-slate-400 text-lg mb-2 font-medium">
              <i className="fa-solid fa-user mr-2"></i>{studentName}
            </p>
          )}
          <h1 className="text-3xl font-bold mb-6">Simulation Results</h1>
          <div className="flex justify-center items-center gap-12">
            <div className="text-center">
              <div className={`text-6xl font-black w-28 h-28 flex items-center justify-center rounded-2xl border-4 ${getLevelColor(level)} mx-auto mb-2`}>
                {level}
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">ACHIEVEMENT LEVEL</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black mb-2">{Math.round(percentage)}%</div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">OVERALL ACCURACY</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black mb-2">{totalCorrect}/{totalQ}</div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">RAW SCORE</p>
            </div>
          </div>
          {finishData && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-bold">
              <i className="fa-solid fa-floppy-disk"></i>
              Grades saved to spreadsheet
            </div>
          )}
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-12">
          {/* Performance Chart */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <i className="fa-solid fa-chart-simple text-indigo-500 mr-2"></i>
              Category Breakdown
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.score > 70 ? '#10b981' : entry.score > 50 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-4">
              {(Object.entries(categoryPerformance) as [string, { correct: number; total: number }][]).map(([cat, stats]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">{cat}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800 font-bold">{stats.correct}/{stats.total}</span>
                    <span className="text-xs text-slate-400">({stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-wand-magic-sparkles text-indigo-500 mr-2"></i>
              Adaptive Insights
            </h2>
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-slate-700 italic leading-relaxed">
                  "{aiReport?.summary}"
                </p>
                <div>
                  <h3 className="font-bold text-indigo-700 text-sm uppercase tracking-wider mb-3">Study Recommendations</h3>
                  <ul className="space-y-3">
                    {aiReport?.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-indigo-600">{i + 1}</span>
                        </div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-center">
          <button
            onClick={onReset}
            className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
          >
            Take New Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
