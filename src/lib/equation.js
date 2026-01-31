import { substances } from "./substances";
import { useFetch } from "../hooks/useFetch";

export const equation = (state) => {
    const { acids, bases } = substances();
    const acid = acids.find(a => a.value === state.acidType);
    const base = bases.find(b => b.value === state.baseType);

    const sent = {
        "acid": {
            "type": acid.type,
            "formula": acid.value,
            "species_formula": acid.s_value,
            "species_charge": acid.c_value
        },
        "base": {
            "type": base.type,
            "formula": base.value,
            "species_formula": base.s_value,
            "species_charge": base.c_value
        }
    };

    const { data, loading, error } = useFetch(
        "operations/equation",
        {
            method: "POST",
            body: sent,
            enabled: !!sent?.acid?.type && !!sent?.base?.type,
        }
    );

    return { data, loading, error };
}