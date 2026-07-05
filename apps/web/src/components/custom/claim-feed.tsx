"use client";

import { useState, useRef, useEffect } from "react";
import { useWebSocket } from "@/contexts/websocket-context";
import { ClaimBubble } from "@/components/custom/claim-bubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function ClaimFeed({ nightId }: { nightId: string }) {
  const { graphData } = useWebSocket();
  const [claimText, setClaimText] = useState("");
  const [topic, setTopic] = useState("tab"); // Default topic for demo
  const [userId, setUserId] = useState("Alice"); // Hardcoded for demo
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract nodes that are claims or evidence and sort by insertion (assuming order in array is chronological)
  const feedItems = graphData.nodes.filter(n => n.type === "claim" || n.type === "evidence");

  // Auto-scroll to bottom when new items arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [feedItems.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await fetch(`http://localhost:8000/nights/${nightId}/claims`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          claim: claimText,
          topic: topic
        })
      });
      setClaimText("");
    } catch (err) {
      console.error("Failed to submit claim", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Selector */}
      <div className="p-3 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
        <Button 
          variant={topic === "tab" ? "default" : "outline"} 
          size="sm"
          onClick={() => setTopic("tab")}
          className={topic === "tab" ? "bg-accent text-white" : "border-white/10 text-muted-foreground"}
        >
          #tab
        </Button>
        <Button 
          variant={topic === "tattoo" ? "default" : "outline"} 
          size="sm"
          onClick={() => setTopic("tattoo")}
          className={topic === "tattoo" ? "bg-accent text-white" : "border-white/10 text-muted-foreground"}
        >
          #tattoo
        </Button>
        <select 
          className="ml-auto bg-black border border-white/10 text-xs rounded px-2 text-muted-foreground focus:outline-none"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option>Alice</option>
          <option>Bob</option>
          <option>Charlie</option>
        </select>
      </div>

      {/* Feed Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {feedItems.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm mt-10">
            No claims yet. Start the debate.
          </div>
        ) : (
          feedItems.map((item, idx) => {
            // Determine visual properties
            const isMe = item.id.includes(userId) || (item.label && item.label.includes(userId));
            const side = isMe ? "right" : "left";
            
            // Generate a fake status based on type for visual flair
            let status = "pending";
            if (item.type === "evidence") status = "verified";
            else if (idx % 3 === 0) status = "disputed";
            else if (idx % 2 === 0) status = "supporting";

            return (
              <ClaimBubble
                key={item.id}
                author={item.type === "evidence" ? "System" : (item.id.split(":")[1] || "Unknown")}
                text={item.label}
                status={status as any}
                side={side}
                timestamp={item.topic}
              />
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            placeholder="Type your claim..."
            className="flex-1 bg-white/5 border-white/10 focus-visible:ring-accent"
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isSubmitting || !claimText.trim()}
            className="bg-accent hover:bg-accent/90 text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
