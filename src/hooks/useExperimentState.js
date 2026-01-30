import { useState, useCallback, useMemo, useEffect } from 'react';

const initialState = {
  acidType: 'HCl',
  acidConcentration: 0.1,
  acidVolume: 25,
  baseType: 'NaOH',
  baseConcentration: 0.1,
  baseVolume: 0,
  timeStart: 0,
  timeEnd: 60,
  currentTime: 0,
  isRunning: false,
  isPaused: false,
};

export const useExperimentState = () => {
  const [state, setState] = useState(initialState);
  const [titratedVolume, setTitratedVolume] = useState(0);

  // Calculate derived values
  const calculated = useMemo(() => {
    const nA = (state.acidConcentration * state.acidVolume) / 1000; // moles
    const nB = (state.baseConcentration * titratedVolume) / 1000; // moles
    const vT = state.acidVolume + titratedVolume; // mL
    
    // Calculate equivalence point (volume of base needed)
    const equivalencePoint = (nA * 1000) / state.baseConcentration;
    
    // Calculate pH based on titration progress
    let pH;
    const excessMoles = Math.abs(nA - nB);
    const isAcidExcess = nA > nB;
    
    if (titratedVolume === 0) {
      // Initial pH of strong acid
      pH = -Math.log10(state.acidConcentration);
    } else if (Math.abs(nA - nB) < 0.0001) {
      // At equivalence point
      pH = 7;
    } else if (nB < nA) {
      // Before equivalence - excess acid
      const excessH = (nA - nB) / (vT / 1000);
      pH = Math.max(0, -Math.log10(excessH));
    } else {
      // After equivalence - excess base
      const excessOH = (nB - nA) / (vT / 1000);
      const pOH = Math.max(0, -Math.log10(excessOH));
      pH = Math.min(14, 14 - pOH);
    }
    
    return { nA, nB, vT, pH, excessMoles, isAcidExcess, equivalencePoint };
  }, [state.acidConcentration, state.acidVolume, state.baseConcentration, titratedVolume]);

  // Generate pH curve data points
  const pHCurveData = useMemo(() => {
    const data = [];
    const maxVolume = calculated.equivalencePoint * 2;
    const step = maxVolume / 100;
    
    for (let vb = 0; vb <= maxVolume; vb += step) {
      const nA = (state.acidConcentration * state.acidVolume) / 1000;
      const nB = (state.baseConcentration * vb) / 1000;
      const vT = state.acidVolume + vb;
      
      let pH;
      if (vb === 0) {
        pH = -Math.log10(state.acidConcentration);
      } else if (Math.abs(nA - nB) < 0.0001) {
        pH = 7;
      } else if (nB < nA) {
        const excessH = (nA - nB) / (vT / 1000);
        pH = Math.max(0, -Math.log10(excessH));
      } else {
        const excessOH = (nB - nA) / (vT / 1000);
        const pOH = Math.max(0, -Math.log10(excessOH));
        pH = Math.min(14, 14 - pOH);
      }
      
      data.push({ volume: Number(vb.toFixed(2)), pH: Number(pH.toFixed(2)) });
    }
    
    return data;
  }, [state.acidConcentration, state.acidVolume, state.baseConcentration, calculated.equivalencePoint]);

  // Simulation timer
  useEffect(() => {
    let interval;
    
    if (state.isRunning && !state.isPaused) {
      interval = setInterval(() => {
        setState(prev => {
          const newTime = prev.currentTime + 0.5;
          if (newTime >= prev.timeEnd) {
            return { ...prev, currentTime: prev.timeEnd, isRunning: false };
          }
          return { ...prev, currentTime: newTime };
        });
        
        // Simulate adding base over time
        setTitratedVolume(prev => {
          const maxTitration = calculated.equivalencePoint * 1.5;
          const progress = (state.currentTime - state.timeStart) / (state.timeEnd - state.timeStart);
          return Math.min(maxTitration, maxTitration * progress);
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [state.isRunning, state.isPaused, state.currentTime, state.timeStart, state.timeEnd, calculated.equivalencePoint]);

  // Actions
  const setAcid = useCallback((type, concentration, volume) => {
    setState(prev => ({
      ...prev,
      acidType: type,
      acidConcentration: concentration,
      acidVolume: volume,
    }));
  }, []);

  const setBase = useCallback((type, concentration, volume) => {
    setState(prev => ({
      ...prev,
      baseType: type,
      baseConcentration: concentration,
      baseVolume: volume,
    }));
  }, []);

  const setTimeRange = useCallback((start, end) => {
    setState(prev => ({
      ...prev,
      timeStart: start,
      timeEnd: end,
    }));
  }, []);

  const runSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true, isPaused: false }));
  }, []);

  const pauseSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resetSimulation = useCallback(() => {
    setState(initialState);
    setTitratedVolume(0);
  }, []);

  const addReagent = useCallback(() => {
    setTitratedVolume(prev => Math.min(prev + 5, calculated.equivalencePoint * 2));
  }, [calculated.equivalencePoint]);

  const removeReagent = useCallback(() => {
    setTitratedVolume(prev => Math.max(0, prev - 5));
  }, []);

  return {
    state,
    calculated,
    pHCurveData,
    titratedVolume,
    setAcid,
    setBase,
    setTimeRange,
    runSimulation,
    pauseSimulation,
    resetSimulation,
    addReagent,
    removeReagent,
    updateState: setState,
    setTitratedVolume,
  };
};
