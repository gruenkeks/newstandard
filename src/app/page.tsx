"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { CheckCircle2, PlayCircle, Star, ArrowRight, X, ChevronRight, Menu } from "lucide-react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasShownExitModal, setHasShownExitModal] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [tempSelections, setTempSelections] = useState<string[]>([]);
  const [otherValue, setOtherValue] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Exit Intent Hook
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitModal && !showModal) {
        setShowExitModal(true);
        setHasShownExitModal(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShownExitModal, showModal]);

  const questions = [
    {
      id: "goal",
      question: "What is your main goal right now?",
      options: ["Build Muscle & Lose Fat", "Build Better Habits & Discipline", "Optimize Health & Energy"],
      allowOther: true,
    },
    {
      id: "experience",
      question: "How long have you been training?",
      options: ["I'm Just Starting", "1-2 Years", "3+ Years"],
      allowOther: false,
    },
    {
      id: "challenge",
      question: "What is stopping you from seeing results?",
      options: ["I Don't Have A Clear Plan", "Lack Of Time", "Staying Consistent", "Not Sure"],
      allowOther: true,
    },
    {
      id: "investment",
      question: "If you could have your dream life situation 100% guaranteed, would you be willing to invest significantly?",
      options: [
        "Yes, absolutely. I invest in myself.",
        "It depends on the offer.",
        "I'm not ready to spend money right now to change my situation"
      ],
      allowOther: false,
    },
  ];

  const handleToggleOption = (option: string) => {
    if (tempSelections.includes(option)) {
      setTempSelections(tempSelections.filter((item) => item !== option));
      if (option === "Other") setShowOtherInput(false);
    } else {
      // For single select questions (like investment), clear other selections
      if (questions[step].id === "investment" || questions[step].id === "experience") {
        setTempSelections([option]);
      } else {
        setTempSelections([...tempSelections, option]);
      }
      
      if (option === "Other") setShowOtherInput(true);
    }
  };

  const handleNext = () => {
    let finalSelections = [...tempSelections];
    if (showOtherInput && otherValue.trim()) {
      finalSelections = finalSelections.filter(s => s !== "Other");
      finalSelections.push(`Other: ${otherValue.trim()}`);
    }
    
    // Disqualification Check
    if (questions[step].id === "investment") {
      if (finalSelections.some(s => s.includes("not ready to spend money"))) {
        setIsDisqualified(true);
      }
    }
    
    setAnswers({ ...answers, [questions[step].id]: finalSelections });
    setTempSelections([]);
    setOtherValue("");
    setShowOtherInput(false);
    setStep(step + 1);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);

  // Initialize Cal.com
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", { 
        styles: { branding: { brandColor: "#DC2626" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Get email from form
    const emailInput = (e.target as HTMLFormElement).querySelector('input[type="email"]') as HTMLInputElement;
    const email = emailInput.value;

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answers }),
      });

      if (response.ok) {
        alert("Welcome to the New Standard. Check your inbox.");
        resetModal();
        setShowExitModal(false);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      {/* Exit Intent Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all animate-in fade-in duration-300">
          <div className="bg-zinc-950 rounded-xl shadow-2xl max-w-lg w-full p-8 relative border-2 border-red-600 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowExitModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 border border-red-600/20 mb-2">
                <span className="text-3xl">⚠️</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                  JOIN THE INSIDER LIST
                </h3>
                <p className="text-zinc-400 font-medium leading-relaxed">
                  Get exclusive access to <span className="text-white font-bold">New Standard</span> updates, private offers, and high-level strategies sent directly to your inbox. No fluff, just value.
                </p>
              </div>

              <div className="pt-2 space-y-3">
                {/* Simple Email Capture Form inside Exit Intent */}
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input 
                    type="email" 
                    required 
                    placeholder="Your E-Mail" 
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-sm text-white placeholder:text-zinc-600 focus:border-red-600 outline-none transition-all"
                  />
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-sm text-lg shadow-lg uppercase italic tracking-tighter transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "JOINING..." : "SIGN UP"}
                  </button>
                </form>
                
                <button 
                  onClick={() => setShowExitModal(false)}
                  className="text-zinc-600 text-xs font-bold uppercase tracking-widest hover:text-zinc-400 transition-colors"
                >
                  No thanks, I'll miss out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <p className="text-red-600 font-black uppercase tracking-[0.2em] text-xs italic">Step {step + 1} of {questions.length}</p>
                    <h3 className="text-2xl md:text-3xl font-black uppercase italic leading-tight">{questions[step].question}</h3>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest italic">Select one option</p>
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
                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 h-full flex flex-col justify-center">
                  {isDisqualified ? (
                    <div className="space-y-6">
                      <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-zinc-400">Join The Insider List.</h3>
                      <p className="text-zinc-600 font-bold leading-relaxed uppercase tracking-tight italic">
                        The full protocol requires a significant commitment. However, you can still get valuable insights, training updates, and exclusive tips by joining our free insider newsletter.
                      </p>
                      
                      <form onSubmit={handleSubscribe} className="space-y-4 max-w-sm mx-auto">
                        <input 
                          type="email" 
                          required 
                          placeholder="Your E-Mail" 
                          className="w-full px-6 py-5 border-2 border-zinc-100 focus:border-red-600 outline-none text-xl font-black uppercase italic transition-all bg-zinc-50"
                        />
                        <button 
                          disabled={isSubmitting}
                          className="w-full bg-zinc-900 hover:bg-black text-white font-black py-6 rounded-sm text-xl shadow-lg transition-all uppercase italic tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "PROCESSING..." : "JOIN FOR FREE"}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="w-full h-[700px] md:h-[800px] overflow-hidden rounded-sm border-2 border-zinc-100 flex flex-col bg-white">
                      <div className="bg-zinc-50 p-4 border-b border-zinc-200 text-center flex-shrink-0">
                        <h3 className="text-lg font-black uppercase italic tracking-tighter text-zinc-900">
                          Book your free 15 minute strategy call now:
                        </h3>
                      </div>
                      <div className="flex-grow relative w-full h-full">
                        <Cal 
                          calLink="dennis-simontowsky-myvg0r/free-15-minute-strategy-call"
                          style={{width:"100%",height:"100%",overflow:"auto"}}
                          config={{
                            layout: 'month_view', 
                            theme: 'light',
                            ...(answers['name'] && answers['name'][0] ? { name: answers['name'][0] } : {}),
                            ...(answers['email'] && answers['email'][0] ? { email: answers['email'][0] } : {}),
                            notes: `Goal: ${answers['goal']?.join(', ') || ''}\nExperience: ${answers['experience']?.join(', ') || ''}\nChallenge: ${answers['challenge']?.join(', ') || ''}\nInvestment: ${answers['investment']?.join(', ') || ''}`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section Structure from Heartbeat Consulting */}
      <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
        {/* Minimal Nav */}
          <nav className="relative z-20 flex justify-between items-center px-4 md:px-8 py-6 max-w-[1400px] mx-auto w-full">
           <div className="font-black text-2xl tracking-tighter text-white uppercase italic">
            NEW<span className="text-red-600">STANDARD</span>
          </div>
          <div className="hidden md:block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow flex items-center justify-center relative z-10 px-4 md:px-6 py-12 lg:py-0">
          {/* Background Grid Pattern (Subtle & Fixed) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(220,38,38,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] opacity-[0.6] pointer-events-none" />
          
          <div className="max-w-[1400px] w-full mx-auto grid lg:grid-cols-12 gap-8 lg:gap-24 items-center">
            
            {/* Left Column: Massive Video Element (Spans 7 columns) */}
            <div 
              className="lg:col-span-7 relative group w-full aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-[0_0_100px_rgba(220,38,38,0.1)] cursor-pointer hover:border-red-600/50 transition-all duration-300"
              onClick={() => !isPlaying && setIsPlaying(true)}
            >
               {isPlaying ? (
                 <video 
                   src="/videos/VSL.mp4" 
                   className="w-full h-full object-cover" 
                   controls 
                   autoPlay 
                 />
               ) : (
                 <>
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
                         
                       </div>
                       <div className="text-white font-bold text-lg leading-tight">The New Standard Briefing</div>
                     </div>
                     <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded text-xs font-mono text-white/90">
                       12:45
                     </div>
                   </div>
                 </>
               )}
            </div>

            {/* Right Column: Copy & CTA (Spans 5 columns) */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-8 text-left relative z-20">
              <div className="inline-flex self-start items-center gap-2 bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm rounded-sm px-3 py-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">
                New Standard Training
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black text-white italic leading-[0.85] tracking-tighter uppercase">
                Stop Existing. <br/>
                <span className="text-red-600">Start Conquering.</span>
              </h1>
              
              <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-md border-l-2 border-zinc-800 pl-6">
                The modern world is designed to make you weak, compliant, and average. We help men forge an elite physique, unbreakable discipline, and true sovereignty.
              </p>

              <div className="pt-4">
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 md:py-6 px-4 md:px-8 rounded-sm text-lg md:text-xl shadow-[0_10px_40px_rgba(220,38,38,0.3)] transform transition hover:scale-[1.02] active:scale-[0.98] uppercase italic tracking-tighter flex items-center justify-center gap-2 md:gap-3 group"
                >
                  BOOK A FREE STRATEGY CALL 
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

        </div>
      </main>

      </div>
    </div>
  );
}
