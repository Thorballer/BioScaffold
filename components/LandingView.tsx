
import React, { useState } from 'react';

interface LandingViewProps {
  onStart: (studentName: string) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!studentName.trim()) return;
    setLoading(true);
    await onStart(studentName.trim());
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
            <i className="fa-solid fa-microscope text-4xl"></i>
          </div>
          <h1 className="text-3xl font-bold mb-2">Florida Biology EOC Simulation</h1>
          <p className="text-indigo-100 text-lg">Adaptive Performance Assessment</p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                <i className="fa-solid fa-circle-info text-indigo-500 mr-2"></i>
                Test Parameters
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                  <span>60 Questions aligned to NGSSS Biology standards.</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                  <span>Adaptive difficulty based on your accuracy.</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                  <span>Scores reported on the official 1–5 level scale.</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                  <span>Detailed standard-by-standard breakdown.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Target Standards</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600">Molecular Biology</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600">Genetics</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600">Evolution</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600">Ecology</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600">Human Systems</span>
              </div>
            </div>
          </div>

          {/* Student Name Input */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md mb-6">
              <label htmlFor="student-name" className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">
                <i className="fa-solid fa-user mr-2 text-indigo-500"></i>
                Enter Your Name
              </label>
              <input
                id="student-name"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                placeholder="First and Last Name"
                className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-slate-800 placeholder:text-slate-400"
                autoFocus
              />
            </div>


            <button
              onClick={handleStart}
              disabled={!studentName.trim() || loading}
              className={`px-12 py-4 rounded-full text-xl font-bold shadow-lg transition-all mb-4 ${!studentName.trim() || loading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Starting...
                </>
              ) : (
                'Start Full Simulation'
              )}
            </button>
            <p className="text-slate-500 text-sm mb-6">Estimated time: 45–90 minutes</p>

            {/* Teacher Access */}
            <div className="w-full max-w-md pt-6 border-t border-slate-200">
              <a
                href="/teacher/"
                className="flex items-center justify-center space-x-2 text-slate-600 hover:text-purple-600 transition-colors"
              >
                <i className="fa-solid fa-chalkboard-user text-lg"></i>
                <span className="text-sm font-medium">Not a Student? Teacher Login</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
