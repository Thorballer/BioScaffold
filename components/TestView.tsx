
import React, { useState, useEffect } from 'react';
import { Question, TestState, StandardCategory } from '../types';
import QuestionVisual from './QuestionVisual';

interface TestViewProps {
  testState: TestState;
  getNextQuestion: () => { question: Question; questionNumber: number; totalQuestions: number; currentAbilityLevel: number } | null;
  onAnswer: (question: Question, answerIndex: number) => void;
  onFinish: () => void;
}

const TestView: React.FC<TestViewProps> = ({ testState, getNextQuestion, onAnswer, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string; correctAnswer: number } | null>(null);

  const fetchNextQuestion = () => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setSelectedOption(null); // ALWAYS clear selection when loading new question
    try {
      const result = getNextQuestion();
      if (result) {
        setCurrentQuestion(result.question);
      } else {
        setError('No more questions available.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate question.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testState.status === 'testing') {
      fetchNextQuestion();
    }
  }, [testState.currentQuestionIndex]);

  // Backup: clear selection AND feedback whenever currentQuestion changes
  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);
  }, [currentQuestion?.id]);

  const handleSubmit = () => {
    if (selectedOption === null || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // Show feedback FIRST (before calling onAnswer which triggers next question load)
    setFeedback({
      isCorrect,
      explanation: currentQuestion.explanation,
      correctAnswer: currentQuestion.correctAnswer,
    });

    // Wait before calling onAnswer (which changes question index)
    // This ensures feedback is shown for the correct question
    setTimeout(() => {
      onAnswer(currentQuestion, selectedOption!);
      
      // If finished, trigger finish flow after showing feedback
      if (testState.currentQuestionIndex + 1 >= testState.totalQuestions) {
        setTimeout(() => {
          onFinish();
        }, 1500);
      }
    }, 100);
  };

  const handleNext = () => {
    // Clear ALL state before moving to next question
    setSelectedOption(null);
    setFeedback(null);
    // The useEffect will fetch the next question when currentQuestionIndex changes
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-6"></div>
        <p className="text-slate-600 text-lg font-medium animate-pulse">Loading question {testState.currentQuestionIndex + 1}...</p>
        <p className="text-slate-400 text-sm mt-2">Selecting standard and difficulty level...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchNextQuestion} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Retry</button>
      </div>
    );
  }

  const progress = (testState.currentQuestionIndex / testState.totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-slate-500">QUESTION {testState.currentQuestionIndex + 1} OF {testState.totalQuestions}</span>
          <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded">{currentQuestion?.difficulty} COMPLEXITY</span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
            {currentQuestion?.category}
          </span>
          <span className="text-slate-400 text-xs font-mono">{currentQuestion?.standard}</span>
        </div>

        <div className="mb-8">
          <QuestionVisual 
            text={currentQuestion?.text || ''} 
            graphData={currentQuestion?.graphData}
          />
        </div>

        <div className="space-y-4">
          {currentQuestion?.options.map((option, idx) => {
            // Base: plain, unselected
            // Hover: subtle shadow lift (NOT color change that looks like selection)
            // Selected: indigo border + background
            // Feedback: green for correct, red for wrong
            let btnClass = 'border-slate-200 hover:shadow-md hover:border-slate-300 transition-shadow';
            if (feedback) {
              if (idx === feedback.correctAnswer) {
                btnClass = 'border-green-500 bg-green-50';
              } else if (idx === selectedOption && !feedback.isCorrect) {
                btnClass = 'border-red-500 bg-red-50';
              } else {
                btnClass = 'border-slate-200 opacity-50';
              }
            } else if (selectedOption === idx) {
              btnClass = 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200';
            }

            return (
              <button
                key={idx}
                onClick={() => !feedback && setSelectedOption(idx)}
                disabled={!!feedback}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center ${btnClass}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0 font-bold ${feedback && idx === feedback.correctAnswer
                  ? 'bg-green-500 text-white'
                  : feedback && idx === selectedOption && !feedback.isCorrect
                    ? 'bg-red-500 text-white'
                    : selectedOption === idx
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                  {feedback && idx === feedback.correctAnswer ? (
                    <i className="fa-solid fa-check"></i>
                  ) : feedback && idx === selectedOption && !feedback.isCorrect ? (
                    <i className="fa-solid fa-xmark"></i>
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </div>
                <span className={`text-lg ${selectedOption === idx ? 'text-indigo-900 font-medium' : 'text-slate-700'}`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mt-6 p-4 rounded-xl ${feedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-bold mb-1 ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {feedback.isCorrect ? (
                <><i className="fa-solid fa-circle-check mr-2"></i>Correct!</>
              ) : (
                <><i className="fa-solid fa-circle-xmark mr-2"></i>Incorrect</>
              )}
            </p>
            <p className="text-slate-600 text-sm">{feedback.explanation}</p>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          {feedback ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-full font-bold text-lg transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95"
            >
              {testState.currentQuestionIndex >= testState.totalQuestions ? 'View Results' : 'Next Question'}
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${selectedOption === null
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95'
                }`}
            >
              Submit Answer
              <i className="fa-solid fa-paper-plane ml-2"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestView;
