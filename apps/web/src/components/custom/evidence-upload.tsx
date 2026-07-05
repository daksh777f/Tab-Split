"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UploadCloud, FileText } from "lucide-react";

export function EvidenceUpload({ nightId }: { nightId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [evidenceType, setEvidenceType] = useState("receipt");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("tab");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await fetch(`http://localhost:8000/nights/${nightId}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidence_type: evidenceType,
          content: content,
          topic: topic
        })
      });
      setContent("");
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to submit evidence", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-accent hover:bg-accent/10 transition-colors h-12" />
        }
      >
        <UploadCloud className="w-4 h-4 mr-2" />
        Attach Evidence
      </DialogTrigger>
      
      <DialogContent className="bg-[#0a0a0a] border-white/10 text-foreground sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Upload Evidence
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Topic</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="tab">The Bar Tab</option>
              <option value="tattoo">The Tattoo</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Evidence Type</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={evidenceType === "receipt" ? "default" : "outline"}
                className={`flex-1 ${evidenceType === "receipt" ? "bg-accent text-white" : "border-white/10"}`}
                onClick={() => setEvidenceType("receipt")}
              >
                Receipt
              </Button>
              <Button
                type="button"
                variant={evidenceType === "message" ? "default" : "outline"}
                className={`flex-1 ${evidenceType === "message" ? "bg-accent text-white" : "border-white/10"}`}
                onClick={() => setEvidenceType("message")}
              >
                Text Msg
              </Button>
              <Button
                type="button"
                variant={evidenceType === "photo" ? "default" : "outline"}
                className={`flex-1 ${evidenceType === "photo" ? "bg-accent text-white" : "border-white/10"}`}
                onClick={() => setEvidenceType("photo")}
              >
                Photo
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Content</label>
            {evidenceType === "photo" ? (
              <div className="h-32 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center text-muted-foreground bg-white/5 text-sm">
                [Image Upload Simulated]
              </div>
            ) : (
              <Textarea 
                placeholder={evidenceType === "receipt" ? "Paste receipt text/total..." : "Paste message text..."}
                className="bg-white/5 border-white/10 min-h-[100px] focus-visible:ring-accent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            )}
          </div>

          <Button type="submit" className="w-full bg-white text-black hover:bg-white/90 font-bold" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Submit to Network"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
