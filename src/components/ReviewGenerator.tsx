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

const EXPERIENCES = ["Friendly artist 🥰","Premium experience 💎", "Fast service ⚡", "Long lasting 🛡️", "Beautiful art 🎨", "Hygienic setup 🌿", "Great pricing 💰"];
const MOODS = ["Luxury 👑", "Cute 🧸", "Elegant 🦢", "Glamorous 🪩", "Minimal ☁️"];
const LENGTHS = ["Short ⚡", "Medium 📝", "Long 📖"];

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
  
  const [mood, setMood] = useState("Elegant 🦢");
  const [reviewLength, setReviewLength] = useState("Short ⚡");
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
      toast.error("Please pick at least one service!");
      return;
    }

    setIsGenerating(true);
    setGeneratedReview("");
    
    const cleanServices = selectedServices.map(stripEmoji);
    const cleanExperiences = selectedExperiences.map(stripEmoji);
    const cleanMood = stripEmoji(mood);
    const cleanLength = stripEmoji(reviewLength);

    try {
      const res = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rating, 
          services: cleanServices, 
          experiences: cleanExperiences, 
          mood: cleanMood, 
          notes,
          length: cleanLength 
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setGeneratedReview(data.review);
      toast.success("Your perfect review is ready! ✨");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate review.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAndRedirect = async () => {
    if (!generatedReview) return;
    
    await navigator.clipboard.writeText(generatedReview);
    setIsCopied(true);
    toast.success("Review copied! Opening Google... 📋");
    
    setTimeout(() => {
      const reviewLink = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_LINK;
      if (reviewLink) {
        window.open(reviewLink, "_blank");
      }
      setIsCopied(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 pb-24 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-slate-800/40 flex flex-col gap-6"
      >
        <div className="text-center pt-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-1">
            Loved your nails? 💅
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Rate your visit and we'll write a perfect review for you!
          </p>
        </div>

        {/* Section 1: Star Rating Block */}
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col items-center text-center">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">Your Rating</span>
          <div className="flex gap-2 sm:gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((star) => {
              const isSelected = star <= rating;
              return (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className="focus:outline-none cursor-pointer p-0.5 relative bg-transparent border-0 outline-none"
                >
                  <motion.div
                    animate={{ scale: isSelected ? 1.18 : 1 }}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 500, damping: 14 }}
                  >
                    <Star 
                      className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors duration-200 drop-shadow-[0_2px_6px_rgba(251,113,133,0.1)] ${
                        isSelected 
                        ? "fill-rose-400 text-rose-400" 
                        : "text-slate-200 dark:text-slate-700"
                      }`} 
                    />
                  </motion.div>
                </button>
              );
            })}
          </div>
          <p className="text-xs font-semibold text-rose-400 mt-3 h-4 transition-all">
            {RATING_LABELS[rating]}
          </p>
        </div>

        {/* Section 2: Services Block */}
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/60 shadow-sm">
          <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Select Services</label>
          <div className="flex flex-wrap gap-2.5">
            {SERVICES.map((s) => {
              const active = selectedServices.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSelection(s, selectedServices, setSelectedServices)}
                  className={`py-2.5 px-3.5 rounded-xl text-xs font-medium border transition-all duration-200 active:scale-95 cursor-pointer text-center ${
                    active 
                    ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white border-transparent shadow-md shadow-pink-500/10 font-semibold" 
                    : "bg-slate-50/60 dark:bg-slate-800/30 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:border-rose-200"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Experience Highlights Block */}
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/60 shadow-sm">
          <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">What did you love?</label>
          <div className="flex flex-wrap gap-2.5">
            {EXPERIENCES.map((e) => {
              const active = selectedExperiences.includes(e);
              return (
                <button
                  key={e}
                  onClick={() => toggleSelection(e, selectedExperiences, setSelectedExperiences)}
                  className={`py-2.5 px-3.5 rounded-xl text-xs font-medium border transition-all duration-200 active:scale-95 cursor-pointer text-left ${
                    active 
                    ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 font-semibold" 
                    : "bg-slate-50/60 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  {e}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Formatting Configs Block */}
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/60 shadow-sm flex flex-col gap-5">
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">Review Vibe</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`py-2 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    mood === m 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-sm" 
                    : "bg-slate-50 dark:bg-slate-800/40 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-50 dark:border-slate-800/50 pt-2" />

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">Length</label>
            <div className="flex flex-wrap gap-2">
              {LENGTHS.map((l) => (
                <button
                  key={l}
                  onClick={() => setReviewLength(l)}
                  className={`py-2 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    reviewLength === l 
                    ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-semibold shadow-sm" 
                    : "bg-slate-50 dark:bg-slate-800/40 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Textarea Detail Block */}
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/60 shadow-sm">
          <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">Add specific detail (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all resize-none"
            placeholder="e.g., The chrome design turned out flawless..."
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white font-medium text-base shadow-lg shadow-pink-500/15 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer font-semibold mt-2"
        >
          {isGenerating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <RefreshCw className="w-5 h-5" />
            </motion.div>
          ) : "Write My Review ✨"}
        </button>

        {/* Output Module */}
        <AnimatePresence>
          {generatedReview && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 10 }}
              className="mt-2"
            >
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/60 to-pink-50/40 dark:from-slate-800/60 dark:to-slate-800/30 border border-pink-100/50 dark:border-slate-800 relative shadow-md">
                <p className="text-slate-800 dark:text-slate-200 font-serif text-base sm:text-lg leading-relaxed italic">
                  "{generatedReview}"
                </p>
                
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCopyAndRedirect}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy & Open Google Review
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="py-3.5 px-5 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Another
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}