import React, { useState } from 'react';
import { FlaskConical, Plus, Minus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const VolumeControl = ({
  volume,
  maxVolume = 50,
  onVolumeChange,
}) => {
  const [step, setStep] = useState(5);

  const handleChange = (newVolume) => {
     onVolumeChange(Math.min(Math.max(0, newVolume), maxVolume));
  };
  
  const handleStepChange = (value) => {
    const val = parseFloat(value);
    if (!isNaN(val) && val > 0) {
      setStep(val);
    }
  };

  return (
    <div className="lab-card p-4">
      <div className="flex items-center gap-3 mb-4">
        <FlaskConical className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-sm">Added Volume Control</h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
             <Label className="text-xs text-muted-foreground mb-2 block">Volume Added from Burette (mL)</Label>
             <div className="flex items-center gap-4">
               <Slider
                 value={[volume]}
                 min={0}
                 max={maxVolume}
                 step={0.1}
                 onValueChange={([val]) => handleChange(val)}
                 className="flex-1"
               />
               <div className="w-24">
                 <div className="relative">
                   <Input
                     type="number"
                     min="0"
                     max={maxVolume}
                     step="0.1"
                     value={volume}
                     onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
                     className="pr-8 text-right font-mono"
                   />
                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                     mL
                   </span>
                 </div>
               </div>
             </div>
          </div>
        </div>
        
        <div className="flex items-end justify-between gap-4 pt-2 border-t border-border">
             <div className="w-32">
               <Label className="text-xs text-muted-foreground mb-2 block">Step Amount</Label>
               <div className="relative">
                 <Input
                   type="number"
                   min="0.1"
                   max="50"
                   step="0.1"
                   value={step}
                   onChange={(e) => handleStepChange(e.target.value)}
                   className="pr-8 font-mono h-9"
                 />
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                   mL
                 </span>
               </div>
             </div>
             
             <div className="flex gap-2">
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => handleChange(volume - step)}
                 className="gap-2"
                 disabled={volume <= 0}
               >
                 <Minus className="h-4 w-4" />
                 Remove {step}mL
               </Button>
               <Button 
                 variant="labPrimary" 
                 size="sm" 
                 onClick={() => handleChange(volume + step)}
                 className="gap-2"
                 disabled={volume >= maxVolume}
               >
                 <Plus className="h-4 w-4" />
                 Add {step}mL
               </Button>
             </div>
        </div>
      </div>
    </div>
  );
};
