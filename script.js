$(function() {
    $(".sortable").sortable();
    $(".sortable").disableSelection();
  });
  
  document.getElementById("generateFinalTextButton").addEventListener("click", function() {
    var selectedTexts = [];
  
    $(".sortable .draggable-checkbox-container").each(function() {
      var checkbox = $(this).find("input[type='checkbox']");
      var textareaId = checkbox.attr("id").replace("Checkbox", "Text");
  
      if (checkbox.is(":checked")) {
        selectedTexts.push(document.getElementById(textareaId).value);
      }
    });
  
    var finalText = selectedTexts.join("\n\n");
    document.getElementById("finalText").value = finalText;
  });
  
  document.getElementById("formatButton").addEventListener("click", function() {
    // Récupérer le texte entré par l'utilisateur
    var inputText = document.getElementById("inputText").value;
  
    // Pré-traiter le texte d'entrée pour supprimer les retours à la ligne, les "H" entourés de deux espaces, et les espaces de plus d'une case
    var preprocessedText = inputText.replace(/\n/g, ' ').replace(/ H /g, ' ').replace(/\s\s+/g, ' ');
    var preprocessedText = inputText.replace(/\n/g, ' ').replace(/ B /g, ' ').replace(/\s\s+/g, ' ');
    var preprocessedText = inputText.replace(/Ferritine/g, 'Ferritineeeeeeeeeee');
  
    // Créer une chaîne pour stocker le texte formaté de la bio de base
    var bioDeBaseText = 'Biologie:\n';
  
    // Définition des paramètres de la bio de base et leurs noms formatés avec les unités
var bioDeBaseParams = {
    "Hémoglobine": { name: "Hémoglobine", unit: "g/L,", variations: ["Hémoglobine"] },
    "Leucocytes": { name: " Leucocytes", unit: "G/L, ", variations: ["Leucocytes"] },
    "Polynucléaires neutrophiles calc": { name: " PNNs", unit: "G/L,", variations: ["Poly neutro calc"] },
    "Plaquettes": { name: " Plaquettes", unit: "G/L", variations: ["plaquettes"] },
    "CRP": { name: "CRP", unit: "mg/L ", variations: ["CRP"] },
    "Sodium": { name: "Na", unit: "mmol/L, ", variations: ["Sodium"] },
    "Potassium": { name: " K", unit: "mmol/L, ", variations: ["Potassium"] },
    "Urée": { name: " Urée", unit: "mmol/L,", variations: ["Urée"] },
    "Créatinine": { name: " Créatinine", unit: "µmol/L", variations: ["Créatinine"] },
    "ASAT": { name: "ASAT", unit: "UI/L,  ", variations: ["ASAT-SGOT", "ASAT"] }, 
    "ALAT": { name: " ALAT", unit: "UI/L,  ", variations: ["ALAT-SGPT", "ALAT"] },
    "Phosphatases alcalines": { name: " PAL", unit: "UI/L,  ", variations: ["Phos.Alcalines", "Phosphatases alcalines"] },
    "Gamma-GT": { name: " GGT", unit: "UI/L,  ", variations: ["Gamma GT", "Gamma-GT"] },
    "Bilirubine totale": { name: " Bilirubine totale", unit: "µmol/l", variations: ["Bilirubine totale"] },
    "TP": { name: "TP", unit: "%, ", variations: ["TP"] },
    "INR": { name: " INR", unit: ", ", variations: ["INR"] },
    "TCA Patient/Témoin":{ name:"TCA ratio", unit: " ", variations: ["TCA Patient/Témoin"]}
};

// Fonction pour rechercher les variations d'un paramètre et extraire la valeur et l'unité
function findValue(variations, input, unit) {
    for (var i = 0; i < variations.length; i++) {
        var pattern = new RegExp(variations[i] + "\\s*[:\\s]*\\s*(?:B|H)?\\s*(<|>)?\\s*([\\d.,]+)\\s*(" + unit + ")?", "i");
        var match = input.match(pattern);
        if (match) {
            return { operator: match[1] || "", value: match[2].replace(",", "."), unit: match[3] || unit };
        }
    }
    return null;
}

// Remplacer les valeurs dans le texte formaté de la bio de base et les placer à leurs positions respectives

var skipNewLine = false; // Variable to control whether to add a new line

for (var param in bioDeBaseParams) {
    var valueObject = findValue(bioDeBaseParams[param].variations, preprocessedText, bioDeBaseParams[param].unit);
    if (valueObject) {
        var formattedValue = valueObject.operator + " " + valueObject.value + " " + (bioDeBaseParams[param].unit === "%" ? "" : bioDeBaseParams[param].unit);
        if (param === "Hémoglobine" || param === "ASAT" || param === "ALAT" || param === "Phosphatases alcalines" || param === "Gamma-GT" || param === "TP" || param === "INR" || param === "Sodium" || param === "Potassium" || param === "Urée" || param === "Leucocytes" || param === "Polynucléaires neutrophiles calc" ) {
            bioDeBaseText += bioDeBaseParams[param].name + " : " + formattedValue.trim(); // Do not add newline after ASAT
            skipNewLine = true; // Set flag to skip newline after ASAT
        } else {
            if (skipNewLine) {
                bioDeBaseText += " " + bioDeBaseParams[param].name + " : " + formattedValue.trim() + "\n";
                skipNewLine = false; // Reset flag
            } else {
                bioDeBaseText += bioDeBaseParams[param].name + " : " + formattedValue.trim() + "\n";
            }
        }
    } else {
        if (param === "Hémoglobine" || param === "ASAT" || param === "ALAT" || param === "Phosphatases alcalines" || param === "Gamma-GT" || param === "TP" || param === "INR" || param === "Sodium" || param === "Potassium" || param === "Urée" || param === "Leucocytes"  || param === "Polynucléaires neutrophiles calc" ) {
            bioDeBaseText += bioDeBaseParams[param].name + " : _____ " + bioDeBaseParams[param].unit; // Do not add newline after ASAT
            skipNewLine = true; // Set flag to skip newline after ASAT
        } else {
            if (skipNewLine) {
                bioDeBaseText += " " + bioDeBaseParams[param].name + " : _____ " + bioDeBaseParams[param].unit + "\n";
                skipNewLine = false; // Reset flag
            } else {
                bioDeBaseText += bioDeBaseParams[param].name + " : _____ " + bioDeBaseParams[param].unit + "\n";
            }
        }
    }
}
  
    // Afficher le texte formaté de la bio de base dans la zone de sortie correspondante
    document.getElementById("bioDeBaseText").value = bioDeBaseText;

    // Fonction pour rechercher les variations d'un paramètre et extraire la valeur et l'unité pour le bilan d'anémie
    function findValueBilanAnemie(variations, input, unit) {
        for (var i = 0; i < variations.length; i++) {
            var pattern = new RegExp(variations[i] + "\\s*[:\\s]*\\s*(?:B|H)?\\s*(<|>)?\\s*([\\d.,]+)\\s*(" + unit + ")?", "i");
            var match = input.match(pattern);
            if (match) {
                return { operator: match[1] || "", value: match[2].replace(",", "."), unit: match[3] || unit };
            }
        }
        return null;
    }

    // Définition des paramètres pour le bilan d'anémie et leurs noms formatés avec les unités
    var bilanAnemieParams = {
        "Hémoglobine": { name: "Hémoglobine", unit: "g/l" },
        "VGM": { name: "VGM", unit: "fl" },
        "Réticulocytes": { name: "Réticulocytes", unit: "" },
        "Ferritine": { name: "Ferritine", unit: "µg/l", variations: ["Ferritineeeeeeeeeee"]  },
        "coef saturation TRF": { name: "CST", unit: "%" },
        "B9": { name: "B9", unit: "ng/mL" },
        "B12": { name: "B12", unit: "pg/mL" },
        "TSH US": { name: "TSH", unit: "mUI/l" }
    };

    // Fonction pour formater le bilan d'anémie
    function formatBilanAnemie(inputText) {
        var formattedBilanAnemie = '';
        for (var param in bilanAnemieParams) {
            var valueObject = findValueBilanAnemie(bilanAnemieParams[param].variations || [param], inputText, bilanAnemieParams[param].unit);
            if (valueObject) {
                formattedBilanAnemie += bilanAnemieParams[param].name + " : " + valueObject.operator + " " + valueObject.value + " " + bilanAnemieParams[param].unit + "\n";
            } else {
                formattedBilanAnemie += bilanAnemieParams[param].name + " : _____ " + bilanAnemieParams[param].unit + "\n";
            }
        }
        return formattedBilanAnemie;
    }

    // Appel de la fonction pour formater le bilan d'anémie et stocker le texte formaté dans la variable correspondante
    var bilanAnemieText = formatBilanAnemie(preprocessedText);

    // Afficher le texte formaté du bilan d'anémie dans la zone de sortie correspondante
    document.getElementById("bilanAnemieText").value = bilanAnemieText.trim();


    // Créer une chaîne pour stocker le texte formaté du bilan phosphocalcique
    var bilanPhosphocalciqueText = '';

    // Définition des paramètres pour le bilan phosphocalcique et leurs noms formatés avec les unités
    var bilanPhosphocalciqueParams = {
        "Ca total corrigé": { name: "calcémie corrigée (albumine)", unit: "mmol/L" },
        "Phosphore": { name: "phosphore", unit: "mmol/L" },
        "Vit 25 OH D2 et D3": { name: "vitamine D", unit: "ng/mL" },
        "PTH INTACT": { name: "PTH", unit: "ng/L" },
        "TSH US": { name: "TSH", unit: "mUI/L" },
    };


    // Remplacer les valeurs dans le texte formaté du bilan phosphocalcique et les placer à leurs positions respectives
    for (var param in bilanPhosphocalciqueParams) {
        var variations = [param, bilanPhosphocalciqueParams[param].name];
        var valueObject = findValue(variations, preprocessedText, bilanPhosphocalciqueParams[param].unit);
        if (valueObject) {
            var formattedValue = valueObject.operator + " " + valueObject.value + " " + (bilanPhosphocalciqueParams[param].unit === "%" ? "" : bilanPhosphocalciqueParams[param].unit);
            bilanPhosphocalciqueText += bilanPhosphocalciqueParams[param].name + " : " + formattedValue.trim() + "\n";
        } else {
            bilanPhosphocalciqueText += bilanPhosphocalciqueParams[param].name + " : _____ " + bilanPhosphocalciqueParams[param].unit + "\n";
        }
    }

    // Afficher le texte formaté du bilan phosphocalcique dans la zone de sortie correspondante
    document.getElementById("bilanPhosphocalciqueText").value = bilanPhosphocalciqueText.trim();


    // Définition des paramètres pour le bilan auto-immun
    var bilanAutoImmunParams = {
        "FRH IGM": { name: "FR", unit: "" },
        "ccpg3": { name: "ACPA / Anti-CPP", unit: "" },
        "ACAN": { name: "Anticorps anti-nucléaires", unit: "" },
        "ANCA": { name: "ANCAs", unit: "" },
    };

    // Fonction pour formater le bilan auto-immun
    function formatBilanAutoImmun(inputText) {
        var formattedBilanAutoImmun = 'Bilan auto-immun:\n';
        for (var param in bilanAutoImmunParams) {
            var pattern = new RegExp(param + "\\s*[:\\s]*\\s*([\\w\\s]+)", "i");
            var match = inputText.match(pattern);
            if (match) {
                var value = match[1].trim();
                // Vérifier si la valeur contient uniquement des chiffres
                if (!/^\d+(\.\d+)?$/.test(value)) {
                    value = "_____";
                }
                formattedBilanAutoImmun += bilanAutoImmunParams[param].name + " : " + value + " " + bilanAutoImmunParams[param].unit + "\n";
            } else {
                formattedBilanAutoImmun += bilanAutoImmunParams[param].name + " : _____ " + bilanAutoImmunParams[param].unit + "\n";
            }
        }
        return formattedBilanAutoImmun;
    }

    // Appel de la fonction pour formater le bilan auto-immun et stocker le texte formaté dans la variable correspondante
    var bilanAutoImmunText = formatBilanAutoImmun(preprocessedText);

    // Afficher le texte formaté du bilan auto-immun dans la zone de sortie correspondante
    var bilanAutoImmunTextarea = document.getElementById("bilanAutoImmunText");
    bilanAutoImmunTextarea.value = bilanAutoImmunText.trim();

    // Créer une chaîne pour stocker le texte formaté du bilan nutritionnel
    var bilannutritionnelText = '';

    // Définition des paramètres pour le bilan nutritionnel et leurs noms formatés avec les unités
    var bilannutritionnelParams = {
        "Albumine": { name: "Albumine", unit: "g/L" },
        "Pré-albumine": { name: "Pré-albumine", unit: "g/L" },
        "Acide urique": { name: "Acide urique", unit: "µmol/l" },

    };


    // Remplacer les valeurs dans le texte formaté du bilan nutritionnel et les placer à leurs positions respectives
    for (var param in bilannutritionnelParams) {
        var variations = [param, bilannutritionnelParams[param].name];
        var valueObject = findValue(variations, preprocessedText, bilannutritionnelParams[param].unit);
        if (valueObject) {
            var formattedValue = valueObject.operator + " " + valueObject.value + " " + (bilannutritionnelParams[param].unit === "%" ? "" : bilannutritionnelParams[param].unit);
            bilannutritionnelText += bilannutritionnelParams[param].name + " : " + formattedValue.trim() + "\n";
        } else {
            bilannutritionnelText += bilannutritionnelParams[param].name + " : _____ " + bilannutritionnelParams[param].unit + "\n";
        }
    }

    // Afficher le texte formaté du bilan nutritionnel dans la zone de sortie correspondante
    document.getElementById("bilannutritionnelText").value = bilannutritionnelText.trim();

    // Fonction d'extraction des sérologies virales
    function generer_srologies_virales(contenu) {
        var resultats_séro = {};

        var hcv_result = /HEPATITE C.*?\s+hcv résultat=\s*(.*?)\s+/s;
        var hcv_match = contenu.match(hcv_result);
        if (hcv_match) {
            resultats_séro["Hépatite C"] = hcv_match[1].trim();
        }

        var hiv_result = /VIH.*?\s+hiv résultat=\s*(.*?)\s+/s;
        var hiv_match = contenu.match(hiv_result);
        if (hiv_match) {
            resultats_séro["VIH"] = hiv_match[1].trim();
        }

        var ebv_result = /EBV.*?\s+EBNA résultat=\s*(.*?)\s+/s;
        var ebv_match = contenu.match(ebv_result);
        if (ebv_match) {
            resultats_séro["EBV"] = ebv_match[1].trim();
        }

        var parvo_result = /parvovirus b19.*?\s+Parvo IgG résultat=\s*(.*?)\s+/s;
        var parvo_match = contenu.match(parvo_result);
        if (parvo_match) {
            resultats_séro["Parvovirus B19"] = parvo_match[1].trim();
        }

        var syphilis_result = /SYPHILIS.*?\s+syphilis\s*(.*?)\s+/s;
        var syphilis_match = contenu.match(syphilis_result);
        if (syphilis_match) {
            resultats_séro["Syphilis"] = syphilis_match[1].trim();
        }

        var hepB_result = /HEPATITE B.*?\s+hcb résultat=\s*(.*?)\s+/s;
        var hepB_match = contenu.match(hepB_result);
        if (hepB_match) {
            resultats_séro["Hépatite B"] = hepB_match[1].trim();
        }

        var lyme_result = /LYME.*?\s+LYME\s*(.*?)\s+/s;
        var lyme_match = contenu.match(lyme_result);
        if (lyme_match) {
            resultats_séro["Lyme"] = lyme_match[1].trim();
        }

        return resultats_séro;
    }

    // Appeler la fonction pour extraire les résultats sérologiques
    var resultats_serologies = generer_srologies_virales(preprocessedText);
    console.log("Résultats des sérologies :", resultats_serologies);

    // Intégrer les résultats extraits dans l'élément HTML
    var seroviralesText = "";
    for (var test in resultats_serologies) {
        seroviralesText += test + ": " + resultats_serologies[test] + "\n";
    }
    console.log("Texte des sérologies formaté :", seroviralesText);

    document.getElementById('seroviralesText').value = seroviralesText;

    document.getElementById("generateFinalTextButton").addEventListener("click", function() {
        var selectedTexts = [];
    
        $(".sortable .draggable-checkbox-container").each(function() {
            var checkbox = $(this).find("input[type='checkbox']");
            var textareaId = checkbox.attr("id").replace("Checkbox", "Text");
    
            if (checkbox.is(":checked")) {
                selectedTexts.push(document.getElementById(textareaId).value);
            }
        });
    
        var finalText = selectedTexts.join("\n\n");
        document.getElementById("finalText").value = finalText;
    
        // Copier le texte final dans le presse-papiers
        navigator.clipboard.writeText(finalText)
    });
    
    document.getElementById("formatButton").addEventListener("click", function() {
        // Votre code de formatage précédent
    }); 
  });
  