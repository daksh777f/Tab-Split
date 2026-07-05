"use client";

import { useWebSocket } from "@/contexts/websocket-context";
import { useEffect, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";

// Force graph needs to be dynamically imported with no SSR to avoid window issues in Next.js
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export function LiveGraph() {
  const { graphData } = useWebSocket();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      setDimensions({
        width: containerRef.current?.clientWidth || 800,
        height: containerRef.current?.clientHeight || 600
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Adapt edges to links for the force graph
  const forceGraphData = useMemo(() => {
    return {
      nodes: graphData.nodes,
      links: graphData.edges.map(e => ({
        source: e.source,
        target: e.target,
        id: e.id
      }))
    };
  }, [graphData]);

  const fgRef = useRef<any>(null);

  // Apply custom physics when graph data changes
  useEffect(() => {
    if (fgRef.current) {
      // Repel nodes, but cap the distance so separate topics don't fly off screen
      fgRef.current.d3Force('charge').strength(-300).distanceMax(400);
      // Increase link distance to avoid bunching
      fgRef.current.d3Force('link').distance(100);
    }
  }, [forceGraphData]);

  const drawNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label || node.id;
    // Don't render text if zoomed too far out
    const fontSize = 12 / globalScale;
    ctx.font = `600 ${fontSize}px Inter, sans-serif`;
    
    // Determine color
    let color = "#8b5cf6"; // Violet (claims)
    if (node.type === "topic") color = "#ffd700"; // Gold
    if (node.type === "evidence") color = "#10b981"; // Green

    // Draw glowing circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow

    // Word wrap function for canvas
    const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
      const words = text.split(' ');
      let lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    const maxWidth = 150 / globalScale; // Max width for text block
    const lines = wrapText(ctx, label, maxWidth);
    
    // Calculate background dimensions
    const longestLine = [...lines].sort((a, b) => ctx.measureText(b).width - ctx.measureText(a).width)[0];
    const textWidth = ctx.measureText(longestLine).width;
    const padding = fontSize * 0.8;
    const bgWidth = textWidth + padding;
    const bgHeight = (lines.length * (fontSize * 1.2)) + padding;
    
    // Text background pill
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.beginPath();
    ctx.roundRect(
      node.x - bgWidth / 2, 
      node.y + 12, 
      bgWidth, 
      bgHeight, 
      6 // border radius
    );
    ctx.fill();

    // Text labels
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    
    lines.forEach((line, i) => {
      ctx.fillText(line, node.x, node.y + 12 + padding/2 + (fontSize/2) + (i * fontSize * 1.2));
    });
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-black cursor-grab active:cursor-grabbing">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={forceGraphData}
        nodeLabel={() => ""} // We render our own text
        nodeCanvasObject={drawNode}
        nodeRelSize={8}
        linkColor={() => "rgba(255, 255, 255, 0.15)"}
        linkWidth={1.5}
        linkDirectionalParticles={3}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={(link: any) => {
          // Color particle based on source node type
          const sourceNode = typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === link.source);
          if (sourceNode?.type === "topic") return "#ffd700";
          if (sourceNode?.type === "evidence") return "#10b981";
          return "#8b5cf6";
        }}
        backgroundColor="#000000"
        d3VelocityDecay={0.3}
      />
      
      {/* Decorative overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
    </div>
  );
}
