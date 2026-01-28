"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, PlayCircle, Star, ArrowRight, X, ChevronRight, Menu } from "lucide-react";

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
                    <p className="text-zinc-600 font-bold leading-relaxed uppercase tracking-tight italic">Your profile has been validated. Enter your best email below to join the <span className="text-red-600 underline">NEWSTANDARD</span> waiting list.</p>
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

      {/* Hero Section Structure from Heartbeat Consulting */}
      <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
        {/* Minimal Nav */}
        <nav className="relative z-20 flex justify-between items-center px-8 py-6 max-w-[1400px] mx-auto w-full">
           <div className="font-black text-2xl tracking-tighter text-white uppercase italic">
            NEW<span className="text-red-600">STANDARD</span>
          </div>
          <div className="hidden md:block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Exclusive Training for Men
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow flex items-center justify-center relative z-10 px-6 py-12 lg:py-0">
          {/* Background Grid Pattern (Subtle & Fixed) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#222222_1px,transparent_1px),linear-gradient(to_bottom,#222222_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.2] pointer-events-none" />
          
          <div className="max-w-[1400px] w-full mx-auto grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Left Column: Massive Video Element (Spans 7 columns) */}
            <div className="lg:col-span-7 relative group w-full aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-[0_0_100px_rgba(220,38,38,0.1)] cursor-pointer hover:border-red-600/50 transition-all duration-300">
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full scale-150" />
                  <PlayCircle className="w-24 h-24 text-white relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
                </div>
               </div>
               <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent pt-20 flex justify-between items-end">
                 <div>
                   <div className="flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                     <span className="text-red-500 font-black uppercase tracking-widest text-[10px]">Restricted Access</span>
                   </div>
                   <div className="text-white font-bold text-lg leading-tight">The Primal Protocol Briefing</div>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-xs font-mono text-white/90">
                   12:45
                 </div>
               </div>
            </div>

            {/* Right Column: Copy & CTA (Spans 5 columns) */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-8 text-left relative z-20">
              <div className="inline-flex self-start items-center gap-2 bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm rounded-sm px-3 py-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">
                New Standard Training
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white italic leading-[0.85] tracking-tighter uppercase">
                Stop Existing. <br/>
                <span className="text-red-600 whitespace-nowrap">Start Conquering.</span>
              </h1>
              
              <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-md border-l-2 border-zinc-800 pl-6">
                The modern world is designed to make you weak, compliant, and average. We help men reclaim their biological dominance and build a legacy.
              </p>

              <div className="pt-4">
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-6 px-8 rounded-sm text-xl shadow-[0_10px_40px_rgba(220,38,38,0.3)] transform transition hover:scale-[1.02] active:scale-[0.98] uppercase italic tracking-tighter flex items-center justify-center gap-3 group"
                >
                  I'M READY TO CONQUER 
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Join 3,800+ Men On The Path
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* Footer Logos */}
        <div className="relative z-10 py-12 border-t border-zinc-900 bg-black">
          <div className="max-w-[1400px] mx-auto px-6 text-center">
             <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-8">As seen in</p>
             <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Placeholders for logos, styled as simple text for now or replace with images */}
               <h3 className="text-2xl font-black text-white italic">MEN'S HEALTH</h3>
               <h3 className="text-2xl font-black text-white italic">FORBES</h3>
               <h3 className="text-2xl font-black text-white italic">GQ</h3>
               <h3 className="text-2xl font-black text-white italic">ROGUE</h3>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
