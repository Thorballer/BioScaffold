
import React, { useState, useRef } from 'react';
import { TestState, Question, StandardCategory } from './types';
import { QuizEngine, FinishResult } from './services/quizEngine';
import LandingView from './components/LandingView';
import TestView from './components/TestView';
import ResultsView from './components/ResultsView';

const initialState: TestState = {
  currentQuestionIndex: 0,
  totalQuestions: 60,
  questions: [],
  userAnswers: [],
  currentAbilityLevel: 2.5,
  startTime: 0,
  endTime: null,
  status: 'idle',
  categoryPerformance: {
    [StandardCategory.CELLS]: { correct: 0, total: 0 },
    [StandardCategory.GENETICS]: { correct: 0, total: 0 },
    [StandardCategory.EVOLUTION]: { correct: 0, total: 0 },
    [StandardCategory.ECOLOGY]: { correct: 0, total: 0 },
  }
};

const App: React.FC = () => {
  const [testState, setTestState] = useState<TestState>(initialState);
  const [studentName, setStudentName] = useState<string>('');
  const [finishData, setFinishData] = useState<FinishResult | null>(null);
  const engineRef = useRef<QuizEngine | null>(null);

  const startTest = async (name: string) => {
    const engine = new QuizEngine(name);
    engineRef.current = engine;
    setStudentName(name);
    setTestState({
      ...initialState,
      totalQuestions: engine.getTotalQuestions(),
      startTime: Date.now(),
      status: 'testing',
    });
  };

  const handleAnswer = (question: Question, answerIndex: number) => {
    const engine = engineRef.current;
    if (!engine) return;

    const result = engine.submitAnswer(question, answerIndex);

    setTestState(prev => ({
      ...prev,
      currentQuestionIndex: result.currentQuestionIndex,
      questions: [...prev.questions, question],
      userAnswers: [...prev.userAnswers, answerIndex],
      currentAbilityLevel: result.currentAbilityLevel,
      status: result.isFinished ? 'finished' : 'testing',
      endTime: result.isFinished ? Date.now() : null,
      categoryPerformance: result.categoryPerformance as TestState['categoryPerformance'],
    }));
  };

  const handleFinish = async () => {
    const engine = engineRef.current;
    if (!engine) return;

    const result = engine.finish();
    setFinishData(result);
    setTestState(p => ({ ...p, status: 'finished', endTime: Date.now() }));

    // POST grade to server for teacher dashboard (fire-and-forget)
    try {
      await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: result.studentName,
          date: new Date().toISOString(),
          score: `${result.totalCorrect}/${result.totalQuestions}`,
          percentage: result.percentage,
          level: result.level,
          totalQuestions: result.totalQuestions,
          totalCorrect: result.totalCorrect,
          currentAbilityLevel: result.currentAbilityLevel,
          categoryPerformance: result.categoryPerformance,
          categoryPercentages: result.categoryPercentages,
          aiReport: result.aiReport,
        }),
      });
    } catch (err) {
      // Grade saving is best-effort — quiz still works without it
      console.warn('Could not save grade to server:', err);
    }
  };

  const getNextQuestion = (): { question: Question; questionNumber: number; totalQuestions: number; currentAbilityLevel: number } | null => {
    const engine = engineRef.current;
    if (!engine) return null;
    return engine.getNextQuestion();
  };

  const resetTest = () => {
    setTestState(initialState);
    setStudentName('');
    setFinishData(null);
    engineRef.current = null;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl shadow-indigo-200 shadow-lg">
              B
            </div>
            <div>
              <h1 className="text-slate-800 font-black tracking-tight leading-none">FLADAPT</h1>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Biology EOC Coach</span>
            </div>
          </div>

          {testState.status === 'testing' && (
            <div className="hidden sm:flex items-center gap-6">
              {studentName && (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Student</span>
                  <span className="text-slate-700 font-semibold text-sm leading-none">{studentName}</span>
                </div>
              )}
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Level</span>
                <span className="text-indigo-600 font-bold text-lg leading-none">{Math.round(testState.currentAbilityLevel * 10) / 10}</span>
              </div>
              <button
                onClick={() => { if (confirm('Exit simulation? Progress will be lost.')) resetTest(); }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
          )}
        </div>
      </nav>

      <main>
        {testState.status === 'idle' && (
          <LandingView onStart={startTest} />
        )}

        {testState.status === 'testing' && (
          <TestView
            testState={testState}
            getNextQuestion={getNextQuestion}
            onAnswer={handleAnswer}
            onFinish={handleFinish}
          />
        )}

        {testState.status === 'finished' && (
          <ResultsView
            testState={testState}
            onReset={resetTest}
            finishData={finishData}
            studentName={studentName}
          />
        )}
      </main>

      <footer className="py-12 px-6 bg-slate-50 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm">
            © 2024 Florida Biology Adaptive Simulation. Not an official FLDOE tool.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Standards Overview</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
