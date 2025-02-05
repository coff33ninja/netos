import { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "vis-network/dist/dist/vis-network.css";

export const NetworkMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Sample data - replace with actual network scan data
    const nodes = new DataSet([
      { id: 1, label: "Router", group: "network" },
      { id: 2, label: "Server", group: "server" },
      { id: 3, label: "Workstation", group: "client" },
    ]);

    const edges = new DataSet([
      { from: 1, to: 2 },
      { from: 1, to: 3 },
    ]);

    const options = {
      nodes: {
        shape: "dot",
        size: 30,
        font: {
          size: 14,
        },
        borderWidth: 2,
        shadow: true,
      },
      edges: {
        width: 2,
        shadow: true,
      },
      groups: {
        network: {
          color: { background: "#4CAF50", border: "#388E3C" },
        },
        server: {
          color: { background: "#2196F3", border: "#1976D2" },
        },
        client: {
          color: { background: "#9C27B0", border: "#7B1FA2" },
        },
      },
    };

    networkRef.current = new Network(
      containerRef.current,
      { nodes, edges },
      options
    );

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] border border-border rounded-lg bg-card"
    />
  );
};