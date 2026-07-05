"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type WsEvent = {
  event: "GRAPH_INIT" | "NODE_ADDED" | "CONFIDENCE_UPDATE";
  payload: any;
};

interface WebSocketContextType {
  isConnected: boolean;
  graphData: { nodes: any[]; edges: any[] };
  confidenceData: Record<string, any>;
  sendMessage: (msg: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children, nightId }: { children: ReactNode; nightId: string }) {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  
  // State for the graph
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  // State for confidence scores per topic
  const [confidenceData, setConfidenceData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!nightId) return;

    let socket: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      socket = new WebSocket(`ws://localhost:8000/nights/${nightId}/live`);
      
      socket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WsEvent;
          
          switch (data.event) {
            case "GRAPH_INIT":
              setGraphData({
                nodes: data.payload.nodes || [],
                edges: data.payload.edges || []
              });
              break;
              
            case "NODE_ADDED":
              setGraphData(prev => {
                // Ensure we don't duplicate nodes
                const nodeExists = prev.nodes.some(n => n.id === data.payload.id);
                if (nodeExists) return prev;
                
                const newNode = { ...data.payload };
                
                // If it's a claim or evidence, we should link it to its topic
                const newEdges = [...prev.edges];
                if (data.payload.topic) {
                  // Ensure the topic node exists
                  const topicExists = prev.nodes.some(n => n.id === `topic_${data.payload.topic}`);
                  let updatedNodes = [...prev.nodes, newNode];
                  
                  if (!topicExists) {
                    updatedNodes.push({
                      id: `topic_${data.payload.topic}`,
                      label: data.payload.topic,
                      type: "topic"
                    });
                  }
                  
                  newEdges.push({
                    source: newNode.id,
                    target: `topic_${data.payload.topic}`,
                    id: `edge_${newNode.id}_topic_${data.payload.topic}`
                  });
                  
                  return { nodes: updatedNodes, edges: newEdges };
                }
                
                return {
                  nodes: [...prev.nodes, newNode],
                  edges: newEdges
                };
              });
              break;
              
            case "CONFIDENCE_UPDATE":
              setConfidenceData(prev => ({
                ...prev,
                [data.payload.topic]: data.payload
              }));
              break;
          }
        } catch (err) {
          console.error("Failed to parse WS message", err);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected. Attempting to reconnect...");
        setIsConnected(false);
        // Attempt to reconnect every 3 seconds
        reconnectTimer = setTimeout(connect, 3000);
      };

      setWs(socket);
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (socket) {
        socket.onclose = null; // prevent reconnect on intentional dismount
        socket.close();
      }
    };
  }, [nightId]);

  const sendMessage = useCallback((msg: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }, [ws]);

  return (
    <WebSocketContext.Provider value={{ isConnected, graphData, confidenceData, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
