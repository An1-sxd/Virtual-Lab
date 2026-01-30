import React from 'react';
import { Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const TimeSlider = ({
  timeStart,
  timeEnd,
  currentTime,
  onTimeRangeChange,
}) => {
  const progress = timeEnd > timeStart 
    ? ((currentTime - timeStart) / (timeEnd - timeStart)) * 100 
    : 0;

  return (
    <div className="lab-card p-4">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-sm">Time Control</h3>
      </div>

      <div className="space-y-4">
        {/* Time Range Inputs */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">t₁ (start)</Label>
            <Input
              type="number"
              min="0"
              max={timeEnd - 1}
              value={timeStart}
              onChange={(e) => onTimeRangeChange(parseFloat(e.target.value) || 0, timeEnd)}
              className="h-8 bg-background text-sm"
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">t_end</Label>
            <Input
              type="number"
              min={timeStart + 1}
              max="300"
              value={timeEnd}
              onChange={(e) => onTimeRangeChange(timeStart, parseFloat(e.target.value) || 60)}
              className="h-8 bg-background text-sm"
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Current</Label>
            <div className="h-8 px-3 bg-primary/10 border border-primary/20 rounded-md flex items-center">
              <span className="font-mono text-sm font-semibold text-primary">
                {currentTime.toFixed(1)}s
              </span>
            </div>
          </div>
        </div>

        {/* Progress Slider */}
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            {/* Background track */}
            <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted to-muted"></div>
            
            {/* Active range highlight */}
            <div 
              className="absolute h-full lab-gradient transition-all duration-200"
              style={{ 
                left: '0%',
                width: `${progress}%`,
              }}
            />
            
            {/* Current position indicator */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-card border-2 border-primary rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
              style={{ left: `calc(${progress}% - 10px)` }}
            >
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          </div>
          
          {/* Time labels */}
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground font-mono">{timeStart}s</span>
            <span className="text-xs text-muted-foreground font-mono">{timeEnd}s</span>
          </div>
        </div>

        {/* Slider for adjusting time range */}
        <div className="pt-2">
          <Label className="text-xs text-muted-foreground mb-2 block">Adjust Time Window</Label>
          <Slider
            value={[timeStart, timeEnd]}
            min={0}
            max={120}
            step={1}
            onValueChange={([start, end]) => {
              if (end > start) {
                onTimeRangeChange(start, end);
              }
            }}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
