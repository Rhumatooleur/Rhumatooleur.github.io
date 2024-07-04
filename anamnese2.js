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
            commentaires: document.getElementById('commentSymptomatologieExtraArticulaire').value.trim(),
        },
        antecedentsFamiliaux: {
            polyarthriteRhumatoide: document.getElementById('polyarthriteRhumatoide').checked,
            spondyloarthrite: document.getElementById('spondyloarthrite').checked,
            commentaires: document.getElementById('commentAntecedentsFamiliaux').value.trim(),
        },
        surLePlanGeneral: {
            fievre: document.getElementById('fievre').checked,
            sueursNocurnes: document.getElementById('sueursNocurnes').checked,
            asthenie: document.getElementById('asthenie').checked,
            anorexie: document.getElementById('anorexie').checked,
            pertePoids: document.getElementById('pertePoids').checked,
            commentaires: document.getElementById('commentSurLePlanGeneral').value.trim(),
        },
        examensComplementaires: document.getElementById('examensComplementaires').value.trim(),
        therapeutiques: document.getElementById('therapeutiques').value.trim(),
        auTotal: {
            polyarthrite: document.getElementById('polyarthrite').checked,
            polyarthralgies: document.getElementById('polyarthralgies').checked,
            nue: document.getElementById('nue').checked,
            associeeA: document.getElementById('associeeA').value.trim(),
            evolution: document.querySelector('input[name="evolution"]:checked') ? document.querySelector('input[name="evolution"]:checked').value : '',
            commentaires: document.getElementById('commentAuTotal').value.trim(),
        }
    };

    let resultText = "";

    // Symptomatologie articulaire
    resultText += "Symptomatologie articulaire :\n";
    resultText += "- Nb articulations gonflées (synovites) :\n";
    resultText += generateArticulationsText(formData.symptomatologieArticulaire.synovites);
    resultText += "\n- Nb articulations douloureuses :\n";
    resultText += generateArticulationsText(formData.symptomatologieArticulaire.douleurs);
    resultText += "\n- Horaire des douleurs : ";
    resultText += formData.symptomatologieArticulaire.horaireDouleurs === '' ? "non spécifié" : formData.symptomatologieArticulaire.horaireDouleurs;
    resultText += "\n- L'évolution se fait par : ";
    resultText += (formData.symptomatologieArticulaire.evolution.poussee ? "poussée" : "") + (formData.symptomatologieArticulaire.evolution.poussee && formData.symptomatologieArticulaire.evolution.aggravation ? ", " : "") + (formData.symptomatologieArticulaire.evolution.aggravation ? "aggravation progressive" : "");
    resultText += "\n\n";

    // Symptomatologie extra-articulaire
    resultText += "Symptomatologie extra-articulaire :\n";
    resultText += generateSymptomatologieExtraArticulaireText(formData.symptomatologieExtraArticulaire);
    resultText += "\n";

    // Antécédents familiaux
    resultText += "Antécédents familiaux :\n";
    resultText += generateAntecedentsFamiliauxText(formData.antecedentsFamiliaux);
    resultText += "\n";

    // Sur le plan général
    resultText += "Sur le plan général :\n";
    resultText += generateSurLePlanGeneralText(formData.surLePlanGeneral);
    resultText += "\n";

    // Examens complémentaires
    resultText += "Examens complémentaires : ";
    resultText += formData.examensComplementaires === '' ? "non spécifié" : formData.examensComplementaires;
    resultText += "\n\n";

    // Thérapeutiques
    resultText += "Thérapeutiques : ";
    resultText += formData.therapeutiques === '' ? "non spécifié" : formData.therapeutiques;
    resultText += "\n\n";

    // Au total
    resultText += "Au total :\n";
    resultText += "- Il s'agit d'une ";
    let totalConditions = [];
    if (formData.auTotal.polyarthrite) {
        totalConditions.push("polyarthrite");
    }
    if (formData.auTotal.polyarthralgies) {
        totalConditions.push("polyarthralgies");
    }
    if (formData.auTotal.nue) {
        totalConditions.push("nue");
    }
    resultText += totalConditions.join(" ou ") + " selon la case cochée\n";
    resultText += "- Associée à : ";
    resultText += formData.auTotal.associeeA === '' ? "non spécifié" : formData.auTotal.associeeA;
    resultText += "\n- Évolution : ";
    resultText += formData.auTotal.evolution === '' ? "non spécifié" : (formData.auTotal.evolution === "plus6semaines" ? "plus de 6 semaines" : "moins de 6 semaines");
    resultText += "\n";
    if (formData.auTotal.commentaires !== '') {
        resultText += formData.auTotal.commentaires + "\n\n";
    } else {
        resultText += "\n";
    }

    // Affichage du résultat
    document.getElementById('resultat').value = resultText;

    // Copier le résultat dans le presse-papier
    copyToClipboard(resultText);
}

function generateArticulationsText(articulations) {
    let text = "";
    if (articulations.IPPs) {
        text += "IPPs, ";
    }
    if (articulations.MCPs) {
        text += "MCPs, ";
    }
    if (articulations.Poignets) {
        text += "Poignets, ";
    }
    if (articulations.Coudes) {
        text += "Coudes, ";
    }
    if (articulations.Epaules) {
        text += "Epaules, ";
    }
    if (articulations.Genoux) {
        text += "Genoux, ";
    }
    if (articulations.Autres !== '') {
        text += "Autres : " + articulations.Autres;
    }
    // Enlever la dernière virgule et l'espace si elle existe
    if (text.endsWith(", ")) {
        text = text.slice(0, -2);
    }
    return text === "" ? "non spécifié" : text;
}

function generateSymptomatologieExtraArticulaireText(extraArticulaire) {
    let text = "";
    if (extraArticulaire.douleursAbdominales) {
        text += "douleurs abdominales, ";
    }
    if (extraArticulaire.diarrhee) {
        text += "diarrhée, ";
    }
    if (extraArticulaire.bruluresMictionnelles) {
        text += "brûlures mictionnelles, ";
    }
    if (extraArticulaire.ecoulementsUretraux) {
        text += "écoulements urétraux, ";
    }
    if (extraArticulaire.conjonctivite) {
        text += "conjonctivite, ";
    }
    if (extraArticulaire.angine) {
        text += "angine, ";
    }
    if (extraArticulaire.raynaud) {
        text += "phénomène de Raynaud, ";
    }
    if (extraArticulaire.psoriasis) {
        text += "psoriasis, ";
    }
    if (extraArticulaire.vascularites) {
        text += "vascularites, ";
    }
    if (extraArticulaire.exhantheme) {
        text += "exanthème, ";
    }
    if (extraArticulaire.eruptionCutanee) {
        text += "éruption cutanée photosensible, ";
    }
    if (extraArticulaire.erythemeNoueux) {
        text += "érythème noueux, ";
    }
    if (extraArticulaire.acneeSevere) {
        text += "acné sévère et pustulose palmo-plantaire (sapho), ";
    }
    if (extraArticulaire.crisesFebriles) {
        text += "crises fébriles + douleurs abdo (MEFV), ";
    }
    if (extraArticulaire.syndromeSec) {
        text += "syndrome sec oculaire, ";
    }
    if (extraArticulaire.xerostomie) {
        text += "xérostomie, ";
    }
    if (extraArticulaire.aphtoseBipolaire) {
        text += "aphtose bipolaire, ";
    }
    if (extraArticulaire.commentaires !== '') {
        text += extraArticulaire.commentaires;
    }
    // Enlever la dernière virgule et l'espace si elle existe
    if (text.endsWith(", ")) {
        text = text.slice(0, -2);
    }
    // Ajouter un point à la fin si aucun commentaire supplémentaire
    if (!text.endsWith(":")) {
        text += ".";
    }
    return text === "" ? "non spécifié" : text;
}

function generateAntecedentsFamiliauxText(antecedents) {
    let text = "";
    if (antecedents.polyarthriteRhumatoide) {
        text += "polyarthrite rhumatoïde, ";
    }
    if (antecedents.spondyloarthrite) {
        text += "spondyloarthrite, ";
    }
    if (antecedents.commentaires !== '') {
        text += antecedents.commentaires;
    }
    // Enlever la dernière virgule et l'espace si elle existe
    if (text.endsWith(", ")) {
        text = text.slice(0, -2);
    }
    // Ajouter un point à la fin si aucun commentaire supplémentaire
    if (!text.endsWith(":")) {
        text += ".";
    }
    return text === "" ? "non spécifié" : text;
}

function generateSurLePlanGeneralText(planGeneral) {
    let text = "";
    if (planGeneral.fievre) {
        text += "fièvre, ";
    }
    if (planGeneral.sueursNocurnes) {
        text += "sueurs nocturnes, ";
    }
    if (planGeneral.asthenie) {
        text += "asthénie, ";
    }
    if (planGeneral.anorexie) {
        text += "anorexie, ";
    }
    if (planGeneral.pertePoids) {
        text += "perte de poids, ";
    }
    if (planGeneral.commentaires !== '') {
        text += planGeneral.commentaires;
    }
    // Enlever la dernière virgule et l'espace si elle existe
    if (text.endsWith(", ")) {
        text = text.slice(0, -2);
    }
    // Ajouter un point à la fin si aucun commentaire supplémentaire
    if (!text.endsWith(":")) {
        text += ".";
    }
    return text === "" ? "non spécifié" : text;
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Résultat copié dans le presse-papiers.');
}
