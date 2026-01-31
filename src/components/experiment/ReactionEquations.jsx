import React from 'react';
import { FileText } from 'lucide-react';
import { equation } from '../../lib/equation';
import { calculations } from '../../lib/calculations';
import { phGraph } from '../../lib/phGraph';

export const ReactionEquations = ({
  state,
  calculated,
  titratedVolume,
}) => {
  const { data: eqData, loading, error } = equation(state); // Fetch data from equation
  
  const { data: calcData, loading: calcLoading } = calculations(state, titratedVolume, eqData);
  console.log("Calculations Data:", calcLoading ? "Calculating..." : calcData);

  // Fetch graph data here as requested
  const { data: graphData, loading: graphLoading } = phGraph(state, eqData, calcData);
  console.log("Graph Data:", graphLoading ? "Loading Graph..." : graphData);

  const getReactionEquation = () => {
    const reactions = {
      'HCl': {
        'NaOH': { reactants: 'NaOH + HCl', products: 'NaCl + H₂O' },
        'KOH': { reactants: 'KOH + HCl', products: 'KCl + H₂O' },
        'Ca(OH)2': { reactants: 'Ca(OH)₂ + 2HCl', products: 'CaCl₂ + 2H₂O' },
        'NH3': { reactants: 'NH₃ + HCl', products: 'NH₄Cl' },
      },
      'H2SO4': {
        'NaOH': { reactants: '2NaOH + H₂SO₄', products: 'Na₂SO₄ + 2H₂O' },
        'KOH': { reactants: '2KOH + H₂SO₄', products: 'K₂SO₄ + 2H₂O' },
        'Ca(OH)2': { reactants: 'Ca(OH)₂ + H₂SO₄', products: 'CaSO₄ + 2H₂O' },
        'NH3': { reactants: '2NH₃ + H₂SO₄', products: '(NH₄)₂SO₄' },
      },
      'HNO3': {
        'NaOH': { reactants: 'NaOH + HNO₃', products: 'NaNO₃ + H₂O' },
        'KOH': { reactants: 'KOH + HNO₃', products: 'KNO₃ + H₂O' },
        'Ca(OH)2': { reactants: 'Ca(OH)₂ + 2HNO₃', products: 'Ca(NO₃)₂ + 2H₂O' },
        'NH3': { reactants: 'NH₃ + HNO₃', products: 'NH₄NO₃' },
      },
      'CH3COOH': {
        'NaOH': { reactants: 'NaOH + CH₃COOH', products: 'CH₃COONa + H₂O' },
        'KOH': { reactants: 'KOH + CH₃COOH', products: 'CH₃COOK + H₂O' },
        'Ca(OH)2': { reactants: 'Ca(OH)₂ + 2CH₃COOH', products: '(CH₃COO)₂Ca + 2H₂O' },
        'NH3': { reactants: 'NH₃ + CH₃COOH', products: 'CH₃COONH₄' },
      },
    };

    return reactions[state.acidType]?.[state.baseType] || { reactants: 'Base + Acid', products: 'Salt + Water' };
  };
  const reaction = React.useMemo(() => {
    if (eqData && eqData.molecular) {
      const productsSide = eqData.molecular.split('->')[1].trim();
      // Ensure Base + Acid order for color matching (Blue + Red)
      const baseTerm = eqData.base_coeff === 1 ? state.baseType : `${eqData.base_coeff} ${state.baseType}`;
      const acidTerm = eqData.acid_coeff === 1 ? state.acidType : `${eqData.acid_coeff} ${state.acidType}`;
      return {
        reactants: `${baseTerm} + ${acidTerm}`,
        products: productsSide
      };
    }
    return getReactionEquation();
  }, [eqData, state.baseType, state.acidType]);

  // Calculate reaction progress
  const calculateProgress = () => {
    const totalAcid = calculated.nA;
    const totalBase = calculated.nB;
    const reacted = Math.min(totalAcid, totalBase);
    const remaining = Math.abs(totalAcid - totalBase);

    return {
      initial: { acid: totalAcid, base: 0 },
      change: { acid: -reacted, base: reacted },
      equilibrium: {
        acid: totalAcid - reacted,
        base: totalBase,
        excess: remaining
      }
    };
  };

  const progress = calculateProgress();

  return (
    <div className="lab-card p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="lab-gradient rounded-lg p-2">
          <FileText className="h-5 w-5 text-primary-foreground" />
        </div>
        <h2 className="font-display font-semibold text-lg">Reaction & Equations</h2>
      </div>


      {/* Row Layout: Equation & Table on left, Calculated Values on right */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Section: Equation and Reaction Progress Table */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Chemical Equation */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-2">Chemical Equation</p>
            <div className="text-center font-display text-lg font-semibold text-foreground">
              <span className="text-blue-500">{reaction.reactants.split(' + ')[0]}</span>
              <span className="text-muted-foreground"> + </span>
              <span className="text-red-500">{reaction.reactants.split(' + ')[1]}</span>
              <span className="text-primary mx-3">→</span>
              <span className="text-green-500">{reaction.products}</span>
            </div>
          </div>

          {/* Reaction Progress Table */}
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-5 border border-white/40 shadow-sm relative overflow-hidden">
            
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-4 bg-primary rounded-full" />
              Reaction Progress Table (I.C.E)
            </h3>
            
            <div className="overflow-hidden rounded-lg border border-border/50 shadow-inner bg-background/50">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-r border-border/50">Stage</th>
                    <th className="text-center py-3 px-4 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-500/5 border-r border-border/50">Acid (mol)</th>
                    <th className="text-center py-3 px-4 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-500/5">Base (mol)</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px]">
                  {/* Initial Row */}
                  <tr className="border-t border-border/30 hover:bg-white/20 transition-colors">
                    <td className="py-2.5 px-4 text-muted-foreground font-semibold border-r border-border/50 bg-muted/10">Initial (I)</td>
                    <td className="text-center py-2.5 px-4 text-red-700 bg-red-500/5 border-r border-border/50">
                      {progress.initial.acid.toExponential(3)}
                    </td>
                    <td className="text-center py-2.5 px-4 text-blue-700 bg-blue-500/5">
                      {progress.initial.base.toExponential(3)}
                    </td>
                  </tr>
                  {/* Change Row */}
                  <tr className="border-t border-border/30 hover:bg-white/20 transition-colors">
                    <td className="py-2.5 px-4 text-muted-foreground font-semibold border-r border-border/50 bg-muted/10">Change (C)</td>
                    <td className="text-center py-2.5 px-4 text-red-500 bg-red-500/5 border-r border-border/50 font-medium">
                      {progress.change.acid.toExponential(3)}
                    </td>
                    <td className="text-center py-2.5 px-4 text-blue-500 bg-blue-500/5 font-medium">
                      +{progress.change.base.toExponential(3)}
                    </td>
                  </tr>
                  {/* Equilibrium Row */}
                  <tr className="border-t border-border/30 hover:bg-white/20 transition-colors">
                    <td className="py-2.5 px-4 text-muted-foreground font-semibold border-r border-border/50 bg-muted/10">Equilibrium (E)</td>
                    <td className="text-center py-2.5 px-4 text-red-600 font-bold border-r border-border/50 bg-red-500/5">
                      {progress.equilibrium.acid.toExponential(3)}
                    </td>
                    <td className="text-center py-2.5 px-4 text-blue-600 font-bold bg-blue-500/5">
                      {progress.equilibrium.base.toExponential(3)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-muted/50 to-transparent border-l-4 border-primary/30">
              <p className="text-xs font-semibold text-muted-foreground">
                <span className="text-foreground">Result:</span> Excess of {progress.equilibrium.excess.toExponential(3)} mol of {calculated.nA > calculated.nB ? <span className="text-red-600">Acid</span> : <span className="text-blue-600">Base</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Calculated Values */}
        <div className="flex-1 space-y-4 min-w-0">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Calculated Values
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Moles of Acid */}
            <div className="bg-red-50/80 dark:bg-red-950/20 rounded-xl p-3 border border-red-200 dark:border-red-900/30 shadow-sm">
              <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">nₐ (moles of acid)</p>
              <p className="font-mono text-base font-bold text-foreground">
                {(calcData?.nA ?? calculated.nA).toExponential(3)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                Cₐ × Vₐ / 1000
              </p>
            </div>

            {/* Moles of Base */}
            <div className="bg-blue-50/80 dark:bg-blue-950/20 rounded-xl p-3 border border-blue-200 dark:border-blue-900/30 shadow-sm">
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">n_b (moles of base)</p>
              <p className="font-mono text-base font-bold text-foreground">
                {(calcData?.nB ?? calculated.nB).toExponential(3)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                C_b × V_b / 1000
              </p>
            </div>

            {/* Volume of Acid */}
            <div className="bg-slate-50/80 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Vₐ (acid volume)</p>
              <p className="font-mono text-base font-bold text-foreground">
                {state.acidVolume.toFixed(1)} <span className="text-xs text-muted-foreground">mL</span>
              </p>
            </div>

            {/* Volume of Base */}
            <div className="bg-slate-50/80 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">V_b (base volume)</p>
              <p className="font-mono text-base font-bold text-foreground">
                {titratedVolume.toFixed(1)} <span className="text-xs text-muted-foreground">mL</span>
              </p>
            </div>
            
            {/* Concentration of H+ */}
            {calcData?.conc_H !== undefined && (
                <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                <p className="text-xs text-muted-foreground mb-1">[H⁺] (molar)</p>
                <p className="font-mono text-base font-semibold text-foreground">
                    {Number(calcData.conc_H).toExponential(3)}
                </p>
                </div>
            )}
            
            {/* Concentration of OH- */}
            {calcData?.conc_OH !== undefined && (
                <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10">
                <p className="text-xs text-muted-foreground mb-1">[OH⁻] (molar)</p>
                <p className="font-mono text-base font-semibold text-foreground">
                    {Number(calcData.conc_OH).toExponential(3)}
                </p>
                </div>
            )}
          </div>

          {/* Total Volume */}
          <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-4 border border-primary/20 dark:border-primary/40 shadow-sm bg-gradient-to-r from-primary/5 to-transparent">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">V_T = Vₐ + V_b (total volume)</p>
            <p className="font-mono text-xl font-bold text-primary">
              {(calcData?.vT ?? calculated.vT).toFixed(1)} <span className="text-sm font-normal opacity-70">mL</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
              {/* pH Value */}
              <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-8 -mt-8" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Current pH</p>
                <div className="flex items-baseline gap-2">
                    <p className="font-mono text-2xl font-black" style={{
                    color: (calcData?.pH ?? calculated.pH) < 6
                        ? 'hsl(0, 80%, 55%)'
                        : (calcData?.pH ?? calculated.pH) > 8
                        ? 'hsl(215, 80%, 55%)'
                        : 'hsl(142, 70%, 45%)'
                    }}>
                    {(calcData?.pH ?? calculated.pH).toFixed(2)}
                    </p>
                     {calcLoading && <span className="text-xs animate-pulse text-muted-foreground">...</span>}
                </div>
                <p className="text-[10px] font-bold mt-1 uppercase tracking-tight" style={{
                    color: (calcData?.pH ?? calculated.pH) < 6
                        ? 'hsl(0, 70%, 60%)'
                        : (calcData?.pH ?? calculated.pH) > 8
                        ? 'hsl(215, 70%, 60%)'
                        : 'hsl(142, 60%, 50%)'
                }}>
                  {(calcData?.pH ?? calculated.pH) < 6.9
                    ? `Acidic`
                    : (calcData?.pH ?? calculated.pH) > 7.1
                      ? `Basic`
                      : `Neutral`}
                </p>
              </div>

             {/* pOH Value */}
             <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-3 border border-primary/20 shadow-sm">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Current pOH</p>
                <p className="font-mono text-2xl font-black text-primary">
                    {calcData?.pOH !== undefined 
                        ? Number(calcData.pOH).toFixed(2) 
                        : (14 - calculated.pH).toFixed(2)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                    14.00 - pH
                </p>
              </div>
          </div>

          {/* Equivalence Point Info */}
          <div className="bg-muted/30 rounded-lg p-3 border border-dashed border-border">
            <p className="text-xs text-muted-foreground mb-1">Equivalence Point</p>
            <p className="text-sm text-foreground">
              V_b = <span className="font-mono font-semibold">{(calcData?.Veq_L ? calcData.Veq_L * 1000 : calculated.equivalencePoint).toFixed(2)} mL</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Time until equilibrium: {((calcData?.Veq_L ? calcData.Veq_L * 1000 : calculated.equivalencePoint) - titratedVolume) > 0
                ? `${(((calcData?.Veq_L ? calcData.Veq_L * 1000 : calculated.equivalencePoint) - titratedVolume) / 5).toFixed(1)} steps`
                : 'Reached'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
