"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Receipt } from "lucide-react";
import { useWebSocket } from "@/contexts/websocket-context";
import { ConfidenceGauge } from "./confidence-gauge";
import { TimelineScrubber, Snapshot } from "./timeline-scrubber";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ReceiptCard } from "./receipt-card";

interface VerdictPanelProps {
  nightId: string;
  topic: string;
  title: string;
}

export function VerdictPanel({ nightId, topic, title }: VerdictPanelProps) {
  const [confidenceData, setConfidenceData] = useState<{
    confidence: number;
    verdict: string;
    qa_id: string;
  } | null>(null);

  const [history, setHistory] = useState<Snapshot[]>([]);
  const [scrubSnapshot, setScrubSnapshot] = useState<Snapshot | null>(null);

  const { confidenceData: wsConfidenceData } = useWebSocket();

  const fetchVerdict = async () => {
    try {
      const res = await fetch(`http://localhost:8000/nights/${nightId}/verdict/${topic}`);
      const data = await res.json();
      setConfidenceData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:8000/nights/${nightId}/verdict/${topic}/history`);
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchVerdict();
    fetchHistory();
  }, [nightId, topic]);

  // Listen for confidence updates via WebSocket
  useEffect(() => {
    if (wsConfidenceData[topic]) {
      // Re-fetch to get updated graph
      fetchVerdict();
      fetchHistory();
    }
  }, [wsConfidenceData, topic]);

  // Determine what to display
  const displayVerdict = scrubSnapshot ? scrubSnapshot.claim : (confidenceData?.verdict || "Waiting for data...");
  const displayTime = scrubSnapshot ? scrubSnapshot.time : "LIVE";
  
  // Calculate target confidence for the gauge
  const targetConfidence = scrubSnapshot ? scrubSnapshot.confidence * 100 : (confidenceData?.confidence || 0) * 100;

  const submitFeedback = async (score: number) => {
    if (!confidenceData?.qa_id) return;
    try {
      await fetch(`http://localhost:8000/nights/${nightId}/verdict/${topic}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qa_id: confidenceData.qa_id,
          score,
          feedback_text: ""
        })
      });
      // The WebSocket will broadcast the update, which triggers a re-fetch
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card className="p-6 bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden relative group">
      {/* Subtle glow based on confidence */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${targetConfidence > 80 ? '#10b981' : targetConfidence > 50 ? '#ffd700' : '#ef4444'} 0%, transparent 70%)`
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <h3 className="font-black text-xl mb-4 text-center tracking-tighter uppercase">{title}</h3>
        
        <div className="w-48 h-48 mb-6 relative">
          <ConfidenceGauge score={targetConfidence} label="TRUTH CENTROID" />
        </div>

        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              {scrubSnapshot ? "HISTORICAL SNAPSHOT" : "LEADING VERDICT"}
            </h4>
            {scrubSnapshot && (
              <span className="text-[10px] font-mono text-accent">{displayTime}</span>
            )}
          </div>
          
          <div className="p-3 bg-white/5 border border-white/10 rounded-md font-mono text-sm shadow-inner min-h-16 flex items-center justify-center text-center">
            "{displayVerdict}"
          </div>
        </div>

        {/* Timeline Scrubber */}
        {history.length > 0 && (
          <div className="w-full mt-6 pt-6 border-t border-white/10">
            <TimelineScrubber 
              history={history} 
              onScrub={setScrubSnapshot} 
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <Button 
            variant="outline" 
            className="border-white/20 hover:border-success hover:bg-success/10 hover:text-success transition-all"
            onClick={() => submitFeedback(1)}
            disabled={!!scrubSnapshot}
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Spot On
          </Button>
          <Button 
            variant="outline" 
            className="border-white/20 hover:border-danger hover:bg-danger/10 hover:text-danger transition-all"
            onClick={() => submitFeedback(-1)}
            disabled={!!scrubSnapshot}
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            BS
          </Button>
        </div>

        {/* Get the Receipt Button (Only show if highly confident and not scrubbing) */}
        {!scrubSnapshot && targetConfidence > 75 && (
          <Dialog>
            <DialogTrigger render={
              <Button variant="default" className="w-full mt-4 bg-white text-black hover:bg-white/90 uppercase tracking-widest font-bold text-xs" />
            }>
              <Receipt className="w-4 h-4 mr-2" />
              Get the Receipt
            </DialogTrigger>
            <DialogContent className="bg-transparent border-none shadow-none flex justify-center w-auto sm:max-w-none">
              <DialogTitle className="sr-only">Receipt Card</DialogTitle>
              <ReceiptCard 
                nightId={nightId} 
                topic={topic} 
                claim={displayVerdict} 
                confidence={Math.round(targetConfidence)} 
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  );
}
