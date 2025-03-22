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

    var finalText = selectedTexts.join("\n");
    document.getElementById("finalText").value = finalText;
});

// Fonction pour limiter les sauts de ligne consécutifs
function removeExtraNewlines(text) {
    return text.replace(/\n{3,}/g, '\n'); // Remplacer 3 ou plus sauts de ligne consécutifs par 2 sauts de ligne
}

// Fonction pour supprimer 250 caractères après "ELECTROPHORESE"
function removeTextAfterElectrophoresis(text) {
    var regex = /ELECTROPHORESE.{0,250}/i; // Trouver "ELECTROPHORESE" suivi de jusqu'à 250 caractères
    return text.replace(regex, "ELECTROPHORESE");
}

document.getElementById("formatButton").addEventListener("click", function() {
    // Récupérer le texte entré par l'utilisateur
    var inputText = document.getElementById("inputText").value;

    var preprocessedText = inputText
        .replace(/\n/g, ' ')                     // Remplacer les retours à la ligne par des espaces
        .replace(/#/g, '')                       // Supprimer tous les dièses
        .replace(/\*/g, '')                      // Supprimer tous les astérisques
        .replace(/\(CRP\)/g, '')                 // Supprimer "(CRP)"
        .replace(/\bsoit\b/g, '')                // Supprimer tous les mots "soit"
        .replace(/\s\s+/g, ' ')                  // Remplacer les espaces multiples par un unique
        .replace(/\(Immunoturbidimétrie - Siemens ATELLICA\)/g, '') // Supprimer le texte spécifique
        .replace(/\s+/g, '');                    // Supprimer tous les espaces

    // Appliquer la suppression des caractères après "ELECTROPHORESE"
    preprocessedText = removeTextAfterElectrophoresis(preprocessedText);

    preprocessedText = preprocessedText.replace(/#/g, "");

    // Afficher le texte pré-formaté dans la nouvelle zone de texte
    document.getElementById("preFormattedText").value = preprocessedText;
  
    // Créer une chaîne pour stocker le texte formaté de la bio de base
    var bioDeBaseText = '1) Bilan biologique : \n- Hémogramme : ';
  
    // Définition des paramètres de la bio de base et leurs noms formatés avec les unités
var bioDeBaseParams = {
    "Hémoglobine": { name: "Hémoglobine", unit: "g/L,", variations: ["Hémoglobine"] },
    "Leucocytes": { name: " Leucocytes", unit: "G/L, ", variations: ["Leucocytes"] },
    "Polynucléaires neutrophiles": { name: " PNNs", unit: "G/L,", variations: ["PNNs", "Polynucléaires neutrophiles", "Polynucléairesneutrophiles"] },
    "Plaquettes": { name: "Plaquettes", unit: "G/L", variations: ["Thrombocytes"] },
    "CRP": { name: "- CRP", unit: "mg/L ", variations: ["ProtéineCréactive"] },
    "Sodium": { name: "- Ionogramme : Na", unit: "mmol/L, ", variations: ["Sodium"] },
    "Potassium": { name: " K", unit: "mmol/L, ", variations: ["Potassium"] },
    "Créatinine": { name: " Créatinine", unit: "µmol/L, ", variations: ["Créatinine"] },
    "DFG": { name: "DFG (CKD-EPI)", unit: "mL/min", variations: ["CKD-EPI"] },
    "ASAT": { name: "- Bilan hépatique : ASAT", unit: "UI/L,  ", variations: ["ASAT-SGOT", "ASAT"] }, 
    "ALAT": { name: " ALAT", unit: "UI/L,  ", variations: ["ALAT-SGPT", "ALAT"] },
    "Phosphatases alcalines": { name: " PAL", unit: "UI/L,  ", variations: ["Phos.Alcalines", "Phosphatases alcalines", "Phosphatase alcaline", "Phosphatasealcaline"] },
    "Gamma-GT": { name: " GGT", unit: "UI/L", variations: ["Gamma GT", "Gamma-GT", "Gamma Glutamyl Transférase", "GammaGlutamylTransférase"] },
    "TP": { name: "\n- Bilan de coagulation : TP", unit: "%, ", variations: ["Tauxdeprothrombine"] },
    "INR": { name: " INR", unit: ",", variations: ["INR"] },
    "TCA Patient/Témoin":{ name:"TCA ratio", unit: " ", variations: ["Ratiopatient/témoin"]}

};

function findValue(variations, input, unit) {
    for (var i = 0; i < variations.length; i++) {
        var pattern;
        
        if (variations[i] === "INR") {
            // Chercher la valeur de l'INR
            pattern = new RegExp(variations[i] + "\\s*[:\\s]*\\s*(<|>)?\\s*([\\d.,]+)", "i");
            var match = input.match(pattern);
            if (match) {
                // Conserver uniquement les 4 premiers caractères après la virgule
                return { operator: match[1] || "", value: match[2].substring(0, 4), unit: unit };
            }
        } else if (variations[i] === "Polynucléaires neutrophiles" || variations[i] === "Polynucléairesneutrophiles") {
            pattern = new RegExp(variations[i] + "\\s*[:\\s]*\\s*(?:B|H)?\\s*(<|>)?\\s*\\d+(?:,\\d+)?%\\s*(\\d+(?:,\\d+)?)\\s*G/l", "i");
        } else {
            pattern = new RegExp(variations[i] + "\\s*[:\\s]*\\s*(?:B|H)?\\s*(<|>)?\\s*([\\d.,]+)\\s*(" + unit + ")?", "i");
        }

        var match = input.match(pattern);
        if (match) {
            if (variations[i] === "Polynucléaires neutrophiles" || variations[i] === "Polynucléairesneutrophiles") {
                return { operator: match[1] || "", value: match[2].replace(",", "."), unit: "G/l" };
            } else {
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
        if (param === "Hémoglobine" || param === "TCA Patient/Témoin" || param === "ASAT" || param === "ALAT" || param === "Phosphatases alcalines" || param === "Gamma-GT" || param === "TP" || param === "INR" || param === "Sodium" || param === "Potassium" || param === "Urée" || param === "Leucocytes" || param === "Polynucléaires neutrophiles" || param === "Créatinine" ) {
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
        if ( param === "Hémoglobine" || param === "TCA Patient/Témoin" || param === "ASAT" || param === "ALAT" || param === "Phosphatases alcalines" || param === "Gamma-GT" || param === "TP" || param === "INR" || param === "Sodium" || param === "Potassium" || param === "Urée" || param === "Leucocytes"  || param === "Polynucléaires neutrophiles" || param === "Créatinine" ) {
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
    var bilanPhosphocalciqueText = '- Bilan phosphocalcique : ';

    // Définition des paramètres pour le bilan phosphocalcique et leurs noms formatés avec les unités
    var bilanPhosphocalciqueParams = {
        "Calcium": { name: "Calcium", unit: "mmol/L" },
        "Albumine": { name: "Albumine", unit: "g/L" },
        "Ca total corrigé": { name: "Calcémie corrigée (albumine)", unit: "mmol/L" },
        "Phosphore": { name: "Phosphore", unit: "mmol/L" },
        "25-OHVitamineD": { name: "25-OH Vitamine D", unit: "nmol/L" },
        "PTH": { name: "PTH", unit: "ng/L" },
        "TSH": { name: "TSH", unit: "mUI/L" },
    };

    // Construire le texte sans virgule à la fin
    var paramsText = Object.keys(bilanPhosphocalciqueParams).map(param => {
        var variations = [param, bilanPhosphocalciqueParams[param].name];
        var valueObject = findValue(variations, preprocessedText, bilanPhosphocalciqueParams[param].unit);
        
        if (valueObject) {
            var formattedValue = valueObject.operator + " " + valueObject.value + " " + 
                (bilanPhosphocalciqueParams[param].unit === "%" ? "" : bilanPhosphocalciqueParams[param].unit);
            return bilanPhosphocalciqueParams[param].name + " : " + formattedValue.trim();
        } else {
            return bilanPhosphocalciqueParams[param].name + " : _____ " + bilanPhosphocalciqueParams[param].unit;
        }
    }).join(", ");

    bilanPhosphocalciqueText += paramsText;

    // Ajouter la ligne EPS à la fin du bilan, sans virgule finale
    bilanPhosphocalciqueText += "\n- Electrophorèse des protéines sériques : ";

    // Initialisation des variables pour la calcémie et l'albuminémie
    var calcémieMesuréeValue = null;
    var albuminémieValue = null;

    // Parcours des paramètres pour récupérer les valeurs trouvées
    for (var param in bilanPhosphocalciqueParams) {
        if (param === "Calcium" && findValue([param, bilanPhosphocalciqueParams[param].name], preprocessedText, bilanPhosphocalciqueParams[param].unit)) {
            calcémieMesuréeValue = parseFloat(findValue([param, bilanPhosphocalciqueParams[param].name], preprocessedText, bilanPhosphocalciqueParams[param].unit).value.replace(",", "."));
        }
    }

    // Modification pour chercher l'albuminémie dans le bilan nutritionnel
    for (var param in bilanPhosphocalciqueParams) {
        if (param === "Albumine" && findValue([param, bilanPhosphocalciqueParams[param].name], preprocessedText, bilanPhosphocalciqueParams[param].unit)) {
            albuminémieValue = parseFloat(findValue([param, bilanPhosphocalciqueParams[param].name], preprocessedText, bilanPhosphocalciqueParams[param].unit).value.replace(",", "."));
        }
    }

    // Calcul de la calcémie corrigée
    if (calcémieMesuréeValue !== null && albuminémieValue !== null) {
        var calcémieCorrigée = calcémieMesuréeValue + 0.025 * (40 - albuminémieValue);
        // Remplacer la ligne existante de calcémie corrigée
        bilanPhosphocalciqueText = bilanPhosphocalciqueText.replace(
            /Calcémie corrigée \(albumine\) : _____ mmol\/L/,
            `Calcémie corrigée (albumine) : ${calcémieCorrigée.toFixed(2)} mmol/L`
        );
    } else {
        // Garder la ligne avec des underscores si une des valeurs manque
        bilanPhosphocalciqueText += "Calcémie corrigée (albumine) : _____ mmol/L";
    }

    // Afficher le texte formaté du bilan phosphocalcique dans la zone de sortie correspondante
    document.getElementById("bilanPhosphocalciqueText").value = bilanPhosphocalciqueText.trim();



    // Définition des paramètres pour le bilan auto-immun
    var bilanAutoImmunParams = {
        "Rhumatoides": { name: "Facteurs Rhumatoides", unit: "" },
        "AntiPeptidesCycliquesCitrullinés": { name: "Anticorps Anti-CPP", unit: "" },
        "AntiNucléaires(cellules HEp2)": { name: "Anticorps Anti Nucléaires (cellules HEp2)", unit: "" },
        "ANCA": { name: "ANCAs", unit: "" },
    };

    // Fonction pour formater le bilan auto-immun avec des virgules
    function formatBilanAutoImmun(inputText) {
        var formattedBilanAutoImmun = '- Bilan auto-immun : ';
        for (var param in bilanAutoImmunParams) {
            var pattern = new RegExp(param + "\\s*[:\\s]*\\s*([\\w\\s]+)", "i");
            var match = inputText.match(pattern);
            if (match) {
                var value = match[1].trim();
                if (!/^\d+(\.\d+)?$/.test(value)) {
                    value = " ";
                }
                formattedBilanAutoImmun += bilanAutoImmunParams[param].name + " : " + value + " " + bilanAutoImmunParams[param].unit + ", ";
            } else {
                formattedBilanAutoImmun += bilanAutoImmunParams[param].name + " :     " + bilanAutoImmunParams[param].unit + ", ";
            }
        }
        // Supprimer la dernière virgule
        return formattedBilanAutoImmun.slice(0, -2);
    }

    // Appel de la fonction pour formater le bilan auto-immun et stocker le texte formaté dans la variable correspondante
    var bilanAutoImmunText = formatBilanAutoImmun(preprocessedText);

    // Afficher le texte formaté du bilan auto-immun dans la zone de sortie correspondante
    var bilanAutoImmunTextarea = document.getElementById("bilanAutoImmunText");
    bilanAutoImmunTextarea.value = bilanAutoImmunText.trim();

    // Créer une chaîne pour stocker le texte formaté du bilan nutritionnel
    var bilannutritionnelText = '- Bilan nutritionnel : ';

    // Définition des paramètres pour le bilan nutritionnel et leurs noms formatés avec les unités
    var bilannutritionnelParams = {
        "Albumine": { name: "Albumine", unit: "g/L" },
        "Préalbumine": { name: "Préalbumine", unit: "g/L" },

    };


    // Remplacer les valeurs dans le texte formaté du bilan nutritionnel et les placer à leurs positions respectives
    for (var param in bilannutritionnelParams) {
        var variations = [param, bilannutritionnelParams[param].name];
        var valueObject = findValue(variations, preprocessedText, bilannutritionnelParams[param].unit);
        if (valueObject) {
            var formattedValue = valueObject.operator + " " + valueObject.value + " " + (bilannutritionnelParams[param].unit === "%" ? "" : bilannutritionnelParams[param].unit);
            bilannutritionnelText += bilannutritionnelParams[param].name + " : " + formattedValue.trim() + ", ";
        } else {
            bilannutritionnelText += bilannutritionnelParams[param].name + " : _____ " + bilannutritionnelParams[param].unit + ", ";
        }
    }

    // Supprimer la dernière virgule
    bilannutritionnelText = bilannutritionnelText.slice(0, -2);

    // Afficher le texte formaté du bilan nutritionnel dans la zone de sortie correspondante
    document.getElementById("bilannutritionnelText").value = bilannutritionnelText.trim();

    // Afficher l'acide urique si la case est cochée dans la zone de sortie correspondante
    var acideUriqueMatch = inputText.match(/Acide urique\s*#\s*(\d+)\s*µmol\/l/);
    if (acideUriqueMatch) {
        var acideUriqueValue = acideUriqueMatch[1];
        document.getElementById("acideUriqueText").value = acideUriqueValue + " µmol/l";
    }


    // Afficher l'acide urique si la case est cochée dans la zone de sortie correspondante
    document.getElementById("generateFinalTextButton").addEventListener("click", function() {
        var selectedTexts = [];

        $(".sortable .draggable-checkbox-container").each(function() {
            var checkbox = $(this).find("input[type='checkbox']");
            var textareaId = checkbox.attr("id").replace("Checkbox", "Text");

            if (checkbox.is(":checked")) {
                if (checkbox.attr("id") === "acideUriqueCheckbox") {
                    // Rechercher la valeur de l'acide urique dans le texte d'entrée
                    var inputText = document.getElementById("inputText").value;
                    var acideUriqueMatch = inputText.match(/Acide urique\s*#\s*(\d+)\s*µmol\/l/);
                    if (acideUriqueMatch) {
                        var acideUriqueValue = acideUriqueMatch[1];
                        selectedTexts.push("- Acide urique : " + acideUriqueValue + " µmol/l")
                    }
                } else {
                    selectedTexts.push(document.getElementById(textareaId).value);
                }
            }
        });

        var finalText = selectedTexts.join("\n");
        document.getElementById("finalText").value = finalText;
    });

    

    // Appliquer la fonction de suppression des sauts de ligne sur chaque section
    bioDeBaseText = removeExtraNewlines(bioDeBaseText.trim());
    bilanPhosphocalciqueText = removeExtraNewlines(bilanPhosphocalciqueText.trim());
    bilanAutoImmunText = removeExtraNewlines(bilanAutoImmunText.trim());
    bilannutritionnelText = removeExtraNewlines(bilannutritionnelText.trim());

    // Combiner les sections en ajoutant deux sauts de ligne entre elles
    var finalText = bioDeBaseText + '\n' + bilanPhosphocalciqueText + '\n' + bilanAutoImmunText + '\n' + bilannutritionnelText;

    // Appliquer removeExtraNewlines au texte final pour s'assurer qu'il n'y ait pas plus de deux sauts de ligne consécutifs
    document.getElementById("finalText").value = removeExtraNewlines(finalText.trim());

  });
  