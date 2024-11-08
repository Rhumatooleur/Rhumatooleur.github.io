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
  
    var preprocessedText = inputText
    .replace(/\n/g, ' ')                     // Remplacer les retours à la ligne par des espaces
    .replace(/#/g, '')                       // Supprimer tous les dièses
    .replace(/\*/g, '')                      // Supprimer tous les astérisques
    .replace(/\(CRP\)/g, '')                          // Supprimer "(CRP)"
    .replace(/\bsoit\b/g, '')                   // Supprimer tous les mots "soit"
    .replace(/\s\s+/g, ' ')                  // Remplacer les espaces de plus d'une case par un espace unique
    .replace(/\(Immunoturbidimétrie - Siemens ATELLICA\)/g, '') // Supprimer le texte spécifique
    .replace(/\s+/g, '');                    // Supprimer tous les espaces
    

    // Afficher le texte pré-formaté dans la nouvelle zone de texte
    document.getElementById("preFormattedText").value = preprocessedText;

  
    // Créer une chaîne pour stocker le texte formaté de la bio de base
    var bioDeBaseText = '';
  
    // Définition des paramètres de la bio de base et leurs noms formatés avec les unités
var bioDeBaseParams = {
    "Hémoglobine": { name: "Hémoglobine", unit: "g/L,", variations: ["Hémoglobine"] },
    "Leucocytes": { name: " Leucocytes", unit: "G/L, ", variations: ["Leucocytes"] },
    "Polynucléaires neutrophiles": { name: " PNNs", unit: "G/L,", variations: ["PNNs", "Polynucléaires neutrophiles", "Polynucléairesneutrophiles"] },
    "Plaquettes": { name: "Plaquettes", unit: "G/L", variations: ["Thrombocytes"] },
    "CRP": { name: "CRP", unit: "mg/L ", variations: ["ProtéineCréactive"] },
    "Sodium": { name: "Na", unit: "mmol/L, ", variations: ["Sodium"] },
    "Potassium": { name: " K", unit: "mmol/L, ", variations: ["Potassium"] },
    "Urée": { name: " Urée", unit: "mmol/L,", variations: ["Urée"] },
    "Créatinine": { name: "Créatinine", unit: "µmol/L", variations: ["Créatinine"] },
    "ASAT": { name: "ASAT", unit: "UI/L,  ", variations: ["ASAT-SGOT", "ASAT"] }, 
    "ALAT": { name: " ALAT", unit: "UI/L,  ", variations: ["ALAT-SGPT", "ALAT"] },
    "Phosphatases alcalines": { name: "PAL", unit: "UI/L,  ", variations: ["Phos.Alcalines", "Phosphatases alcalines", "Phosphatase alcaline", "Phosphatasealcaline"] },
    "Gamma-GT": { name: "GGT", unit: "UI/L, ", variations: ["Gamma GT", "Gamma-GT", "Gamma Glutamyl Transférase", "GammaGlutamylTransférase"] },
    "Bilirubine totale": { name: "Bilirubine totale", unit: "µmol/l", variations: ["Bilirubine totale", "Bilirubinetotale"] },
    "TP": { name: "TP", unit: "%, ", variations: ["Tauxdeprothrombine"] },
    "INR": { name: "INR", unit: ", ", variations: ["INR"] },
    "TCA Patient/Témoin":{ name:"TCA ratio", unit: " ", variations: ["Ratiopatient/témoin"]}
};

function findValue(variations, input, unit) {
    for (var i = 0; i < variations.length; i++) {
        var pattern;
        
        // Cas spécifique pour "Polynucléaires neutrophiles" et "Polynucléairesneutrophiles"
        if (variations[i] === "Polynucléaires neutrophiles" || variations[i] === "Polynucléairesneutrophiles") {
            // Chercher le pourcentage suivi de la valeur en "G/l"
            pattern = new RegExp(variations[i] + "\\s*[:\\s]*\\s*(?:B|H)?\\s*(<|>)?\\s*\\d+(?:,\\d+)?%\\s*(\\d+(?:,\\d+)?)\\s*G/l", "i");
        } else {
            // Pour les autres paramètres, continuer la recherche classique
            pattern = new RegExp(variations[i] + "\\s*[:\\s]*\\s*(?:B|H)?\\s*(<|>)?\\s*([\\d.,]+)\\s*(" + unit + ")?", "i");
        }

        var match = input.match(pattern);
        if (match) {
            if (variations[i] === "Polynucléaires neutrophiles" || variations[i] === "Polynucléairesneutrophiles") {
                // Si on a trouvé le pourcentage, retourner la valeur en "G/l" après le pourcentage
                return { operator: match[1] || "", value: match[2].replace(",", "."), unit: "G/l" };
            } else {
                // Sinon, retourner la valeur classique trouvée
                return { operator: match[1] || "", value: match[2].replace(",", "."), unit: match[3] || unit };
            }
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
        if (param === "Hémoglobine" || param === "ASAT" || param === "ALAT" || param === "Phosphatases alcalines" || param === "Gamma-GT" || param === "TP" || param === "INR" || param === "Sodium" || param === "Potassium" || param === "Urée" || param === "Leucocytes" || param === "Polynucléaires neutrophiles" ) {
            bioDeBaseText += bioDeBaseParams[param].name + " : " + formattedValue.trim(); // Do not add newline after 
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
        if (param === "Hémoglobine" || param === "ASAT" || param === "ALAT" || param === "Phosphatases alcalines" || param === "Gamma-GT" || param === "TP" || param === "INR" || param === "Sodium" || param === "Potassium" || param === "Urée" || param === "Leucocytes"  || param === "Polynucléaires neutrophiles" ) {
            bioDeBaseText += bioDeBaseParams[param].name + " : _____ " + bioDeBaseParams[param].unit; // Do not add newline after 
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


    // Créer une chaîne pour stocker le texte formaté du bilan phosphocalcique
    var bilanPhosphocalciqueText = '';

    // Définition des paramètres pour le bilan phosphocalcique et leurs noms formatés avec les unités
    var bilanPhosphocalciqueParams = {
        "Calcium": { name: "Calcium", unit: "mmol/L" },
        "Ca total corrigé": { name: "Calcémie corrigée (albumine)", unit: "mmol/L" },
        "Phosphore": { name: "Phosphore", unit: "mmol/L" },
        "25-OH Vitamine D": { name: "25-OH Vitamine D", unit: "nmol/L" },
        "PTH": { name: "PTH", unit: "ng/L" },
        "TSH": { name: "TSH", unit: "mUI/L" },
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

    // Ajouter la ligne EPS à la fin du bilan
    bilanPhosphocalciqueText += "EPS : _____\n";

    // Afficher le texte formaté du bilan phosphocalcique dans la zone de sortie correspondante
    document.getElementById("bilanPhosphocalciqueText").value = bilanPhosphocalciqueText.trim();


    // Définition des paramètres pour le bilan auto-immun
    var bilanAutoImmunParams = {
        "Rhumatoides": { name: "Facteurs Rhumatoides", unit: "" },
        "AntiPeptidesCycliquesCitrullinés": { name: "Anticorps Anti-CPP", unit: "" },
        "AntiNucléaires(cellules HEp2)": { name: "Anti Nucléaires (cellules HEp2)", unit: "" },
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
        "Préalbumine": { name: "Préalbumine", unit: "g/L" },
        "Acideurique": { name: "Acide urique", unit: "µmol/l" },

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

  });
  