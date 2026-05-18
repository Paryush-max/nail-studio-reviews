import { Hero } from "@/components/Hero";
import { ReviewGenerator } from "@/components/ReviewGenerator";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Decorative Top Gradient Background */}
      <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-rose-100/50 to-transparent dark:from-rose-950/20 pointer-events-none" />
      
      <Hero />
      <ReviewGenerator />
      <FloatingWhatsApp />
    </main>
  );
}