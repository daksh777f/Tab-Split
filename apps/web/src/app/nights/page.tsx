"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThreeBackground } from "@/components/custom/three-background";
import { motion } from "framer-motion";

export default function NightSetupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startNight = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/nights", {
        method: "POST",
      });
      const data = await res.json();
      if (data.night_id) {
        router.push(`/nights/${data.night_id}`);
      }
    } catch (error) {
      console.error("Failed to start night:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-foreground flex items-center justify-center p-6">
      <ThreeBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md"
      >
        <Card className="p-8 bg-black/60 backdrop-blur-2xl border-white/10 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🌙</span>
          </div>
          
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Start a Verdict</h1>
          <p className="text-muted-foreground mb-8">
            Create a new session to invite friends and resolve conflicting memories.
          </p>
          
          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-white/90"
            onClick={startNight}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Initializing..." : "Create Night"}
          </Button>
        </Card>
      </motion.div>
    </main>
  );
}
