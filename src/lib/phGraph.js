import { useFetch } from "../hooks/useFetch";
import { substances } from "./substances";

export const phGraph = (state, eqData, calcData) => {
    const { acids, bases } = substances();
    const acid = acids.find(a => a.value === state.acidType);
    const base = bases.find(b => b.value === state.baseType);

    // Prepare payload
    // Only send if we have all necessary dependencies
    const sent = (eqData && calcData && acid && base) ? {
        "acid": {"type": acid.type || ""},
        "base": {"type": base.type || ""},
        "C_analyte": state.acidConcentration,
        "V_analyte": state.acidVolume,
        "C_titrant": state.baseConcentration,
        "V_eq": calcData.Veq_L,
        "nu_H": eqData.acid_eq,
        "nu_OH": eqData.base_eq,
        "pka": acid.pka || 0,
        "pka_conjugate": base.pka || 0,
        "temp": state.temperature
    } : null;

    console.log("phGraph sent data : " + sent)

    const { data, loading, error } = useFetch(
        "operations/phVsVol",
        {
            method: "POST",
            body: sent,
            enabled: !!sent
        }
    );

    console.log("phGraph data : " + data)

    return { data, loading, error };
}
