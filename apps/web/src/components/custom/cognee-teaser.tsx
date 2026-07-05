"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function CogneeTeaser() {
  const [nodes, setNodes] = useState(1482);
  const [edges, setEdges] = useState(3840);
  const [conflicts, setConflicts] = useState(12);

  // Simulate live graph activity
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) => prev + Math.floor(Math.random() * 3));
      setEdges((prev) => prev + Math.floor(Math.random() * 5));
      if (Math.random() > 0.8) {
        setConflicts((prev) => Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-32 bg-black border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
      
      <div className="relative max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              WHY THIS IS REAL
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We aren't just summarizing chat history. Tab Split runs on a live <span className="text-white font-semibold">Cognee Knowledge Graph</span> that actively restructures its memory vectors as new evidence emerges.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="p-8 bg-[#0a0a0a] border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Cognee Cloud</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">LIVE SYNC</span>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground uppercase tracking-widest">Memory Nodes</span>
                <span className="text-3xl font-mono text-white">{nodes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground uppercase tracking-widest">Vector Edges</span>
                <span className="text-3xl font-mono text-accent">{edges.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground uppercase tracking-widest">Active Conflicts</span>
                <span className="text-3xl font-mono text-danger">{conflicts}</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5">
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent"
                  animate={{ width: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
