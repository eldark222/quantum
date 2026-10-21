import React, { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface PontoOnda {
  x: string;
  psi: number;
  probabilidade: number;
}

export const PocoPotencial: React.FC = () => {
  const [n, setN] = useState<number>(1);
  const [L, setL] = useState<number>(1.0);

  const dados = useMemo(() => {
    const pontos: PontoOnda[] = [];
    const numPontos = 100;
    for (let i = 0; i <= numPontos; i++) {
      const xPos = (i / numPontos) * L;
      const psi = Math.sqrt(2 / L) * Math.sin((n * Math.PI * xPos) / L);
      const probabilidade = Math.pow(psi, 2);
      pontos.push({
        x: xPos.toFixed(2),
        psi: Number(psi.toFixed(3)),
        probabilidade: Number(probabilidade.toFixed(3)),
      });
    }
    return pontos;
  }, [n, L]);

  return (
    <div style={{ padding: "24px", backgroundColor: "#0f172a", color: "#f8fafc", borderRadius: "12px", fontFamily: "sans-serif" }}>
      <h2>Poço de Potencial Quântico 1D</h2>
      <p style={{ color: "#94a3b8" }}>
        Simulação da função de onda ψ(x) e da densidade de probabilidade |ψ(x)|² para uma partícula confinada.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", margin: "24px 0", padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Nível de Energia (n): {n}
          </label>
          <input type="range" min="1" max="5" step="1" value={n} onChange={(e) => setN(Number(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Largura do Poço (L): {L} nm
          </label>
          <input type="range" min="0.5" max="2.0" step="0.1" value={L} onChange={(e) => setL(Number(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
        </div>
      </div>

      <div style={{ height: "350px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dados} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="x" stroke="#94a3b8" label={{ value: "Posição (nm)", position: "insideBottom", offset: -5, fill: "#94a3b8" }} />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569", color: "#f8fafc" }} />
            <Area type="monotone" dataKey="psi" name="Função de Onda ψ(x)" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} strokeWidth={2} />
            <Area type="monotone" dataKey="probabilidade" name="Probabilidade |ψ(x)|²" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
