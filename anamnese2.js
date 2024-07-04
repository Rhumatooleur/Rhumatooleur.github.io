function submitForm() {
    const formData = {
        symptomatologieArticulaire: {
            synovites: {
                IPPs: document.getElementById('synovitesIPPs').checked,
                MCPs: document.getElementById('synovitesMCPs').checked,
                Poignets: document.getElementById('synovitesPoignets').checked,
                Coudes: document.getElementById('synovitesCoudes').checked,
                Epaules: document.getElementById('synovitesEpaules').checked,
                Genoux: document.getElementById('synovitesGenoux').checked,
                Autres: document.getElementById('synovitesAutres').value.trim(),
            },
            douleurs: {
                IPPs: document.getElementById('douleursIPPs').checked,
                MCPs: document.getElementById('douleursMCPs').checked,
                Poignets: document.getElementById('douleursPoignets').checked,
                Coudes: document.getElementById('douleursCoudes').checked,
                Epaules: document.getElementById('douleursEpaules').checked,
                Genoux: document.getElementById('douleursGenoux').checked,
                Autres: document.getElementById('douleursAutres').value.trim(),
            },
            horaireDouleurs: document.getElementById('horaireDouleurs').value.trim(),
            evolution: {
                poussee: document.getElementById('poussee').checked,
                aggravation: document.getElementById('aggravation').checked,
            }
        },
        symptomatologieExtraArticulaire: {
            douleursAbdominales: document.getElementById('douleursAbdominales').checked,
            diarrhee: document.getElementById('diarrhee').checked,
            bruluresMictionnelles: document.getElementById('bruluresMictionnelles').checked,
            ecoulementsUretraux: document.getElementById('ecoulementsUretraux').checked,
            conjonctivite: document.getElementById('conjonctivite').checked,
            angine: document.getElementById('angine').checked,
            raynaud: document.getElementById('raynaud').checked,
            psoriasis: document.getElementById('psoriasis').checked,
            vascularites: document.getElementById('vascularites').checked,
            exhantheme: document.getElementById('exhantheme').checked,
            eruptionCutanee: document.getElementById('eruptionCutanee').checked,
            erythemeNoueux: document.getElementById('erythemeNoueux').checked,
            acneeSevere: document.getElementById('acneeSevere').checked,
            crisesFebriles: document.getElementById('crisesFebriles').checked,
            syndromeSec: document.getElementById('syndromeSec').checked,
            xerostomie: document.getElementById('xerostomie').checked,
            aphtoseBipolaire: document.getElementById('aphtoseBipolaire').checked,
        },
        antecedentsFamiliaux: {
            polyarthriteRhumatoide: document.getElementById('polyarthriteRhumatoide').checked,
            spondyloarthrite: document.getElementById('spondyloarthrite').checked,
        },
        surLePlanGeneral: {
            fievre: document.getElementById('fievre').checked,
            sueursNocurnes: document.getElementById('sueursNocurnes').checked,
            asthenie: document.getElementById('asthenie').checked,
            anorexie: document.getElementById('anorexie').checked,
            pertePoids: document.getElementById('pertePoids').checked,
        },
        examensComplementaires: document.getElementById('examensComplementaires').value.trim(),
        therapeutiques: document.getElementById('therapeutiques').value.trim(),
        auTotal: {
            polyarthrite: document.getElementById('polyarthrite').checked,
            polyarthralgies: document.getElementById('polyarthralgies').checked,
            nue: document.getElementById('nue').checked,
            associeeA: document.getElementById('associeeA').value.trim(),
            evolution: document.querySelector('input[name="evolution"]:checked') ? document.querySelector('input[name="evolution"]:checked').value : '',
        }
    };

    let resultText = "";

    // Construction du texte à afficher
    resultText += "Symptomatologie articulaire :\n";
    resultText += "- Nb articulations gonflées (synovites) :\n";
    resultText += generateArticulationsText(formData.symptomatologieArticulaire.synovites);
    resultText += "\n";
    resultText += "- Nb articulations douloureuses :\n";
    resultText += generateArticulationsText(formData.symptomatologieArticulaire.douleurs);
    resultText += "\n";

    resultText += "- Horaire des douleurs : " + formData.symptomatologieArticulaire.horaireDouleurs + "\n";
    if (formData.symptomatologieArticulaire.evolution.poussee || formData.symptomatologieArticulaire.evolution.aggravation) {
        resultText += "- L'évolution se fait par : ";
        let evolutions = [];
        if (formData.symptomatologieArticulaire.evolution.poussee) {
            evolutions.push("poussée");
        }
        if (formData.symptomatologieArticulaire.evolution.aggravation) {
            evolutions.push("aggravation progressive");
        }
        resultText += evolutions.join(", ") + "\n";
    }
    resultText += "\n";

    resultText += "Symptomatologie extra-articulaire :\n";
    resultText += generateSymptomatologieExtraArticulaireText(formData.symptomatologieExtraArticulaire);
    resultText += "\n";

    resultText += "Antécédents familiaux :\n";
    resultText += generateAntecedentsFamiliauxText(formData.antecedentsFamiliaux);
    resultText += "\n";

    resultText += "Sur le plan général :\n";
    resultText += generateSurLePlanGeneralText(formData.surLePlanGeneral);
    resultText += "\n";

    if (formData.examensComplementaires) {
        resultText += "Examens complémentaires réalisés :\n" + formData.examensComplementaires + "\n\n";
    }

    if (formData.therapeutiques) {
        resultText += "Thérapeutiques :\n" + formData.therapeutiques + "\n\n";
    }

    resultText += "Au total :\n";
    let totalConditions = [];
    if (formData.auTotal.polyarthrite) {
        totalConditions.push("Polyarthrite");
    }
    if (formData.auTotal.polyarthralgies) {
        totalConditions.push("Polyarthralgies");
    }
    if (formData.auTotal.nue) {
        totalConditions.push("nue");
    }
    if (formData.auTotal.associeeA) {
        totalConditions.push("associée à " + formData.auTotal.associeeA);
    }
    if (formData.auTotal.evolution) {
        totalConditions.push("évoluant depuis " + (formData.auTotal.evolution === "plus6semaines" ? "plus de 6 semaines" : "moins de 6 semaines"));
    }
    resultText += totalConditions.join(", ");
    if (totalConditions.length > 0) {
        resultText += "\n";
    } else {
        resultText += "Non spécifié\n";
    }

    // Afficher le résultat dans la textarea dédiée
    const resultTextarea = document.getElementById('resultat');
    resultTextarea.value = resultText;
}

// Fonction pour générer le texte des articulations
function generateArticulationsText(data) {
    let articulations = [];
    if (data.IPPs) articulations.push("IPPs");
    if (data.MCPs) articulations.push("MCPs");
    if (data.Poignets) articulations.push("Poignets");
    if (data.Coudes) articulations.push("Coudes");
    if (data.Epaules) articulations.push("Epaules");
    if (data.Genoux) articulations.push("Genoux");
    if (data.Autres) articulations.push("Autres : " + data.Autres);
    return articulations.join(", ");
}

// Fonction pour générer le texte de la symptomatologie extra-articulaire
function generateSymptomatologieExtraArticulaireText(data) {
    let symptoms = [];
    if (data.douleursAbdominales) symptoms.push("douleurs abdominales");
    if (data.diarrhee) symptoms.push("diarrhée");
    if (data.bruluresMictionnelles) symptoms.push("brûlures mictionnelles");
    if (data.ecoulementsUretraux) symptoms.push("écoulements urétraux");
    if (data.conjonctivite) symptoms.push("conjonctivite");
    if (data.angine) symptoms.push("angine");
    if (data.raynaud) symptoms.push("phénomène de Raynaud");
    if (data.psoriasis) symptoms.push("psoriasis");
    if (data.vascularites) symptoms.push("vascularites");
    if (data.exhantheme) symptoms.push("exanthème");
    if (data.eruptionCutanee) symptoms.push("éruption cutanée photosensible");
    if (data.erythemeNoueux) symptoms.push("érythème noueux");
    if (data.acneeSevere) symptoms.push("acné sévère");
    if (data.crisesFebriles) symptoms.push("crises fébriles");
    if (data.syndromeSec) symptoms.push("syndrome sec");
    if (data.xerostomie) symptoms.push("xérostomie");
    if (data.aphtoseBipolaire) symptoms.push("aphtose bipolaire");
    return symptoms.join(", ");
}

// Fonction pour générer le texte des antécédents familiaux
function generateAntecedentsFamiliauxText(data) {
    let antecedents = [];
    if (data.polyarthriteRhumatoide) antecedents.push("polyarthrite rhumatoïde");
    if (data.spondyloarthrite) antecedents.push("spondyloarthrite");
    return antecedents.join(", ");
}

// Fonction pour générer le texte sur le plan général
function generateSurLePlanGeneralText(data) {
    let generalPlan = [];
    if (data.fievre) generalPlan.push("fièvre");
    if (data.sueursNocurnes) generalPlan.push("sueurs nocturnes");
    if (data.asthenie) generalPlan.push("asthénie");
    if (data.anorexie) generalPlan.push("anorexie");
    if (data.pertePoids) generalPlan.push("perte de poids");
    return generalPlan.join(", ");
}