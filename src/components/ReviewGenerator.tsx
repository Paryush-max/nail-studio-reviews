"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Copy, RefreshCw, Check } from "lucide-react";
import toast from "react-hot-toast";

const SERVICES = [
  "Gum gel extension 🌸", 
  "Gel extension ✨", 
  "Soft gel extension 💅", 
  "Temporary nail extension ⏱️", 
  "Gel overlay 🛡️", 
  "Gum gel overlay 💖", 
  "Press-on 🎀"
];

// REMOVED: "Clean salon 🧼"
const EXPERIENCES = [
  "Friendly artist 🥰", 
  "Premium experience 💎", 
  "Fast service ⚡", 
  "Long lasting 🛡️", 
  "Beautiful art 🎨", 
  "Hygienic setup 🌿", 
  "Great pricing 💰"
];

const RATING_LABELS: Record<number, string> = {
  0: "Tap a star to rate your visit",
  1: "Disappointing 💔",
  2: "Could be better 🔍",
  3: "Good experience ✨",
  4: "Love it! 💖",
  5: "Flawless & Perfect! 💅✨"
};

export function ReviewGenerator() {
  const [rating, setRating] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReview, setGeneratedReview] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const stripEmoji = (str: string) => str.replace(/[\u1000-\uFFFF]+/g, '').trim();

  const toggleSelection = (item: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(item)) setList(list.filter((i) => i !== item));
    else setList([...list, item]);
  };

  const handleGenerate = async () => {
    if (rating === 0) {
      toast.error("Please pick a star rating first! ⭐");
      return;
    }

    if (selectedServices.length === 0) {
      toast.error("Please pick at least one service! 💅");
      return;
    }

    // Only force them to pick an experience if they gave 4 or 5 stars
    if (rating >= 4 && selectedExperiences.length === 0) {
      toast.error("Please tell us what you loved! 💖");
      return;
    }

    setIsGenerating(true);
    setGeneratedReview(""); 
    
    const cleanServices = selectedServices.map(stripEmoji);
    const cleanExperiences = selectedExperiences.map(stripEmoji);

    try {
      const res = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rating, 
          services: cleanServices, 
          experiences: cleanExperiences, 
          notes
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }

      // The Live Stream Decoder
      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      
      if (!reader) throw new Error("Stream failed to initialize");

      let done = false;
      let streamedText = "";

      // Loops constantly, typing out words the second they arrive
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          streamedText += chunk;
          setGeneratedReview(streamedText.replace(/"/g, '')); 
        }
      }
      
      toast.success("Review is ready! ✨");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate review.");
    } finally {
      setIsGenerating(false); // Typing finished!
    }
  };

  const handleCopyAndRedirect = async () => {
    if (!generatedReview) return;
    
    await navigator.clipboard.writeText(generatedReview);
    setIsCopied(true);
    toast.success("Opening Google Maps... 🗺️");
    
    setTimeout(() => {
      const reviewLink = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_LINK;
      if (reviewLink) {
        window.open(reviewLink, "_blank");
      }
      setIsCopied(false);
    }, 1200);
  };

  return (
    <div className="light w-full max-w-2xl mx-auto px-3 sm:px-4 pb-24 relative z-10 text-slate-800">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-8 shadow-xl border border-white/40 flex flex-col gap-6"
      >
        <div className="text-center pt-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">Loved your nails? 💅</h2>
          <p className="text-xs sm:text-sm text-slate-500">Rate your visit and we'll write a perfect review for you!</p>
        </div>

        {/* Section 1: Star Rating */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">Your Rating</span>
          <div className="flex gap-2 sm:gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((star) => {
              const isSelected = star <= rating;
              return (
                <button key={star} onClick={() => setRating(star)} className="focus:outline-none cursor-pointer p-0.5 relative bg-transparent border-0 outline-none">
                  <motion.div animate={{ scale: isSelected ? 1.18 : 1 }} whileTap={{ scale: 0.85 }}>
                    <Star className={`w-9 h-9 sm:w-11 sm:h-11 drop-shadow-sm ${isSelected ? "fill-rose-400 text-rose-400" : "text-slate-200"}`} />
                  </motion.div>
                </button>
              );
            })}
          </div>
          <p className="text-xs font-semibold text-rose-400 mt-3 h-4">{RATING_LABELS[rating]}</p>
        </div>

        {/* Section 2: Services */}
        <AnimatePresence>
          {rating > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Select Services</label>
              <div className="flex flex-wrap gap-2.5">
                {SERVICES.map((s) => (
                  <button key={s} onClick={() => toggleSelection(s, selectedServices, setSelectedServices)} className={`py-2.5 px-3.5 rounded-xl text-xs font-medium border transition-all duration-200 active:scale-95 cursor-pointer text-center ${selectedServices.includes(s) ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white border-transparent shadow-md shadow-pink-500/10 font-semibold" : "bg-slate-50/60 text-slate-600 border-slate-100 hover:border-rose-200"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 3: Experiences (ONLY SHOWS FOR 4 AND 5 STARS) */}
        <AnimatePresence>
          {rating >= 4 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm overflow-hidden">
              <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">What did you love?</label>
              <div className="flex flex-wrap gap-2.5">
                {EXPERIENCES.map((e) => (
                  <button key={e} onClick={() => toggleSelection(e, selectedExperiences, setSelectedExperiences)} className={`py-2.5 px-3.5 rounded-xl text-xs font-medium border transition-all duration-200 active:scale-95 cursor-pointer text-left ${selectedExperiences.includes(e) ? "bg-rose-50 text-rose-600 border-rose-200 font-semibold" : "bg-slate-50/60 text-slate-500 border-slate-100 hover:bg-slate-50"}`}>
                    {e}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section 4: Optional Detail */}
        <AnimatePresence>
          {rating > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
                {rating >= 4 ? "Add specific detail (Optional)" : "Please tell us what went wrong so we can fix it"}
              </label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full bg-slate-50/50 border border-slate-100 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 outline-none resize-none text-slate-800 placeholder:text-slate-300" placeholder={rating >= 4 ? "e.g., The chrome design turned out flawless..." : "e.g., The wait time was too long..."} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button hides while typing */}
        <AnimatePresence>
          {!isGenerating && !generatedReview && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleGenerate} className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white font-medium text-base shadow-lg shadow-pink-500/15 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold mt-2">
              Write My Review ✨
            </motion.button>
          )}
        </AnimatePresence>

        {/* Output Module */}
        <AnimatePresence>
          {(generatedReview || isGenerating) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-2"
            >
              <motion.div 
                layout 
                className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/60 to-pink-50/40 border border-pink-100 relative shadow-md min-h-[100px] flex flex-col justify-center overflow-hidden"
              >
                <motion.p 
                  layout 
                  className={`font-serif text-base sm:text-lg leading-relaxed ${
                    generatedReview 
                      ? 'text-slate-800 italic' 
                      : 'bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 animate-pulse text-center font-semibold tracking-wide'
                  }`}
                >
                  {generatedReview 
                    ? `"${generatedReview}${isGenerating ? " ✍️" : ""}"` 
                    : (isGenerating ? "Writing your perfect review... ✨" : "")}
                </motion.p>
                
                {!isGenerating && generatedReview && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex flex-col sm:flex-row gap-3">
                    <button onClick={handleCopyAndRedirect} className="flex-1 py-3.5 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer">
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Paste it on Google Review
                    </button>
                    <button onClick={handleGenerate} className="py-3.5 px-5 rounded-xl bg-white text-slate-600 border border-slate-200 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer">
                      <RefreshCw className="w-4 h-4" /> Try Another
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}