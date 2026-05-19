"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Copy, RefreshCw, Check } from "lucide-react";
import toast from "react-hot-toast";

// Updated with your exact SEO service list
const SERVICES = [
  "Gum gel extension", 
  "Gel extension", 
  "Soft gel extension", 
  "Temporary nail extension", 
  "Gel overlay", 
  "Gum gel overlay", 
  "Press-on"
];

const EXPERIENCES = ["Friendly artist", "Clean salon", "Premium experience", "Fast service", "Long lasting", "Beautiful art", "Hygienic setup", "Great pricing"];
const MOODS = ["Luxury", "Cute", "Elegant", "Glamorous", "Minimal"];
const LENGTHS = ["Short", "Medium", "Long"];

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
  const [mood, setMood] = useState("Elegant");
  const [reviewLength, setReviewLength] = useState("Short");
  const [notes, setNotes] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReview, setGeneratedReview] = useState("");
  const [isCopied, setIsCopied] = useState(false);

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
    
    try {
      const res = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          rating, 
          services: selectedServices, 
          experiences: selectedExperiences, 
          mood, 
          notes,
          length: reviewLength 
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setGeneratedReview(data.review);
      toast.success("AI Review Ready! ✨");
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
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-5 sm:p-8 shadow-xl border border-white/20 dark:border-slate-800/60"
      >
        {/* Star Rating Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="text-xs font-semibold tracking-widest text-rose-500 uppercase mb-2">Your Rating</span>
          <div className="flex gap-1.5 sm:gap-2 justify-center py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isSelected = star <= rating;
              return (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className="focus:outline-none cursor-pointer p-1 relative bg-transparent border-0 outline-none"
                >
                  <motion.div
                    animate={{ scale: isSelected ? 1.18 : 1 }}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 500, damping: 14 }}
                  >
                    <Star 
                      className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-200 drop-shadow-[0_2px_8px_rgba(251,113,133,0.15)] ${
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
          <p className="text-xs font-medium text-slate-400 mt-2 h-4 transition-all">
            {RATING_LABELS[rating]}
          </p>
        </div>

        {/* Services Received */}
        <div className="mb-6">
          <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">Select Services</label>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => {
              const active = selectedServices.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSelection(s, selectedServices, setSelectedServices)}
                  className={`py-2.5 px-3.5 rounded-xl text-xs font-medium border transition-all duration-200 active:scale-95 cursor-pointer text-center ${
                    active 
                    ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white border-transparent shadow-md shadow-pink-500/10 font-semibold" 
                    : "bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:border-rose-200"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience Highlights */}
        <div className="mb-6">
          <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">What did you love?</label>
          <div className="grid grid-cols-2 gap-2">
            {EXPERIENCES.map((e) => {
              const active = selectedExperiences.includes(e);
              return (
                <button
                  key={e}
                  onClick={() => toggleSelection(e, selectedExperiences, setSelectedExperiences)}
                  className={`py-3 px-3 rounded-xl text-xs font-medium border transition-all duration-200 active:scale-95 cursor-pointer text-left truncate ${
                    active 
                    ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 font-semibold" 
                    : "bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  {active ? "✓ " : "+ "} {e}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          {/* Review Tone/Mood */}
          <div className="flex-1">
            <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">Review Vibe</label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`py-2 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    mood === m 
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold shadow-sm" 
                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Review Length */}
          <div className="flex-1">
            <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">Length</label>
            <div className="flex flex-wrap gap-1.5">
              {LENGTHS.map((l) => (
                <button
                  key={l}
                  onClick={() => setReviewLength(l)}
                  className={`py-2 px-3.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    reviewLength === l 
                    ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-semibold shadow-sm" 
                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Custom Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Add specific detail (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-slate-50/50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all resize-none"
            placeholder="e.g., The chrome design turned out flawless..."
          />
        </div>

        {/* Main Action Call */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white font-medium text-sm sm:text-base shadow-lg shadow-pink-500/15 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer font-semibold"
        >
          {isGenerating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <RefreshCw className="w-4 h-4" />
            </motion.div>
          ) : "Generate Review ✨"}
        </button>

        {/* Animated Result Module */}
        <AnimatePresence>
          {generatedReview && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 10 }}
              className="mt-6"
            >
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/60 to-pink-50/40 dark:from-slate-800/60 dark:to-slate-800/30 border border-pink-100/50 dark:border-slate-800 relative">
                <p className="text-slate-800 dark:text-slate-200 font-serif text-base sm:text-lg leading-relaxed italic">
                  "{generatedReview}"
                </p>
                
                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleCopyAndRedirect}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy & Open Google Review
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="py-3 px-4 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate
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