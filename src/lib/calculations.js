import { useFetch } from "../hooks/useFetch";

export const calculations = (state, titratedVolume, equationData) => {
    
    // Prepare calculations payload
    const sent = equationData ? {
        "C_analyte": state.acidConcentration,
        "V_analyte": state.acidVolume,
        "C_titrante": state.baseConcentration,
        "V_added": titratedVolume,
        "nu_H": equationData.acid_eq,
        "nu_OH": equationData.base_eq
    } : null;

    const { data, loading, error } = useFetch(
        "operations/calcs",
        {
            method: "POST",
            body: sent,
            enabled: !!sent
        }
    );

    console.log("calculations data : " + data)

    return { data, loading, error };
}
