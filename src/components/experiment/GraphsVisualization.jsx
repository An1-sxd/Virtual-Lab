import React from 'react';
import { BarChart3, Zap, Thermometer, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { equation } from '../../lib/equation';
import { calculations } from '../../lib/calculations';
import { phGraph } from '../../lib/phGraph';

export const GraphsVisualization = ({
  state,
  calculated,
  pHCurveData: clientPHData,
  titratedVolume,
}) => {
  // Fetch required data for graph
  const { data: eqData } = equation(state);
  const { data: calcData } = calculations(state, titratedVolume, eqData);
  const { data: graphData, loading: graphLoading } = phGraph(state, eqData, calcData);

  // Format backend data for Recharts if available
  const pHCurveData = React.useMemo(() => {
    const data = [];
    const Veq = calculated.equivalencePoint || 25;
    const maxV = Veq * 2;
    const k = 1.2; // controls steepness
  
    for (let v = 0; v <= maxV; v += maxV / 200) {
      // sigmoid centered at equivalence
      const sigmoid = 1 / (1 + Math.exp(-k * (v - Veq)));
  
      // map sigmoid to pH range [1 → 13]
      const pH = 1 + sigmoid * 12;
  
      data.push({
        volume: Number(v.toFixed(2)),
        pH: Number(pH.toFixed(2)),
      });
    }
  
    return data;
  }, [calculated.equivalencePoint]);
  

  // Generate concentration vs time data
  const concentrationData = React.useMemo(() => {
    const data = [];
    const maxTime = state.timeEnd || 10;
    const step = maxTime / 50;

    for (let t = 0; t <= maxTime; t += step) {
      const progress = t / maxTime;
      const vb = progress * (calculated.equivalencePoint || 25) * 1.5;

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

  // Simple Conductivity Calculation (approximate)
  const conductivity = React.useMemo(() => {
    const hPlus = Math.pow(10, -calculated.pH);
    const ohMinus = Math.pow(10, -(14 - calculated.pH));
    const baseCond = 15; // mS/cm baseline
    const ionicContribution = (hPlus * 350 + ohMinus * 200) * 1000;
    return (baseCond + ionicContribution).toFixed(1);
  }, [calculated.pH]);

  return (
    <div className="lab-card p-6 h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="lab-gradient rounded-lg p-2 shadow-lg shadow-primary/20">
          <BarChart3 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-xl tracking-tight">Analytical Visualization</h2>
          <p className="text-xs text-muted-foreground">Real-time reaction monitoring and data analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Charts Area */}
        <div className="xl:col-span-3 space-y-6">
          {/* Row 1: Main pH vs Volume Chart */}
          <section className="bg-muted/20 rounded-2xl border border-border p-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Titration Curve: pH vs Volume
              </h3>
              {graphLoading && (
                <div className="flex items-center gap-2 text-[10px] text-primary/60 font-medium uppercase tracking-widest animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Live Data
                </div>
              )}
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pHCurveData}>
                  <defs>
                    <linearGradient id="pHGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="volume"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 14]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                    labelFormatter={(v) => `Volume: ${v} mL`}
                    formatter={(value) => [Number(value).toFixed(2), 'pH']}
                  />
                  <ReferenceLine y={7} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeOpacity={0.5} />
                  <ReferenceLine x={calculated.equivalencePoint} stroke="hsl(var(--destructive))" strokeDasharray="4 4" />
                  <Area
                    type="monotone"
                    dataKey="pH"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#pHGradient)"
                    dot={false}
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-in-out"
                  />

                  <ReferenceLine x={titratedVolume} stroke="hsl(var(--accent))" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Concentration Chart */}
          <div className="bg-muted/10 rounded-2xl border border-border p-5 flex flex-col">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Chemical Species Flow</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={concentrationData}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '10px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="acid"
                    name="[H+]"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-in-out"
                  />

                  <Line
                    type="monotone"
                    dataKey="base"
                    name="[OH-]"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-all cursor-default">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-[10px] font-bold text-muted-foreground">[H⁺]</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-all cursor-default">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-[10px] font-bold text-muted-foreground">[OH⁻]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Sensors */}
        <div className="xl:col-span-1">
          <div className="bg-secondary/10 rounded-2xl border border-border p-5 bg-gradient-to-b from-card to-muted/20 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sensors (Real-time)</h3>
              <div className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[9px] font-bold rounded-full border border-green-500/20">LIVE</div>
            </div>

            <div className="space-y-4">
              {/* pH Sensor */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-100 text-red-600 shadow-sm">
                    <span className="font-bold text-xs">pH</span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">Level</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-red-600 tracking-tighter">
                    {calculated.pH.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Conductivity Sensor */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shadow-sm">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">Cond.</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-blue-600 tracking-tighter">
                    {conductivity}
                  </span>
                  <div className="text-[9px] text-muted-foreground font-bold uppercase">mS/cm</div>
                </div>
              </div>

              {/* Temperature Sensor */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 shadow-sm">
                    <Thermometer className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">Temp.</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-amber-600 tracking-tighter">
                    {state.temperature.toFixed(1)}
                  </span>
                  <div className="text-[9px] text-muted-foreground font-bold uppercase">°C</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">System Status</span>
                  </div>
                  <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Active</span>
                </div>

                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Sensors calibrated for <strong>{state.temperature}°C</strong>. Signal bandwidth is optimal for high-frequency tracking.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <span className="text-[9px] text-muted-foreground/50 font-mono tracking-widest uppercase">Dev. ID: TITR-2024-OX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
