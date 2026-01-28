"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, PlayCircle, Star, ArrowRight, X, ChevronRight } from "lucide-react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [tempSelections, setTempSelections] = useState<string[]>([]);
  const [otherValue, setOtherValue] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);

  const questions = [
    {
      id: "goal",
      question: "What is your primary mission?",
      options: ["Dominate Your Physique", "Forging Unbreakable Discipline", "Reclaiming Biological Dominance"],
      allowOther: true,
    },
    {
      id: "experience",
      question: "How long have you settled for average?",
      options: ["Just Starting The Ascent", "1-2 Years Of Stagnation", "3+ Years / Seeking Elite Level"],
      allowOther: false,
    },
    {
      id: "challenge",
      question: "What is your #1 excuse for failure?",
      options: ["Lack of a Proven War-Map", "Wasted Time & Energy", "Weak Environment"],
      allowOther: true,
    },
  ];

  const handleToggleOption = (option: string) => {
    if (tempSelections.includes(option)) {
      setTempSelections(tempSelections.filter((item) => item !== option));
      if (option === "Other") setShowOtherInput(false);
    } else {
      setTempSelections([...tempSelections, option]);
      if (option === "Other") setShowOtherInput(true);
    }
  };

  const handleNext = () => {
    let finalSelections = [...tempSelections];
    if (showOtherInput && otherValue.trim()) {
      finalSelections = finalSelections.filter(s => s !== "Other");
      finalSelections.push(`Other: ${otherValue.trim()}`);
    }
    
    setAnswers({ ...answers, [questions[step].id]: finalSelections });
    setTempSelections([]);
    setOtherValue("");
    setShowOtherInput(false);
    setStep(step + 1);
  };

  const resetModal = () => {
    setShowModal(false);
    setStep(0);
    setAnswers({});
    setTempSelections([]);
    setOtherValue("");
    setShowOtherInput(false);
  };

  const isNextDisabled = tempSelections.length === 0 || (showOtherInput && !otherValue.trim() && tempSelections.length === 1);

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
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest italic">Select at least one option</p>
                  </div>
                  <div className="grid gap-3">
                    {questions[step].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleToggleOption(option)}
                        className={`w-full text-left p-5 border-2 transition-all font-bold text-lg flex justify-between items-center group rounded-sm ${
                          tempSelections.includes(option) 
                            ? "border-red-600 bg-red-50 text-red-900" 
                            : "border-zinc-100 hover:border-zinc-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${
                            tempSelections.includes(option) ? "bg-red-600 border-red-600" : "border-zinc-200"
                          }`}>
                            {tempSelections.includes(option) && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          {option}
                        </div>
                      </button>
                    ))}
                    
                    {questions[step].allowOther && (
                      <div className="space-y-3">
                        <button
                          onClick={() => handleToggleOption("Other")}
                          className={`w-full text-left p-5 border-2 transition-all font-bold text-lg flex justify-between items-center group rounded-sm ${
                            tempSelections.includes("Other") 
                              ? "border-red-600 bg-red-50 text-red-900" 
                              : "border-zinc-100 hover:border-zinc-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${
                              tempSelections.includes("Other") ? "bg-red-600 border-red-600" : "border-zinc-200"
                            }`}>
                              {tempSelections.includes("Other") && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            Other
                          </div>
                        </button>
                        
                        {showOtherInput && (
                          <input
                            type="text"
                            autoFocus
                            value={otherValue}
                            onChange={(e) => setOtherValue(e.target.value)}
                            placeholder="Please specify..."
                            className="w-full p-4 border-2 border-red-200 focus:border-red-600 outline-none font-bold animate-in slide-in-from-top-2 duration-300 bg-zinc-50 rounded-sm"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button
                    disabled={isNextDisabled}
                    onClick={handleNext}
                    className="w-full py-6 bg-zinc-900 text-white font-black uppercase italic tracking-tighter text-xl rounded-sm hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-zinc-900 transition-all flex items-center justify-center gap-3"
                  >
                    CONTINUE <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-red-600">The Ascent Begins.</h3>
                    <p className="text-zinc-600 font-bold leading-relaxed uppercase tracking-tight italic">Your profile has been validated. Enter your best email below to join the <span className="text-red-600 underline">NEWSTANDARD</span> waiting list and receive your first briefing.</p>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); alert("Welcome to the New Standard."); resetModal(); }} className="space-y-4">
                    <input 
                      type="email" 
                      required 
                      placeholder="YOUR BEST EMAIL" 
                      className="w-full px-6 py-5 border-2 border-zinc-100 focus:border-red-600 outline-none text-xl font-black uppercase italic transition-all bg-zinc-50"
                    />
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-6 rounded-sm text-xl shadow-lg transition-all uppercase italic tracking-tighter">
                      JOIN THE BROTHERHOOD
                    </button>
                  </form>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                    WE GUARD YOUR PRIVACY. WE DESPISE SPAM.
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
            <h2 className="text-red-600 font-black tracking-[0.4em] uppercase text-sm italic">The Protocol</h2>
            <h1 className="text-4xl md:text-8xl font-black italic leading-[0.85] uppercase tracking-tighter">
              Stop Existing. <br /> <span className="text-red-600">Start Conquering.</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto font-bold uppercase leading-tight tracking-tight italic">
            The modern world is designed to make you weak, compliant, and average. Break the cycle and reclaim your biological dominance.
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
                Enter The New Standard
              </h3>
              <p className="text-zinc-500 max-w-xl mx-auto font-bold uppercase tracking-tight italic">
                The gates are closing. This is your final briefing. Secure your spot in the brotherhood or stay behind.
              </p>
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-4 bg-red-600 hover:bg-red-700 text-white font-black py-8 px-16 rounded-sm text-2xl shadow-[0_20px_40px_rgba(220,38,38,0.3)] transform transition hover:scale-105 uppercase italic tracking-tighter"
            >
              I'M READY TO CONQUER <ArrowRight className="w-8 h-8" />
            </button>

            <div className="flex justify-center items-center gap-8 pt-8 grayscale opacity-50">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-zinc-900" />)}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-900">3,800+ MEN ALREADY ON THE ASCENT</p>
            </div>
          </div>
        </div>
      </main>

      {/* Pruned Benefits */}
      <section className="bg-zinc-50 py-24 border-y border-zinc-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              "Weaponized Testosterone Protocol",
              "Aesthetic Dominance Framework",
              "Unbreakable Discipline Systems",
              "Elite Performance War-Map"
            ].map((benefit, i) => (
              <div key={i} className="flex gap-6 items-center">
                <CheckCircle2 className="w-8 h-8 text-red-600 flex-shrink-0" />
                <p className="text-xl text-zinc-900 font-black uppercase italic tracking-tighter leading-none">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-red-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9]">THE CHOICE IS YOURS: <br /> EVOLVE OR DECAY.</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-white text-red-600 font-black py-8 px-16 rounded-sm text-2xl shadow-2xl transform transition hover:scale-105 uppercase italic tracking-tighter"
          >
            I'M READY TO CONQUER
          </button>
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
