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
  
    // Créer une chaîne pour stocker le texte formaté de la bio de base
    var bioDeBaseText = 'Biologie:\n';
  
    // Définition des paramètres de la bio de base et leurs noms formatés avec les unités
var bioDeBaseParams = {
    "CRP": { name: "CRP", unit: "mg/L, ", variations: ["CRP"] },
    "Leucocytes": { name: "Leucocytes", unit: "G/L", variations: ["Leucocytes"] },
    "Polynucléaires neutrophiles calc": { name: "PNNs", unit: "G/L", variations: ["Poly neutro calc"] },
    "Hémoglobine": { name: "Hémoglobine", unit: "g/L", variations: ["Hémoglobine"] },
    "Sodium": { name: "Na", unit: "mmol/L", variations: ["Sodium"] },
    "Potassium": { name: "K", unit: "mmol/L", variations: ["Potassium"] },
    "Urée": { name: "Urée", unit: "mmol/L", variations: ["Urée"] },
    "Créatinine": { name: "Créatinine", unit: "µmol/L", variations: ["Créatinine"] },
    "ASAT": { name: "ASAT", unit: "UI/L,  ", variations: ["ASAT-SGOT", "ASAT"] }, 
    "ALAT": { name: "ALAT", unit: "UI/L,  ", variations: ["ALAT-SGPT", "ALAT"] },
    "Phosphatases alcalines": { name: "PAL", unit: "UI/L,  ", variations: ["Phos.Alcalines", "Phosphatases alcalines"] },
    "Gamma-GT": { name: "GGT", unit: "UI/L,  ", variations: ["Gamma GT", "Gamma-GT"] },
    "Bilirubine totale": { name: "Bilirubine totale", unit: "mg/dL", variations: ["Bilirubine totale"] },
    "TP": { name: "TP", unit: "%, ", variations: ["TP"] },
    "INR": { name: "INR", unit: ", ", variations: ["INR"] },
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
        if (param === "ASAT" || param === "ALAT" || param === "Phosphatases alcalines" || param === "Gamma-GT" || param === "TP" || param === "INR" || param === "Sodium" || param === "Potassium" || param === "Urée" || param === "Leucocytes" || param === "CRP" ) {
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
        if (param === "ASAT" || param === "ALAT" || param === "Phosphatases alcalines" || param === "Gamma-GT" || param === "TP" || param === "INR" || param === "Sodium" || param === "Potassium" || param === "Urée" || param === "Leucocytes" || param === "CRP" ) {
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

    // Créer une chaîne pour stocker le texte formaté du bilan d'anémie
    var bilanAnemieText = 'Bilan d\'anémie:\n';

    // Définition des paramètres pour le bilan d'anémie et leurs noms formatés avec les unités
    var bilanAnemieParams = {
        "Hémoglobine": { name: "Hémoglobine", unit: "g/L" },
        "VGM": { name: "VGM", unit: "fL" },
        "Réticulocytes": { name: "Réticulocytes", unit: "" },
        "Ferritine": { name: "Ferritine", unit: "ng/mL" },
        "CST": { name: "CST", unit: "%" },
        "B9": { name: "B9", unit: "ng/mL" },
        "B12": { name: "B12", unit: "pg/mL" },
        "TSH": { name: "TSH", unit: "µUI/mL" }
    };

    // Fonction pour rechercher les valeurs du bilan d'anémie et les formater
    function formatBilanAnemie(inputText) {
        var formattedBilanAnemie = '';
        for (var param in bilanAnemieParams) {
            var pattern = new RegExp(param + "\\s*[:\\s]*\\s*([\\d.]+)\\s*(" + bilanAnemieParams[param].unit + ")?", "i");
            var match = inputText.match(pattern);
            if (match) {
                var value = match[1].replace(",", ".");
                var unit = match[2] || bilanAnemieParams[param].unit;
                formattedBilanAnemie += bilanAnemieParams[param].name + " : " + value + " " + unit + ";\n";
            } else {
                formattedBilanAnemie += bilanAnemieParams[param].name + " : _____ " + bilanAnemieParams[param].unit + ";\n";
            }
        }
        return formattedBilanAnemie;
    }

    // Appel de la fonction pour formater le bilan d'anémie et stocker le texte formaté dans la variable correspondante
    bilanAnemieText += formatBilanAnemie(preprocessedText);

    // Afficher le texte formaté du bilan d'anémie dans la zone de sortie correspondante
    document.getElementById("bilanAnemieText").value = bilanAnemieText.trim();

    // Créer une chaîne pour stocker le texte formaté du bilan phosphocalcique
    var bilanPhosphocalciqueText = 'Bilan phosphocalcique:\n';

    // Définition des paramètres pour le bilan phosphocalcique et leurs noms formatés avec les unités
    var bilanPhosphocalciqueParams = {
        "Ca total corrigé": { name: "calcémie corrigée (albumine)", unit: "mmol/L" },
        "Phosphore": { name: "phosphore", unit: "mmol/L" },
        "Vit 25 OH D2 et D3": { name: "vitamine D", unit: "ng/mL" },
        "PTH INTACT": { name: "PTH", unit: "ng/L" },
        "TSH US": { name: "TSH", unit: "mUI/mL" },
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

    // Créer une chaîne pour stocker le texte formaté du bilan d'ostéoporose
    var bilanOsteoporoseText = 'Bilan d\'ostéoporose:\n';

    // Définition des paramètres pour le bilan d'ostéoporose et leurs noms formatés avec les unités
    var bilanOsteoporoseParams = {
        "Ca total corrigé": { name: "calcémie corrigée (albumine)", unit: "mmol/L" },
        "Phosphore": { name: "phosphore", unit: "mmol/L" },
        "Vit 25 OH D2 et D3": { name: "vitamine D", unit: "ng/mL" },
        "PTH INTACT": { name: "PTH", unit: "ng/L" },
        "TSH US": { name: "TSH", unit: "mUI/mL" },
    };

    var additionalText = `
    Bilan hépatique : 
    Elécrophorèse des protéines sériques : 
    + testostéronémie totale si homme +/- LH, FSH si anormale
    + ferritinémie si suspicion hémochromatose ou bilan hépatique anormal
    + prolactine ou cortisol libre urinaire si suspicion endocrinopathie
    + anticorps anti transglutaminase si suspicion maladie coeliaque
    + tryptase sérique (mastocytose) 

    Une ostéodensitométrie a été réalisée le // retrouvant un T-score au niveau du rachis à - , un T-score au niveau du col à - et au niveau du fémur à - .

    Calcul du FRAX dans le contexte de T-score >-2.5, sans fracture majeure, qui retrouve un risque de fracture majeur à 10 ans de x % (seuil d’intervention à x %). Il y a / n’y a donc pas d’indication à mettre en place un traitement à visée anti-ostéoporotique. / Il y a donc une indication à mettre en place un traitement à visée anti-ostéoporotique`;

    // Fonction pour formater le bilan d'ostéoporose
    function formatBilanOsteoporose(inputText) {
        var formattedBilanOsteoporose = 'Dans ce contexte de fracture sur chute à faible cinétique, une recherche d’ostéopathie fragilisante a été réalisée :\n';
        for (var param in bilanOsteoporoseParams) {
            var variations = [param, bilanOsteoporoseParams[param].name];
            var valueObject = findValue(variations, inputText, bilanOsteoporoseParams[param].unit);
            if (valueObject) {
                var formattedValue = valueObject.operator + " " + valueObject.value + " " + (bilanOsteoporoseParams[param].unit === "%" ? "" : bilanOsteoporoseParams[param].unit);
                formattedBilanOsteoporose += bilanOsteoporoseParams[param].name + " : " + formattedValue.trim() + "\n";
            } else {
                formattedBilanOsteoporose += bilanOsteoporoseParams[param].name + " : _____ " + bilanOsteoporoseParams[param].unit + "\n";
            }
        }
        // Ajouter le texte supplémentaire au format final
        formattedBilanOsteoporose += additionalText;
        return formattedBilanOsteoporose;
    }

    // Appel de la fonction pour formater le bilan d'ostéoporose et stocker le texte formaté dans la variable correspondante
    bilanOsteoporoseText += formatBilanOsteoporose(preprocessedText);

    // Afficher le texte formaté du bilan d'ostéoporose dans la zone de sortie correspondante
    document.getElementById("bilanOsteoporoseText").value = bilanOsteoporoseText.trim();


    // Définition des paramètres pour le bilan auto-immun
    var bilanAutoImmunParams = {
        "ACPA / Anti-CPP": { name: "ACPA / Anti-CPP", unit: "" },
        "Anticorps anti-nucléaires": { name: "Anticorps anti-nucléaires", unit: "" },
        "Anticorps anti ADN natifs": { name: "Anticorps anti ADN natifs", unit: "" },
        "Anticorps anti-Sm": { name: "Anticorps anti-Sm", unit: "" },
        "Anticorps anti-RNP": { name: "Anticorps anti-RNP", unit: "" },
        "Anticorps anti-SSA": { name: "Anticorps anti-SSA", unit: "" },
        "Anticorps anti-SSB": { name: "Anticorps anti-SSB", unit: "" },
        "Anticorps anti-Scl-70": { name: "Anticorps anti-Scl-70", unit: "" }
    };

    // Fonction pour formater le bilan auto-immun
    function formatBilanAutoImmun(inputText) {
        var formattedBilanAutoImmun = 'Bilan auto-immun:\n';
        for (var param in bilanAutoImmunParams) {
            var pattern = new RegExp(param + "\\s*[:\\s]*\\s*([\\w\\s]+)", "i");
            var match = inputText.match(pattern);
            if (match) {
                var value = match[1];
                formattedBilanAutoImmun += bilanAutoImmunParams[param].name + " : " + value + " " + bilanAutoImmunParams[param].unit + ";\n";
            } else {
                formattedBilanAutoImmun += bilanAutoImmunParams[param].name + " : _____ " + bilanAutoImmunParams[param].unit + ";\n";
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
    var bilannutritionnelText = 'Bilan nutritionnel:\n';

    // Définition des paramètres pour le bilan nutritionnel et leurs noms formatés avec les unités
    var bilannutritionnelParams = {
        "Albumine": { name: "Albumine", unit: "g/L" },
        "Pré-albumine": { name: "Pré-albumine", unit: "g/L" },
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

    // Créer une chaîne pour stocker le texte formaté du bilan de myelome
    var bilanmyelomeText = '';

    // Définition des paramètres pour le bilan myelome et leurs noms formatés avec les unités
    var bilanmyelomeParams = {
        "EPS": { name: "Electrophorèse des protéines sériques", unit: "" },
    };


    // Remplacer les valeurs dans le texte formaté du bilan myelome et les placer à leurs positions respectives
    for (var param in bilanmyelomeParams) {
        var variations = [param, bilanmyelomeParams[param].name];
        var valueObject = findValue(variations, preprocessedText, bilanmyelomeParams[param].unit);
        if (valueObject) {
            var formattedValue = valueObject.operator + " " + valueObject.value + " " + (bilanmyelomeParams[param].unit === "%" ? "" : bilanmyelomeParams[param].unit);
            bilanmyelomeText += bilanmyelomeParams[param].name + " : " + formattedValue.trim() + "\n";
        } else {
            bilanmyelomeText += bilanmyelomeParams[param].name + " : _____ " + bilanmyelomeParams[param].unit + "\n";
        }
    }

    // Afficher le texte formaté du bilan myelome dans la zone de sortie correspondante
    document.getElementById("bilanmyelomeText").value = bilanmyelomeText.trim();

    // Créer une chaîne pour stocker le texte formaté des sérologies
    var serologiesText = 'Sérologies:\n';

    
    // Définition des paramètres pour les sérologies et leurs noms formatés avec les unités
    var serologiesParams = {
        "VHB": { name: "VHB", unit: "" },
        "VHC": { name: "VHC", unit: "" },
        "VIH": { name: "VIH", unit: "" },
        "EBV": { name: "EBV", unit: "" },
        "CMV": { name: "CMV", unit: "" },
        "VZV": { name: "VZV", unit: "" },
        
    };


    // Remplacer les valeurs dans le texte formaté des sérologies  et les placer à leurs positions respectives
    for (var param in serologiesParams) {
        var variations = [param, serologiesParams[param].name];
        var valueObject = findValue(variations, preprocessedText, serologiesParams[param].unit);
        if (valueObject) {
            var formattedValue = valueObject.operator + " " + valueObject.value + " " + (serologiesParams[param].unit === "%" ? "" : serologiesParams[param].unit);
            serologiesText += serologiesParams[param].name + " : " + formattedValue.trim() + "\n";
        } else {
            serologiesText += serologiesParams[param].name + " : _____ " + serologiesParams[param].unit + "\n";
        }
    }

    // Afficher le texte formaté des sérologies  dans la zone de sortie correspondante
    document.getElementById("serologiesText").value = serologiesText.trim();

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
    
        // Copier le texte final dans le presse-papiers
        navigator.clipboard.writeText(finalText)
    });
    
    document.getElementById("formatButton").addEventListener("click", function() {
        // Votre code de formatage précédent
    }); 
  });
  