function generateAnamnese() {
    let anamnese = '';

    // Symptomatologie articulaire
    const nbArticulationsDouloureuses = document.getElementById('nbArticulationsDouloureuses').value;
    const nbArticulationsGonflees = document.getElementById('nbArticulationsGonflees').value;
    anamnese += `Nombre d'articulations douloureuses: ${nbArticulationsDouloureuses}\n`;
    anamnese += `Nombre d'articulations gonflées: ${nbArticulationsGonflees}\n`;

    const articulationsDouloureuses = ['epauleDouloureuseD', 'epauleDouloureuseG', 'poignetDouloureuxD', 'poignetDouloureuxG'];
    anamnese += 'Détail des articulations douloureuses:\n';
    articulationsDouloureuses.forEach(id => {
        if (document.getElementById(id).checked) {
            anamnese += `- ${document.querySelector('label[for="' + id + '"]').innerText}\n`;
        }
    });

    const articulationsGonflees = ['epauleGonfleeD', 'epauleGonfleeG', 'poignetGonfleD', 'poignetGonfleG'];
    anamnese += 'Détail des articulations gonflées:\n';
    articulationsGonflees.forEach(id => {
        if (document.getElementById(id).checked) {
            anamnese += `- ${document.querySelector('label[for="' + id + '"]').innerText}\n`;
        }
    });

    // Anamnèse
    const dureeEvolution = document.querySelector('input[name="dureeEvolution"]:checked');
    if (dureeEvolution) {
        anamnese += `Durée d’évolution: ${dureeEvolution.value}\n`;
    }

    const douleur = ['douleurEN', 'evolutionPoussees', 'reveilsNocturnes', 'derouillageMatinal', 'amelioreeEffort', 'aggraveeRepos'];
    anamnese += 'Douleur:\n';
    douleur.forEach(id => {
        if (document.getElementById(id).checked) {
            anamnese += `- ${document.querySelector('label[for="' + id + '"]').innerText}\n`;
        }
    });

    const aeg = ['asthenie', 'pertePoids', 'anorexie', 'troublesSommeil'];
    anamnese += 'AEG:\n';
    aeg.forEach(id => {
        if (document.getElementById(id).checked) {
            anamnese += `- ${document.querySelector('label[for="' + id + '"]').innerText}\n`;
        }
    });

    if (document.getElementById('fievre').checked) {
        anamnese += '- Fièvre, fébricule, sueurs nocturnes\n';
    }
    if (document.getElementById('angine').checked) {
        anamnese += '- Angine + fièvre (rhumatisme post sgA)\n';
    }

    const arthriteDigestive = ['shigella', 'salmonella', 'yersinia', 'clostridioides', 'campylobacter'];
    anamnese += 'Arthrite réactionnelle digestive:\n';
    arthriteDigestive.forEach(id => {
        if (document.getElementById(id).checked) {
            anamnese += `- ${document.querySelector('label[for="' + id + '"]').innerText}\n`;
        }
    });

    const arthriteChlamydia = ['bruluresMictionnelles', 'ecoulements', 'conjonctivite'];
    anamnese += 'Arthrite réactionnelle à Chlamydia:\n';
    arthriteChlamydia.forEach(id => {
        if (document.getElementById(id).checked) {
            anamnese += `- ${document.querySelector('label[for="' + id + '"]').innerText}\n`;
        }
    });

    if (document.getElementById('sclerodermie').checked) {
        anamnese += '- Sclérodermie (Phénomène de Raynaud)\n';
    }

    // Affichage du texte d'anamnèse généré
    document.getElementById('anamneseText').innerText = anamnese;
}
