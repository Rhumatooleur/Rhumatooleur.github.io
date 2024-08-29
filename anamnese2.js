document.addEventListener('DOMContentLoaded', () => {
    initArticulationSelector('Synovites');
    initArticulationSelector('Douleurs');
});

function initArticulationSelector(type) {
    window[`selectedArticulations${type}`] = [];
    const container = document.getElementById(`articulationImage${type}`);
    const image = document.getElementById(`imageArticulations${type}`);
    const canvas = document.getElementById(`canvasOverlay${type}`);
    const ctx = canvas.getContext('2d');
    const articulationTextarea = document.getElementById(`articulationTextarea${type}`);
    const articulationCompteur = document.getElementById(`articulationCompteur${type}`);

    let selectedArticulations = [];

    const articulations = [
        { name: 'Épaule droite', x: 187, y: 156 },
        { name: 'Coude droit', x: 176, y: 223 },
        { name: 'Poignet droit', x: 159, y: 291 },
        { name: 'Articulation trapézo métacarpienne droite', x: 169 , y: 320 },
        { name: 'MCP1 droite', x: 176, y: 344 },
        { name: 'MCP2 droite', x: 158, y: 350 },
        { name: 'MCP3 droite', x: 139, y: 346 },
        { name: 'MCP4 droite', x: 123, y: 339 },
        { name: 'MCP5 droite', x: 111, y: 323 },
        { name: 'IP du pouce droit', x: 179, y: 370 },
        { name: 'IPP2 droite', x: 145, y: 385 },
        { name: 'IPP3 droite', x: 125, y: 375 },
        { name: 'IPP4 droite', x: 109, y: 361 },
        { name: 'IPP5 droite', x: 95, y: 346 },
        { name: 'IPD2 droite', x: 139, y: 405 },
        { name: 'IPD3 droite', x: 112, y: 396 },
        { name: 'IPD4 droite', x: 97, y: 378 },
        { name: 'IPD5 droite', x: 87, y: 360 },
        { name: 'Hanche droite', x: 212, y: 314 },
        { name: 'Genou droit', x: 213, y: 438 },
        { name: 'Cheville droite', x: 209, y: 573 },
        { name: 'MTP1 droite', x: 237, y: 668 },
        { name: 'MTP2 droite', x: 220, y: 662 },
        { name: 'MTP3 droite', x: 207, y: 650 },
        { name: 'MTP4 droite', x: 192, y: 637 },
        { name: 'MTP5 droite', x: 178, y: 627 },
        { name: 'IP de l hallux droit', x: 231, y: 693 },
        { name: 'IPP2 du pied droit', x: 214, y: 681 },
        { name: 'IPP3 du pied droit', x: 200, y: 675 },
        { name: 'IPP4 du pied droit', x: 188, y: 664 },
        { name: 'IPP5 du pied droit', x: 176, y: 649 },
        { name: 'Épaule gauche', x: 303, y: 156 },
        { name: 'Coude gauche', x: 322, y: 223 },
        { name: 'Poignet gauche', x: 337, y: 291 },
        { name: 'Articulation trapézo métacarpienne gauche', x: 325 , y: 320 },
        { name: 'MCP1 gauche', x: 320, y: 344 },
        { name: 'MCP2 gauche', x: 337, y: 350 },
        { name: 'MCP3 gauche', x: 356, y: 346 },
        { name: 'MCP4 gauche', x: 372, y: 339 },
        { name: 'MCP5 gauche', x: 383, y: 323 },
        { name: 'IP du pouce gauche', x: 317, y: 370 },
        { name: 'IPP2 gauche', x: 349, y: 385 },
        { name: 'IPP3 gauche', x: 371, y: 375 },
        { name: 'IPP4 gauche', x: 386, y: 361 },
        { name: 'IPP5 gauche', x: 399, y: 346 },
        { name: 'IPD2 gauche', x: 357, y: 405 },
        { name: 'IPD3 gauche', x: 385, y: 396 },
        { name: 'IPD4 gauche', x: 397, y: 378 },
        { name: 'IPD5 gauche', x: 409, y: 360 },
        { name: 'Hanche gauche', x: 284, y: 314 },
        { name: 'Genou gauche', x: 281, y: 438 },
        { name: 'Cheville gauche', x: 289, y: 573 },
        { name: 'MTP1 gauche', x: 259, y: 668 },
        { name: 'MTP2 gauche', x: 275, y: 662 },
        { name: 'MTP3 gauche', x: 290, y: 650 },
        { name: 'MTP4 gauche', x: 302, y: 637 },
        { name: 'MTP5 gauche', x: 316, y: 627 },
        { name: 'IP de l hallux gauche', x: 263, y: 693 },
        { name: 'IPP2 du pied gauche', x: 279, y: 681 },
        { name: 'IPP3 du pied gauche', x: 296, y: 675 },
        { name: 'IPP4 du pied gauche', x: 309, y: 664 },
        { name: 'IPP5 du pied gauche', x: 317, y: 649 },
    ];

    function resizeCanvas() {
        canvas.width = image.width;
        canvas.height = image.height;
        redrawCircles();
    }

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    }

    function findClosestArticulation(x, y) {
        let closest = null;
        let closestDist = Infinity;
        articulations.forEach(articulation => {
            const dist = Math.hypot(articulation.x - x, articulation.y - y);
            if (dist < closestDist) {
                closestDist = dist;
                closest = articulation;
            }
        });
        return closest;
    }

    function redrawCircles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        selectedArticulations.forEach(articulation => {
            ctx.beginPath();
            ctx.arc(
                articulation.x * (canvas.width / image.naturalWidth),
                articulation.y * (canvas.height / image.naturalHeight),
                10, 0, 2 * Math.PI, false
            );
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#003300';
            ctx.stroke();
        });
    }

    function updateArticulationInfo() {
        const names = selectedArticulations.map(art => art.name).join(', ');
        articulationTextarea.value = names || "Cliquez sur une articulation pour voir son nom.";
        articulationCompteur.textContent = `Nombre d'articulations : ${selectedArticulations.length}`;
        window[`selectedArticulations${type}`] = selectedArticulations;
    }

    image.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('click', (evt) => {
        const mousePos = getMousePos(canvas, evt);
        const closestArticulation = findClosestArticulation(mousePos.x, mousePos.y);

        if (closestArticulation) {
            const index = selectedArticulations.findIndex(art => art.name === closestArticulation.name);
            if (index !== -1) {
                selectedArticulations.splice(index, 1);
            } else {
                selectedArticulations.push(closestArticulation);
            }
            redrawCircles();
            updateArticulationInfo();
        }
    });

    resizeCanvas();
}

function submitForm() {
    const formData = {
        symptomatologieArticulaire: {
            synovites: getSelectedArticulations('Synovites'),
            douleurs: getSelectedArticulations('Douleurs'),
            horaireDouleurs: document.getElementById('horaireDouleurs').value.trim(),
            commentHoraireDouleurs: document.getElementById('commentHoraireDouleurs').value.trim(),
            evolution: {
                poussee: document.getElementById('poussee').checked,
                aggravation: document.getElementById('aggravation').checked,
            },
            commentEvolution: document.getElementById('commentEvolution').value.trim(),
        },
        symptomatologieExtraArticulaire: {
            psoriasis: document.getElementById('psoriasis').checked,
            acneeSevere: document.getElementById('acneeSevere').checked,
            sclérite: document.getElementById('sclérite').checked,
            douleursAbdominales: document.getElementById('douleursAbdominales').checked,
            bruluresMictionnelles: document.getElementById('bruluresMictionnelles').checked,
            angine: document.getElementById('angine').checked,
            aphtoseBipolaire: document.getElementById('aphtoseBipolaire').checked,
            syndromeSec: document.getElementById('syndromeSec').checked,
            exhantheme: document.getElementById('exhantheme').checked,
            eruptionCutanee: document.getElementById('eruptionCutanee').checked,
            erythemeNoueux: document.getElementById('erythemeNoueux').checked,
            vascularites: document.getElementById('vascularites').checked,
            raynaud: document.getElementById('raynaud').checked,
            crisesFebriles: document.getElementById('crisesFebriles').checked,
            commentaires: document.getElementById('commentSymptomatologieExtraArticulaire').value.trim(),  
        },
        antecedentsFamiliaux: {
            polyarthriteRhumatoide: document.getElementById('polyarthriteRhumatoide').checked,
            spondyloarthrite: document.getElementById('spondyloarthrite').checked,
            psoo: document.getElementById('psoo').checked,
            micii: document.getElementById('micii').checked,
            MAIi: document.getElementById('MAIi').checked,
            commentaires: document.getElementById('commentAntecedentsFamiliaux').value.trim(),
        },
        surLePlanGeneral: {
            fievre: document.getElementById('fievre').checked,
            sueursNocurnes: document.getElementById('sueursNocurnes').checked,
            asthenie: document.getElementById('asthenie').checked,
            anorexie: document.getElementById('anorexie').checked,
            pertePoids: document.getElementById('pertePoids').checked,
            consoGoutte: document.getElementById('consoGoutte').checked,
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

    let resultText = generateResultText(formData);

    // Affichage du résultat
    document.getElementById('resultat').value = resultText;

    // Copier le résultat dans le presse-papier
    copyToClipboard(resultText);

    // Générer et afficher le texte type d'anamnèse
    generateTexteTypeAnamnese(formData);
}

function getSelectedArticulations(type) {
    return window[`selectedArticulations${type}`] || [];
}

function generateResultText(formData) {
    let resultText = "";

    // Symptomatologie articulaire
    resultText += "Symptomatologie articulaire :\n";
    resultText += "- Synovites : " + formData.symptomatologieArticulaire.synovites.length + " articulations";
    if (formData.symptomatologieArticulaire.synovites.length > 0) {
        resultText += " (" + formData.symptomatologieArticulaire.synovites.map(a => a.name).join(", ") + ")";
    }
    resultText += "\n";
    resultText += "- Douleurs : " + formData.symptomatologieArticulaire.douleurs.length + " articulations";
    if (formData.symptomatologieArticulaire.douleurs.length > 0) {
        resultText += " (" + formData.symptomatologieArticulaire.douleurs.map(a => a.name).join(", ") + ")";
    }
    resultText += "\n";
    resultText += "- Horaire des douleurs : " + (formData.symptomatologieArticulaire.horaireDouleurs || "non spécifié") + "\n";
    if (formData.symptomatologieArticulaire.commentHoraireDouleurs) {
        resultText += "" + formData.symptomatologieArticulaire.commentHoraireDouleurs + "\n";
    }
    resultText += "- L'évolution se fait par : " + 
        (formData.symptomatologieArticulaire.evolution.poussee ? "poussée" : "") + 
        (formData.symptomatologieArticulaire.evolution.poussee && formData.symptomatologieArticulaire.evolution.aggravation ? ", " : "") + 
        (formData.symptomatologieArticulaire.evolution.aggravation ? "aggravation progressive" : "") + "\n";
    if (formData.symptomatologieArticulaire.commentEvolution) {
        resultText += "" + formData.symptomatologieArticulaire.commentEvolution + "\n";
    }
    resultText += "\n";
    
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
    resultText += "Examens complémentaires : " + (formData.examensComplementaires || "non spécifié") + "\n\n";

    // Thérapeutiques
    resultText += "Thérapeutiques : " + (formData.therapeutiques || "non spécifié") + "\n\n";

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

    return resultText;
}

function generateSymptomatologieExtraArticulaireText(symptomatologieExtraArticulaire) {
    if (Object.values(symptomatologieExtraArticulaire).every(value => value === false || value === '') && symptomatologieExtraArticulaire.commentaires === '') {
        return "Pas de symptomatologie extra-articulaire\n";
    }
    
    let text = "";
    if (symptomatologieExtraArticulaire.psoriasis) {
        text += "Psoriasis, ";
    }
    if (symptomatologieExtraArticulaire.acneeSevere) {
        text += "acné sévère et/ou pustulose palmoplantaire, ";
    }
    if (symptomatologieExtraArticulaire.sclérite) {
        text += "oeil rouge et douloureux, ";
    }
    if (symptomatologieExtraArticulaire.douleursAbdominales) {
        text += "douleurs abdominales, et/ou diarrhées +/- sanglantes, liquides,  ";
    }
    if (symptomatologieExtraArticulaire.bruluresMictionnelles) {
        text += "brûlures mictionnelles, et/ou écoulement uréthraux, conjonctivite, ";
    }
    if (symptomatologieExtraArticulaire.angine) {
        text += "angine et fièvre, ";
    }
    if (symptomatologieExtraArticulaire.aphtoseBipolaire) {
        text += "aphtose bipolaire, ";
    }
    if (symptomatologieExtraArticulaire.syndromeSec) {
        text += "syndrome sec oculaire et/ou xérostomie, ";
    }
    if (symptomatologieExtraArticulaire.exhantheme) {
        text += "exanthème, ";
    }
    if (symptomatologieExtraArticulaire.eruptionCutanee) {
        text += "éruption cutanée photosensible, ";
    }
    if (symptomatologieExtraArticulaire.erythemeNoueux) {
        text += "érythème noueux, ";
    }
    if (symptomatologieExtraArticulaire.vascularites) {
        text += "vascularites, ";
    }
    if (symptomatologieExtraArticulaire.raynaud) {
        text += "phénomène de Raynaud, ";
    }
    if (symptomatologieExtraArticulaire.crisesFebriles) {
        text += "crises fébriles accompagnées de douleurs abdominales, ";
    }
    
    if (symptomatologieExtraArticulaire.commentaires !== '') {
        text += "" + symptomatologieExtraArticulaire.commentaires + ", ";
    }
    return text.trim().replace(/,$/, "") + "\n";
}

function generateAntecedentsFamiliauxText(antecedentsFamiliaux) {
    if (!antecedentsFamiliaux.polyarthriteRhumatoide && !antecedentsFamiliaux.spondyloarthrite && antecedentsFamiliaux.commentaires === '') {
        return "Pas d'antécédents familiaux de rhumatismes inflammatoire chronique\n";
    }
    
    let text = "";
    if (antecedentsFamiliaux.polyarthriteRhumatoide) {
        text += "polyarthrite rhumatoïde, ";
    }
    if (antecedentsFamiliaux.spondyloarthrite) {
        text += "spondyloarthrite, ";
    }
    if (antecedentsFamiliaux.psoo) {
        text += "psoriasis, ";
    }
    if (antecedentsFamiliaux.micii) {
        text += "rCH ou Crohn, ";
    }
    if (antecedentsFamiliaux.MAIi) {
        text += "autres maladies auto-immunes, ";
    }
    if (antecedentsFamiliaux.commentaires !== '') {
        text += "" + antecedentsFamiliaux.commentaires + ", ";
    }
    return text.trim().replace(/,$/, "") + "\n";
}

function generateSurLePlanGeneralText(surLePlanGeneral) {
    let text = "";
    if (!surLePlanGeneral.fievre) {
        text += "Pas de fièvre, ";
    } else {
        text += "Fièvre, ";
    }
    if (!surLePlanGeneral.sueursNocurnes) {
        text += "pas de sueurs nocturnes, ";
    } else {
        text += "Sueurs nocturnes, ";
    }
    if (!surLePlanGeneral.asthenie) {
        text += "pas d'asthénie, ";
    } else {
        text += "Asthénie, ";
    }
    if (!surLePlanGeneral.anorexie) {
        text += "pas d'anorexie, ";
    } else {
        text += "Anorexie, ";
    }
    if (!surLePlanGeneral.pertePoids) {
        text += "pas de perte de poids, ";
    } else {
        text += "Perte de poids, ";
    }
    if (!surLePlanGeneral.consoGoutte) {
        text += "";
    } else {
        text += "Excès alimentaire ou alcool récent, ";
    }
    if (surLePlanGeneral.commentaires !== '') {
        text += "" + surLePlanGeneral.commentaires + ", ";
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
