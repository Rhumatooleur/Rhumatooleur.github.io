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
    resultText += "Au total : Il s'agit ";
    let totalConditions = [];
    if (formData.auTotal.polyarthrite) {
        totalConditions.push("d'une polyarthrite");
    }
    if (formData.auTotal.polyarthralgies) {
        totalConditions.push("de polyarthralgies");
    }
    if (formData.auTotal.nue) {
        totalConditions.push("nue");
    }
    resultText += totalConditions.join(" ");

    let associeeA = formData.auTotal.associeeA.trim() === '' ? "" : "associée à " + formData.auTotal.associeeA;
    let evolution = formData.auTotal.evolution === '' ? "non spécifié" : (formData.auTotal.evolution === "plus6semaines" ? "plus de 6 semaines" : "moins de 6 semaines");

    resultText += " " + associeeA + ", ";
    resultText += "évoluant depuis " + evolution + " ";

    if (formData.auTotal.commentaires !== '') {
        resultText += formData.auTotal.commentaires + "\n\n";
    } else {
        resultText += "\n";
    }

    // Affichage du résultat
    document.getElementById('resultat').value = resultText;

    // Copier le résultat dans le presse-papier
    copyToClipboard(resultText);

    // Générer et afficher le texte type d'anamnèse
    generateTexteTypeAnamnese(formData);
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
        text += "Autres : " + articulations.Autres + ", ";
    }
    return text.trim().replace(/,$/, "") + "\n";
}

function generateSymptomatologieExtraArticulaireText(symptomatologieExtraArticulaire) {
    let text = "";
    if (symptomatologieExtraArticulaire.douleursAbdominales) {
        text += "Douleurs abdominales, ";
    }
    if (symptomatologieExtraArticulaire.diarrhee) {
        text += "Diarrhée, ";
    }
    if (symptomatologieExtraArticulaire.bruluresMictionnelles) {
        text += "Brûlures mictionnelles, ";
    }
    if (symptomatologieExtraArticulaire.ecoulementsUretraux) {
        text += "Ecoulements urétraux, ";
    }
    if (symptomatologieExtraArticulaire.conjonctivite) {
        text += "Conjonctivite, ";
    }
    if (symptomatologieExtraArticulaire.angine) {
        text += "Angine, ";
    }
    if (symptomatologieExtraArticulaire.raynaud) {
        text += "Phénomène de Raynaud, ";
    }
    if (symptomatologieExtraArticulaire.psoriasis) {
        text += "Psoriasis, ";
    }
    if (symptomatologieExtraArticulaire.vascularites) {
        text += "Vascularites, ";
    }
    if (symptomatologieExtraArticulaire.exhantheme) {
        text += "Exanthème, ";
    }
    if (symptomatologieExtraArticulaire.eruptionCutanee) {
        text += "Eruption cutanée, ";
    }
    if (symptomatologieExtraArticulaire.erythemeNoueux) {
        text += "Erythème noueux, ";
    }
    if (symptomatologieExtraArticulaire.acneeSevere) {
        text += "Acné sévère, ";
    }
    if (symptomatologieExtraArticulaire.crisesFebriles) {
        text += "Crises fébriles, ";
    }
    if (symptomatologieExtraArticulaire.syndromeSec) {
        text += "Syndrome sec, ";
    }
    if (symptomatologieExtraArticulaire.xerostomie) {
        text += "Xérostomie, ";
    }
    if (symptomatologieExtraArticulaire.aphtoseBipolaire) {
        text += "Aphtose bipolaire, ";
    }
    if (symptomatologieExtraArticulaire.commentaires !== '') {
        text += "Commentaires : " + symptomatologieExtraArticulaire.commentaires + ", ";
    }
    return text.trim().replace(/,$/, "") + "\n";
}

function generateAntecedentsFamiliauxText(antecedentsFamiliaux) {
    let text = "";
    if (antecedentsFamiliaux.polyarthriteRhumatoide) {
        text += "Polyarthrite rhumatoïde, ";
    }
    if (antecedentsFamiliaux.spondyloarthrite) {
        text += "Spondyloarthrite, ";
    }
    if (antecedentsFamiliaux.commentaires !== '') {
        text += "Commentaires : " + antecedentsFamiliaux.commentaires + ", ";
    }
    return text.trim().replace(/,$/, "") + "\n";
}

function generateSurLePlanGeneralText(surLePlanGeneral) {
    let text = "";
    if (surLePlanGeneral.fievre) {
        text += "Fièvre, ";
    }
    if (surLePlanGeneral.sueursNocurnes) {
        text += "Sueurs nocturnes, ";
    }
    if (surLePlanGeneral.asthenie) {
        text += "Asthénie, ";
    }
    if (surLePlanGeneral.anorexie) {
        text += "Anorexie, ";
    }
    if (surLePlanGeneral.pertePoids) {
        text += "Perte de poids, ";
    }
    if (surLePlanGeneral.commentaires !== '') {
        text += "Commentaires : " + surLePlanGeneral.commentaires + ", ";
    }
    return text.trim().replace(/,$/, "") + "\n";
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function generateTexteTypeAnamnese(formData) {
    let texteTypeAnamnese = `
    **Données:**

    * **Texte type d'anamnèse:** 
    ${document.getElementById('resultat').value}

    **Tâche:**

    Sur la base du texte type d'anamnèse fourni, générer une anamnèse détaillée et intelligible en langage naturel, en incluant les points suivants:

    * **Histoire de la maladie actuelle:**
        * Symptomatologie articulaire
        * Présence de symptômes extra-articulaires 
        * Symptomatologie générale 
    * **Antécédents familiaux:**
        * Présence ou absence de maladies rhumatismales dans la famille
    * **Examens complémentaires :**
        * Résultats des examens biologiques et d'imagerie pertinents
    * **Thérapeutiques entreprises :**
        * Thérapeutiques entreprises et efficacité correspondante 
    * **Conclusion:**
        * Synthèse

    **Instructions supplémentaires:**

    * Veuillez utiliser un langage clair, concis et précis.
    * Respectez la terminologie médicale appropriée.
    * Assurez-vous que l'anamnèse est cohérente et bien structurée.
    * Assurez-vous de bien retranscrire toutes les informations fournies dans le texte type d'anamnèse fourni
    * Assurez-vous de ne rien inventer par rapport au texte type d'anamnèse fournie mais d'y rester fidèle
    * Assurez-vous de ne pas intégrer vous interprétations personnelles
    * Assurez-vous que la synthèse soit rédigée en une phrase
    * Assurez-vous de ne pas répéter plusieurs fois les mêmes informations
    * Assurez vous de ne pas ajouter de phrase inutile d'explication de la tâche que vous avez réalisé`;

    // Affichage du texte type d'anamnèse dans le second textarea
    document.getElementById('texteTypeAnamnese').value = texteTypeAnamnese;
}
