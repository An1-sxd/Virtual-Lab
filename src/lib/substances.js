import React from 'react';
import { useFetch } from '../hooks/useFetch';

const defaultAcids = [
    { value: 'HCl', label: 'HCl (Hydrochloric Acid)' },
    { value: 'H2SO4', label: 'H₂SO₄ (Sulfuric Acid)' },
    { value: 'HNO3', label: 'HNO₃ (Nitric Acid)' },
    { value: 'CH3COOH', label: 'CH₃COOH (Acetic Acid)' },
  ];
  
  const defaultBases = [
    { value: 'NaOH', label: 'NaOH (Sodium Hydroxide)' },
    { value: 'KOH', label: 'KOH (Potassium Hydroxide)' },
    { value: 'Ca(OH)2', label: 'Ca(OH)₂ (Calcium Hydroxide)' },
    { value: 'NH3', label: 'NH₃ (Ammonia)' },
  ];

export const substances = () => {
    const { data: substances, loading: isLoading, error: isError } = useFetch("substances/");

    const acids = React.useMemo(() => {
        if (!substances || isError) return defaultAcids;
        const filtered = substances.filter(s => s.sub_type && s.sub_type.includes('acid'));
        const unique = Array.from(new Map(filtered.map(s => [s.formula, s])).values());
        return unique.length > 0
            ? unique.map(s => ({ value: s.formula, label: `${s.formula} (${s.name})`, type: s.sub_type.split("_")[0], s_value: s.species_formula, c_value: s.species_charge }))
            : defaultAcids;
    }, [substances, isError]);

    const bases = React.useMemo(() => {
        if (!substances || isError) return defaultBases;
        const filtered = substances.filter(s => s.sub_type && s.sub_type.includes('base'));
        const unique = Array.from(new Map(filtered.map(s => [s.formula, s])).values());
        return unique.length > 0
            ? unique.map(s => ({ value: s.formula, label: `${s.formula} (${s.name})`, type: s.sub_type.split("_")[0], s_value: s.species_formula, c_value: s.species_charge }))
            : defaultBases;
    }, [substances, isError]);

    return { acids, bases, isLoading, isError };
}