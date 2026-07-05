"use client";

import { useEffect, use } from "react";
import { WebSocketProvider, useWebSocket } from "@/contexts/websocket-context";
import { ClaimFeed } from "@/components/custom/claim-feed";
import { EvidenceUpload } from "@/components/custom/evidence-upload";
import { LiveGraph } from "@/components/custom/live-graph";
import { VerdictPanel } from "@/components/custom/verdict-panel";
import { CogneeProofPanel } from "@/components/custom/cognee-proof-panel";

// We extract the inner content so it can use the WebSocket context
function VerdictRoomInner({ nightId }: { nightId: string }) {
  const { isConnected, sendMessage } = useWebSocket();

  // Seed the night if it's empty
  useEffect(() => {
    if (isConnected) {
      // Small delay to ensure WS is fully ready on backend
      setTimeout(() => {
        // We simulate a backend endpoint call to seed the data, 
        // but for this phase we'll just POST the claims directly to the API
        const seedData = async () => {
          const res = await fetch(`http://localhost:8000/nights/${nightId}/verdict/dinner`);
          if (res.status === 404 || true) { // Force seed for demo if needed
            // 1. Claim: Alice says she paid
            await fetch(`http://localhost:8000/nights/${nightId}/claims`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: "Alice", claim: "I paid the $250 dinner bill at Ocean Prime.", topic: "dinner" })
            });
            // 2. Claim: Bob disputes
            await fetch(`http://localhost:8000/nights/${nightId}/claims`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: "Bob", claim: "Alice only paid for her own steak.", topic: "dinner" })
            });
            // 3. Evidence: Receipt
            await fetch(`http://localhost:8000/nights/${nightId}/evidence`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ evidence_type: "receipt", content: "TOTAL: $250.00 VISA ending in 1234 (Alice)", topic: "dinner" })
            });
            // 4. Claim: Charlie mentions the wine
            await fetch(`http://localhost:8000/nights/${nightId}/claims`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: "Charlie", claim: "Bob ordered the $100 bottle of wine.", topic: "wine" })
            });
          }
        };
        seedData();
      }, 500);
    }
  }, [isConnected, nightId]);

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden text-foreground">
      {/* LEFT PANEL: Feed & Evidence */}
      <div className="w-[320px] lg:w-[400px] h-full flex flex-col border-r border-white/10 bg-[#050505] z-10 shadow-2xl relative shrink-0">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-success animate-pulse" : "bg-danger"}`} />
            <span className="font-bold tracking-widest text-sm uppercase">
              {isConnected ? "Live Network" : "Connecting..."}
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-mono">NIGHT: {nightId?.substring(0,6) || "demo"}</div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col relative">
          <ClaimFeed nightId={nightId} />
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-md">
          <EvidenceUpload nightId={nightId} />
        </div>
      </div>

      {/* CENTER: Graph */}
      <div className="flex-1 h-full relative bg-black">
        <LiveGraph />
      </div>

      {/* RIGHT PANEL: Verdicts */}
      <div className="w-[320px] lg:w-[400px] h-full border-l border-white/10 bg-[#050505]/95 backdrop-blur-xl flex flex-col relative z-10 shadow-2xl overflow-y-auto shrink-0">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold tracking-tight">ENGINE VERDICTS</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Real-time Consensus</p>
        </div>
        
        <div className="p-6 flex flex-col gap-8">
          <VerdictPanel nightId={nightId} topic="dinner" title="Who Paid For Dinner?" />
          <VerdictPanel nightId={nightId} topic="wine" title="Who Ordered The Wine?" />
        </div>
      </div>

      {/* Proof Panel */}
      <CogneeProofPanel nightId={nightId} />
    </div>
  );
}

export default function VerdictRoomPage({ params }: { params: Promise<{ id: string }> }) {
  // Use React.use() to unwrap the params Promise safely
  const { id } = use(params);
  
  // Provide fallback just in case to prevent undefined errors
  const safeId = id || "demo";

  return (
    <WebSocketProvider nightId={safeId}>
      <VerdictRoomInner nightId={safeId} />
    </WebSocketProvider>
  );
}
