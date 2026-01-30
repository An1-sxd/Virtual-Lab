import React from 'react';
import { BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

export const GraphsVisualization = ({
  state,
  calculated,
  pHCurveData,
  titratedVolume,
}) => {
  // Generate concentration vs time data
  const concentrationData = React.useMemo(() => {
    const data = [];
    const maxTime = state.timeEnd;
    const step = maxTime / 50;
    
    for (let t = 0; t <= maxTime; t += step) {
      const progress = t / maxTime;
      const vb = progress * calculated.equivalencePoint * 1.5;
      
      const nA = (state.acidConcentration * state.acidVolume) / 1000;
      const nB = (state.baseConcentration * vb) / 1000;
      const vT = (state.acidVolume + vb) / 1000; // in L
      
      const acidConc = Math.max(0, (nA - nB) / vT);
      const baseConc = Math.max(0, (nB - nA) / vT);
      
      data.push({
        time: Number(t.toFixed(1)),
        acid: Number((acidConc * 1000).toFixed(4)), // in mmol/L
        base: Number((baseConc * 1000).toFixed(4)),
      });
    }
    
    return data;
  }, [state, calculated.equivalencePoint]);

  // Current position marker on pH curve
  const currentPHPoint = pHCurveData.find(d => d.volume >= titratedVolume) || pHCurveData[0];

  return (
    <div className="lab-card p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="lab-gradient rounded-lg p-2">
          <BarChart3 className="h-5 w-5 text-primary-foreground" />
        </div>
        <h2 className="font-display font-semibold text-lg">Graphs</h2>
      </div>

      {/* pH vs Volume Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">pH vs Volume of Base</h3>
        <div className="h-48 bg-muted/30 rounded-lg border border-border p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pHCurveData}>
              <defs>
                <linearGradient id="pHGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="volume" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                label={{ value: 'V_b (mL)', position: 'insideBottom', offset: -5, fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                domain={[0, 14]} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                label={{ value: 'pH', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelFormatter={(v) => `Volume: ${v} mL`}
                formatter={(value) => [value.toFixed(2), 'pH']}
              />
              <ReferenceLine 
                y={7} 
                stroke="hsl(var(--accent))" 
                strokeDasharray="5 5" 
                label={{ value: 'pH 7', fontSize: 10, fill: 'hsl(var(--accent))' }}
              />
              <ReferenceLine 
                x={calculated.equivalencePoint} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="3 3"
                label={{ value: 'Eq.', fontSize: 10, fill: 'hsl(var(--destructive))' }}
              />
              <Area 
                type="monotone" 
                dataKey="pH" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="url(#pHGradient)"
                animationDuration={500}
              />
              {/* Current position marker */}
              <ReferenceLine 
                x={titratedVolume} 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Concentration vs Time Chart */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Concentration vs Time</h3>
        <div className="h-48 bg-muted/30 rounded-lg border border-border p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={concentrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                label={{ value: 'Conc. (mmol/L)', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelFormatter={(v) => `Time: ${v}s`}
              />
              <Line 
                type="monotone" 
                dataKey="acid" 
                name="[H⁺]"
                stroke="hsl(0, 70%, 50%)" 
                strokeWidth={2}
                dot={false}
                animationDuration={500}
              />
              <Line 
                type="monotone" 
                dataKey="base" 
                name="[OH⁻]"
                stroke="hsl(220, 70%, 50%)" 
                strokeWidth={2}
                dot={false}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-red-500"></span>
            <span className="text-xs text-muted-foreground">[H⁺] Acid</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-blue-500"></span>
            <span className="text-xs text-muted-foreground">[OH⁻] Base</span>
          </div>
        </div>
      </div>
    </div>
  );
};
