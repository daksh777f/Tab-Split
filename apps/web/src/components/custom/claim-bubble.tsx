"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClaimBubbleProps {
  author: string;
  text: string;
  timestamp: string;
  status: "verified" | "disputed" | "pending";
  side?: "left" | "right";
  className?: string;
}

export function ClaimBubble({
  author,
  text,
  timestamp,
  status,
  side = "left",
  className,
}: ClaimBubbleProps) {
  const statusColor = 
    status === "verified" ? "text-verdict-gold" : 
    status === "disputed" ? "text-guilty-red" : 
    "text-muted-foreground";

  const statusGlow = 
    status === "verified" ? "shadow-[0_0_15px_rgba(255,215,0,0.15)]" : 
    status === "disputed" ? "shadow-[0_0_15px_rgba(255,7,58,0.15)]" : 
    "shadow-lg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "flex w-full",
        side === "right" ? "justify-end" : "justify-start",
        className
      )}
    >
      <div className={cn(
        "max-w-[80%] flex flex-col gap-1 relative",
        side === "right" ? "items-end" : "items-start"
      )}>
        {/* Author Label */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {author}
          </span>
          <span className="text-[10px] text-muted-foreground/60">{timestamp}</span>
        </div>

        {/* Bubble */}
        <div className={cn(
          "relative overflow-hidden px-5 py-3 shadow-md",
          side === "left" 
            ? "bg-surface text-foreground rounded-2xl rounded-tl-sm border border-white/5" 
            : "bg-accent text-white rounded-2xl rounded-tr-sm",
          statusGlow
        )}>
          <p className="relative z-10 font-medium text-[15px] leading-relaxed">{text}</p>
        </div>

        {/* Status Indicator */}
        <div className={cn(
          "flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mt-1",
          side === "right" && "justify-end",
          status === "verified" ? "text-success" :
          status === "disputed" ? "text-danger" :
          "text-muted-foreground"
        )}>
          {status}
        </div>
      </div>
    </motion.div>
  );
}
