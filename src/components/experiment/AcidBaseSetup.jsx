import React from 'react';
import { Beaker, Plus, Minus, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlaskVisualization } from './FlaskVisualization';

const acids = [
  { value: 'HCl', label: 'HCl (Hydrochloric Acid)' },
  { value: 'H2SO4', label: 'H₂SO₄ (Sulfuric Acid)' },
  { value: 'HNO3', label: 'HNO₃ (Nitric Acid)' },
  { value: 'CH3COOH', label: 'CH₃COOH (Acetic Acid)' },
];

const bases = [
  { value: 'NaOH', label: 'NaOH (Sodium Hydroxide)' },
  { value: 'KOH', label: 'KOH (Potassium Hydroxide)' },
  { value: 'Ca(OH)2', label: 'Ca(OH)₂ (Calcium Hydroxide)' },
  { value: 'NH3', label: 'NH₃ (Ammonia)' },
];

export const AcidBaseSetup = ({
  state,
  calculated,
  titratedVolume,
  onAcidChange,
  onBaseChange,
  onReset,
  onVolumeChange,
  maxVolume = 50,
  runSimulation,
  pauseSimulation,
  resetSimulation,
}) => {
  const [stepAmount, setStepAmount] = React.useState(0.1);

  const handleVolumeChange = (newVolume) => {
    onVolumeChange(Math.min(Math.max(0, newVolume), maxVolume));
  };

  const handleStepChange = (value) => {
    const val = parseFloat(value);
    if (!isNaN(val) && val > 0) {
      setStepAmount(val);
    }
  };

  const incrementVolume = () => {
    handleVolumeChange(titratedVolume + stepAmount);
  };

  const decrementVolume = () => {
    handleVolumeChange(titratedVolume - stepAmount);
  };

  return (
    <div className="lab-card p-6 h-full">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="lab-gradient rounded-lg p-2">
            <Beaker className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="font-display font-semibold text-lg">Acid & Base Setup</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="labPrimary" 
            size="sm" 
            className="gap-2"
            onClick={runSimulation}
            disabled={state.isRunning && !state.isPaused}
          >
            <Play className="h-4 w-4" />
            {state.isRunning && !state.isPaused ? 'Running...' : 'Run'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={pauseSimulation}
            disabled={!state.isRunning || state.isPaused}
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={resetSimulation}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Row Layout: Visualization on left, Controls on right */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Flask Visualization with Volume Control - Fixed Size */}
        <div className="flex gap-0 items-center shrink-0 bg-muted/30 rounded-lg border border-border">
          {/* Flask */}
          <div className="p-4 flex items-center justify-center" style={{ width: '300px', height: '400px' }}>
            <FlaskVisualization
              acidVolume={state.acidVolume}
              baseVolume={titratedVolume}
              maxVolume={100}
              pH={calculated.pH}
            />
          </div>

          {/* Vertical Volume Slider */}
          <div className="flex flex-col items-center gap-2 px-4 border-l border-border" style={{ height: '400px' }}>
            <div className="flex items-center gap-1.5 pt-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Step</span>
              <Input
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={stepAmount}
                onChange={(e) => handleStepChange(e.target.value)}
                className="w-12 h-7 text-xs text-center font-mono p-1"
              />
              <span className="text-[10px] text-muted-foreground font-medium uppercase">mL</span>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-2">
              {/* Plus Button */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={incrementVolume}
                disabled={titratedVolume >= maxVolume}
              >
                <Plus className="h-4 w-4" />
              </Button>

              {/* Vertical Slider */}
              <div className="relative flex items-center justify-center" style={{ height: '180px' }}>
                <input
                  type="range"
                  min="0"
                  max={maxVolume}
                  step="0.1"
                  value={titratedVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="volume-slider-vertical"
                  style={{
                    width: '180px',
                    height: '8px',
                    transform: 'rotate(90deg)',
                    transformOrigin: 'center',
                    background: `linear-gradient(to right, hsl(var(--primary)) ${(titratedVolume/maxVolume)*100}%, transparent ${(titratedVolume/maxVolume)*100}%)`
                  }}
                />
              </div>

              {/* Minus Button */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={decrementVolume}
                disabled={titratedVolume <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              {/* Volume Display */}
              <div className="bg-primary/5 rounded-full px-3 py-1.5 border border-primary/10 mt-2 flex items-center gap-2 whitespace-nowrap">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Volume</span>
                <span className="font-mono text-sm font-bold text-primary">
                  {titratedVolume.toFixed(1)}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase">mL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section - Takes remaining space */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Acid Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              Acid
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Select 
                  value={state.acidType} 
                  onValueChange={(v) => onAcidChange(v, state.acidConcentration, state.acidVolume)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-50">
                    {acids.map((acid) => (
                      <SelectItem key={acid.value} value={acid.value}>
                        {acid.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Cₐ (mol/L)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="2"
                  value={state.acidConcentration}
                  onChange={(e) => onAcidChange(state.acidType, parseFloat(e.target.value) || 0.1, state.acidVolume)}
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Vₐ (mL)</Label>
                <Input
                  type="number"
                  step="1"
                  min="1"
                  max="100"
                  value={state.acidVolume}
                  onChange={(e) => onAcidChange(state.acidType, state.acidConcentration, parseFloat(e.target.value) || 25)}
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          {/* Base Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Base
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Select 
                  value={state.baseType} 
                  onValueChange={(v) => onBaseChange(v, state.baseConcentration, state.baseVolume)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border z-50">
                    {bases.map((base) => (
                      <SelectItem key={base.value} value={base.value}>
                        {base.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">C_b (mol/L)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="2"
                  value={state.baseConcentration}
                  onChange={(e) => onBaseChange(state.baseType, parseFloat(e.target.value) || 0.1, state.baseVolume)}
                  className="bg-background"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">V_b (mL)</Label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={titratedVolume.toFixed(1)}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onReset} className="w-full">
              Reset Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
