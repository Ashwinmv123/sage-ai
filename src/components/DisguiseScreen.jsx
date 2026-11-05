import React, { useState } from 'react';
import { Search, ExternalLink, RefreshCw, Sun, CloudRain, BookOpen } from 'lucide-react';

export default function DisguiseScreen({ onExit }) {
  const [activeMode, setActiveMode] = useState('wikipedia'); // 'wikipedia' | 'calculator' | 'weather'
  const [calcInput, setCalcInput] = useState('0');

  const handleCalc = (val) => {
    if (val === 'C') {
      setCalcInput('0');
    } else if (val === '=') {
      try {
        // Safe evaluation
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        setCalcInput(String(Function(`'use strict'; return (${sanitized})`)()));
      } catch (e) {
        setCalcInput('Error');
      }
    } else {
      setCalcInput(prev => prev === '0' || prev === 'Error' ? val : prev + val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] text-[#202122] overflow-y-auto font-sans selection:bg-[#c8ccd1] select-text">
      {/* Top subtle decoy navbar */}
      <header className="bg-white border-b border-[#a2a9b1] px-4 py-2 flex items-center justify-between text-xs text-[#54595d]">
        <div className="flex items-center gap-4">
          <span className="font-serif font-bold text-base text-black tracking-tight flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#3366cc]" />
            Wikipedia
          </span>
          <span className="italic text-[#72777d] hidden sm:inline">The Free Encyclopedia</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#eaecf0] rounded p-0.5 text-[11px]">
            <button 
              onClick={() => setActiveMode('wikipedia')}
              className={`px-2 py-0.5 rounded ${activeMode === 'wikipedia' ? 'bg-white shadow-sm font-medium text-black' : 'text-[#54595d]'}`}
            >
              Article: Quantum Computing
            </button>
            <button 
              onClick={() => setActiveMode('calculator')}
              className={`px-2 py-0.5 rounded ${activeMode === 'calculator' ? 'bg-white shadow-sm font-medium text-black' : 'text-[#54595d]'}`}
            >
              Calculator
            </button>
            <button 
              onClick={() => setActiveMode('weather')}
              className={`px-2 py-0.5 rounded ${activeMode === 'weather' ? 'bg-white shadow-sm font-medium text-black' : 'text-[#54595d]'}`}
            >
              Weather
            </button>
          </div>

          {/* Discreet Exit trigger */}
          <button
            onClick={onExit}
            className="px-2.5 py-1 text-[11px] rounded bg-[#3366cc] hover:bg-[#2a4b8d] text-white font-medium transition-colors shadow-sm"
            title="Press Esc or Click here to return to SAGE"
          >
            Resume (Esc)
          </button>
        </div>
      </header>

      {/* Main Decoy Body */}
      {activeMode === 'wikipedia' && (
        <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
          <div className="border-b border-[#a2a9b1] pb-2">
            <h1 className="font-serif text-3xl font-normal text-black">Quantum computing</h1>
            <p className="text-xs text-[#54595d] mt-1">From Wikipedia, the free encyclopedia</p>
          </div>

          <div className="text-sm leading-relaxed space-y-4 text-[#202122]">
            <p>
              <strong>Quantum computing</strong> is a multidisciplinary field comprising aspects of computer science, physics, and mathematics that utilizes the principles of quantum mechanics to solve complex problems faster than on classical computers. The field of quantum computing includes hardware research and software development.
            </p>

            <div className="float-right ml-6 mb-4 w-72 bg-[#f8f9fa] border border-[#a2a9b1] p-3 text-xs space-y-2 rounded shadow-sm">
              <div className="font-bold text-center border-b border-[#c8ccd1] pb-1">Quantum Computer</div>
              <div className="h-40 bg-slate-200 rounded flex items-center justify-center text-[#72777d] font-mono text-xs">
                [Decoy Scientific Diagram]
              </div>
              <p className="text-[11px] text-[#54595d]">A dilution refrigerator cryostat used in superconducting quantum processors.</p>
            </div>

            <p>
              Quantum computers are machines that use the properties of quantum physics to store data and perform computations. This can be extremely advantageous for certain tasks where they could vastly outperform even our best supercomputers.
            </p>

            <h2 className="font-serif text-xl border-b border-[#c8ccd1] pb-1 pt-4 text-black">1. Fundamentals of Qubits</h2>
            <p>
              Classical computers, which include smartphones and supercomputers, encode information in binary bits that can either be 0s or 1s. In contrast, quantum computing uses <em>qubits</em>. Due to quantum superposition, qubits can exist in states corresponding to a linear combination of both 0 and 1 simultaneously.
            </p>

            <h2 className="font-serif text-xl border-b border-[#c8ccd1] pb-1 pt-4 text-black">2. Applications in Cryptography</h2>
            <p>
              A major area of research is Shor's algorithm, which demonstrates that polynomial-time quantum algorithms can find the prime factors of an integer. This has significant implications for RSA public-key encryption schemes.
            </p>
          </div>
        </main>
      )}

      {activeMode === 'calculator' && (
        <main className="max-w-sm mx-auto p-8 mt-12 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="mb-4 text-right p-4 bg-slate-100 rounded-xl font-mono text-2xl text-slate-800 break-all h-16 flex items-center justify-end overflow-hidden">
            {calcInput}
          </div>
          <div className="grid grid-cols-4 gap-2 text-sm font-semibold">
            {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map(btn => (
              <button
                key={btn}
                onClick={() => handleCalc(btn)}
                className={`p-3.5 rounded-xl transition-all ${
                  btn === '=' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                  ['/', '*', '-', '+'].includes(btn) ? 'bg-slate-200 text-blue-600 hover:bg-slate-300' :
                  btn === 'C' ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' :
                  'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </main>
      )}

      {activeMode === 'weather' && (
        <main className="max-w-md mx-auto p-8 mt-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-xl border border-blue-200 text-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">New Delhi, IN</h2>
              <p className="text-xs text-slate-500">Sunday, 10 October • Clear Sky</p>
            </div>
            <Sun className="w-10 h-10 text-amber-500 animate-spin-slow" />
          </div>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight">28°</span>
            <span className="text-sm font-medium text-slate-600">Feels like 30°C</span>
          </div>
          <div className="mt-6 pt-4 border-t border-blue-200/60 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-white/70 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Humidity</span>
              <strong>58%</strong>
            </div>
            <div className="p-2 bg-white/70 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Wind</span>
              <strong>12 km/h</strong>
            </div>
            <div className="p-2 bg-white/70 rounded-xl">
              <span className="text-slate-400 block text-[10px]">AQI</span>
              <strong className="text-emerald-600">84 (Moderate)</strong>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
