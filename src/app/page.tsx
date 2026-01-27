"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, PlayCircle, Star, ArrowRight, X, ChevronRight } from "lucide-react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: "goal",
      question: "What is your primary focus right now?",
      options: ["Forging an Elite Physique", "Developing Mental Discipline", "Optimizing Daily Performance"],
    },
    {
      id: "experience",
      question: "How long have you been on this path?",
      options: ["Just Starting", "1-2 Years", "3+ Years / Advanced"],
    },
    {
      id: "challenge",
      question: "What is your #1 obstacle to consistency?",
      options: ["Lack of Clear Strategy", "Time Management", "Mindset & Environment"],
    },
  ];

  const handleOptionSelect = (option: string) => {
    setAnswers({ ...answers, [questions[step].id]: option });
    setStep(step + 1);
  };

  const resetModal = () => {
    setShowModal(false);
    setStep(0);
    setAnswers({});
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900">
      {/* Multi-Step Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="bg-white rounded-sm shadow-2xl max-w-xl w-full p-8 md:p-12 relative border-t-8 border-red-600">
            <button 
              onClick={resetModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-full">
              {step < questions.length ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <p className="text-red-600 font-black uppercase tracking-[0.2em] text-xs italic">Step {step + 1} of {questions.length + 1}</p>
                    <h3 className="text-2xl md:text-3xl font-black uppercase italic leading-tight">{questions[step].question}</h3>
                  </div>
                  <div className="grid gap-4">
                    {questions[step].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        className="w-full text-left p-5 border-2 border-zinc-100 hover:border-red-600 hover:bg-zinc-50 transition-all font-bold text-lg flex justify-between items-center group"
                      >
                        {option}
                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 transform group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">You're a Good Fit.</h3>
                    <p className="text-zinc-600 font-bold leading-relaxed">Enter your email below to join the <span className="text-red-600">NEWSTANDARD</span> waiting list and get the Primal Protocol immediately.</p>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); alert("Welcome to the New Standard."); resetModal(); }} className="space-y-4">
                    <input 
                      type="email" 
                      required 
                      placeholder="YOUR BEST EMAIL" 
                      className="w-full px-6 py-5 border-2 border-zinc-100 focus:border-red-600 outline-none text-xl font-black uppercase italic transition-all bg-zinc-50"
                    />
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-6 rounded-sm text-xl shadow-lg transition-all uppercase italic tracking-tighter">
                      JOIN THE WAITING LIST
                    </button>
                  </form>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    We guard your privacy like our own. No spam, ever.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="py-8 px-6 md:px-12 flex justify-center items-center">
        <div className="font-black text-3xl tracking-tighter text-zinc-900 uppercase italic">
          NEW<span className="text-red-600">STANDARD</span>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-white text-zinc-900 pt-12 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-red-600 font-black tracking-[0.3em] uppercase text-sm italic">The Primal Protocol</h2>
            <h1 className="text-4xl md:text-7xl font-black italic leading-[0.9] uppercase tracking-tighter">
              Reclaim Your <span className="text-red-600 underline decoration-8 underline-offset-8">Masculinity</span> & Forge An Elite Physique
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto font-bold uppercase leading-tight tracking-tight italic">
            Stop being a "passive spectator" in your own life. Optimize your performance and reclaim your edge.
          </p>
        </div>
      </header>

      {/* Video / CTA */}
      <main className="px-6 pb-24">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="bg-zinc-950 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.2)] overflow-hidden aspect-video relative group border-8 border-white ring-1 ring-zinc-200">
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer">
              <PlayCircle className="w-24 h-24 text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            </div>
            <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs font-black uppercase tracking-[0.5em]">
              [ Protocol Briefing ]
            </div>
          </div>

          <div className="text-center space-y-10">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
                Access The New Standard
              </h3>
              <p className="text-zinc-500 max-w-xl mx-auto font-bold uppercase tracking-tight italic">
                The waiting list is currently open for the next 48 hours. Secure your spot in the brotherhood.
              </p>
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-4 bg-red-600 hover:bg-red-700 text-white font-black py-8 px-16 rounded-sm text-2xl shadow-[0_20px_40px_rgba(220,38,38,0.3)] transform transition hover:scale-105 uppercase italic tracking-tighter"
            >
              JOIN THE WAITING LIST <ArrowRight className="w-8 h-8" />
            </button>

            <div className="flex justify-center items-center gap-8 pt-8 grayscale opacity-50">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-zinc-900" />)}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-900">3,800+ Men On The Path</p>
            </div>
          </div>
        </div>
      </main>

      {/* Pruned Benefits */}
      <section className="bg-zinc-50 py-24 border-y border-zinc-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              "Testosterone Optimization Protocol",
              "Aesthetic Authority Framework",
              "Stoic Discipline Systems",
              "Peak Performance Roadmap"
            ].map((benefit, i) => (
              <div key={i} className="flex gap-6 items-center">
                <CheckCircle2 className="w-8 h-8 text-red-600 flex-shrink-0" />
                <p className="text-xl text-zinc-900 font-black uppercase italic tracking-tighter leading-none">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-zinc-400 py-20 px-6 text-center text-[10px] uppercase tracking-[0.3em] font-black">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="font-black text-xl tracking-tighter text-zinc-900 italic">
            NEW<span className="text-red-600">STANDARD</span>
          </div>
          <p>&copy; 2026 NEWSTANDARD. ALL RIGHTS RESERVED.</p>
          <div className="flex justify-center gap-8">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
