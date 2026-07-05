import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import * as htmlToImage from "html-to-image";

interface ReceiptCardProps {
  nightId: string;
  topic: string;
  claim: string;
  confidence: number;
}

export function ReceiptCard({ nightId, topic, claim, confidence }: ReceiptCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#000000",
      });
      const link = document.createElement("a");
      link.download = `tab-split-verdict-${topic}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  };

  const handleCopy = async () => {
    if (!cardRef.current) return;
    try {
      const blob = await htmlToImage.toBlob(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#000000",
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        alert("Copied to clipboard!");
      }
    } catch (err) {
      console.error("Failed to copy image", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* The actual card that gets captured */}
      <div 
        ref={cardRef} 
        className="w-[350px] bg-black border-2 border-white/20 p-8 flex flex-col relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #111 25%, transparent 25%),
            linear-gradient(-45deg, #111 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #111 75%),
            linear-gradient(-45deg, transparent 75%, #111 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        {/* Neon Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-success/20 pointer-events-none" />
        
        {/* Receipt Header */}
        <div className="text-center border-b-2 border-dashed border-white/30 pb-4 mb-4 relative z-10">
          <h2 className="font-black text-2xl tracking-tighter uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            TAB SPLIT
          </h2>
          <p className="text-[10px] font-mono text-muted-foreground tracking-widest mt-1">
            OFFICIAL VERDICT RECEIPT
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 relative z-10">
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Disputed Fact</p>
            <p className="text-sm font-bold text-white uppercase">{topic}</p>
          </div>

          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Winning Claim</p>
            <div className="p-3 bg-white/10 rounded-sm font-mono text-sm border-l-4 border-accent text-white">
              "{claim}"
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Truth Centroid</p>
            <div className="flex items-end gap-1">
              <span className={`text-4xl font-black drop-shadow-[0_0_12px_currentColor] ${confidence > 75 ? 'text-success' : confidence > 50 ? 'text-warning' : 'text-danger'}`}>
                {confidence}%
              </span>
              <span className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Confidence</span>
            </div>
          </div>
        </div>

        {/* Receipt Footer */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-white/30 text-center relative z-10">
          <p className="text-[10px] font-mono text-muted-foreground">SESSION: {nightId}</p>
          <p className="text-[8px] font-mono text-white/30 mt-2">POWERED BY COGNEE CLOUD</p>
          
          {/* Barcode decorative element */}
          <div className="w-full h-8 mt-3 flex justify-center items-center opacity-50">
             <div className="w-full h-full bg-[repeating-linear-gradient(90deg,#fff,#fff_2px,transparent_2px,transparent_4px,#fff_4px,#fff_5px,transparent_5px,transparent_8px)]" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full">
        <Button onClick={handleDownload} className="flex-1 bg-white text-black hover:bg-white/90">
          <Download className="w-4 h-4 mr-2" />
          Save PNG
        </Button>
        <Button onClick={handleCopy} variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </div>
    </div>
  );
}
