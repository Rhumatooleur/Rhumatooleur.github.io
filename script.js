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
    var bioDeBaseText = 'Bio de base:\n';
  
    // Définition des paramètres de la bio de base et leurs noms formatés avec les unités
    var bioDeBaseParams = {
        "Hémoglobine": { name: "Hémoglobine", unit: "g/L", variations: ["Hémoglobine"] },
        "Leucocytes": { name: "Leucocytes", unit: "G/L", variations: ["Leucocytes"] },
        "Polynucléaires neutrophiles calc": { name: "PNNs", unit: "G/L", variations: ["Poly neutro calc"] },
        "CRP": { name: "CRP", unit: "mg/L", variations: ["CRP"] },
        "Sodium": { name: "Na⁺", unit: "mmol/L", variations: ["Sodium"] },
        "Potassium": { name: "K⁺", unit: "mmol/L", variations: ["Potassium"] },
        "Urée": { name: "Urée", unit: "mmol/L", variations: ["Urée"] },
        "Créatinine": { name: "Créatinine", unit: "µmol/L", variations: ["Créatinine"] },
        "Bilirubine totale": { name: "Bilirubine totale", unit: "mg/dL", variations: ["Bilirubine totale"] },
        "ASAT": { name: "ASAT", unit: "UI/L", variations: ["ASAT-SGOT", "ASAT"] },
        "ALAT": { name: "ALAT", unit: "UI/L", variations: ["ALAT-SGPT", "ALAT"] },
        "Phosphatases alcalines": { name: "PAL", unit: "UI/L", variations: ["Phos.Alcalines", "Phosphatases alcalines"] },
        "Gamma-GT": { name: "GGT", unit: "UI/L", variations: ["Gamma GT", "Gamma-GT"] },
        "TP": { name: "TP", unit: "%", variations: ["TP"] },
        "INR": { name: "INR", unit: "", variations: ["INR"] },
        "TCA": { name: "TCA", unit: "sec", variations: ["TCA"] }
    };
  
    // Fonction pour rechercher les variations d'un paramètre et extraire la valeur et l'unité
    function findValue(variations, input, unit) {
        for (var i = 0; i < variations.length; i++) {
            var pattern = new RegExp(variations[i] + "\\s*[:\\s]*\\s*(?:B|H)?\\s*(<|>)?\\s*([\\d.,]+)\\s*(" + unit + ")?", "i");
            var match = input.match(pattern);
            if (match) {
                return { value: match[2].replace(",", "."), unit: match[3] || unit };
            }
        }
        return null;
    }
  
    // Remplacer les valeurs dans le texte formaté de la bio de base et les placer à leurs positions respectives
    for (var param in bioDeBaseParams) {
        var valueObject = findValue(bioDeBaseParams[param].variations, preprocessedText, bioDeBaseParams[param].unit);
        if (valueObject) {
            var formattedValue = valueObject.value + " " + (bioDeBaseParams[param].unit === "%" ? "" : bioDeBaseParams[param].unit); // Ajout d'une condition pour exclure l'unité % de la sortie
            bioDeBaseText += bioDeBaseParams[param].name + " : " + formattedValue + "\n";
        } else {
            bioDeBaseText += bioDeBaseParams[param].name + " : _____ " + bioDeBaseParams[param].unit + "\n";
        }
    }
  
    // Ajouter des sauts de ligne à des endroits spécifiques dans bioDeBaseText
    bioDeBaseText = bioDeBaseText.replace(/(CRP .+\n)/, '$1\n');  // Ajouter un saut de ligne après CRP
    bioDeBaseText = bioDeBaseText.replace(/(GGT .+\n)/, '$1\n');  // Ajouter un saut de ligne après GGT
    bioDeBaseText = bioDeBaseText.replace(/(Créatinine .+\n)/, '$1\n');
  
    // Afficher le texte formaté de la bio de base dans la zone de sortie correspondante
    document.getElementById("bioDeBaseText").value = bioDeBaseText;
    // Créer une chaîne pour stocker le texte formaté du bilan d'anémie
    var bilanAnemieText = 'Bilan d\'anémie:\n';
    
    // Définition des paramètres pour le bilan d'anémie et leurs noms formatés avec les unités
    var bilanAnemieParams = {
        "Hémoglobine": { name: "Hémoglobine", unit: "g/L" },
        "VGM": { name: "VGM", unit: "fL" },
        "Réticulocytes": { name: "Réticulocytes", unit: "millions/mm³" },
        "Ferritine": { name: "Ferritine", unit:"Ferritine", unit: "ng/mL" },
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

    // Créer une chaîne pour stocker le texte formaté du bilan d'ostéoporose
    var bilanOsteoporoseText = 'Bilan d\'ostéoporose:\n';

    // Définition des paramètres pour le bilan d'ostéoporose et leurs noms formatés avec les unités
    var bilanOsteoporoseParams = {
        "calcémie corrigée (albumine)": { name: "calcémie corrigée (albumine)", unit: "mmol/L" },
        "phosphore": { name: "phosphore", unit: "mmol/L" },
        "vitamine D": { name: "vitamine D", unit: "ng/mL" },
        "PTH": { name: "PTH", unit: "pg/mL" },
        "TSH": { name: "TSH", unit: "µUI/mL" },
    };

    var additionalText = `
    Bilan hépatique : 
    Elécrophorèse des protéines sériques : 
    + testostéronémie totale si homme +/- LH, FSH si anormale
    + ferritinémie si suspicion hémochromatose ou bilan hépatique anormal
    + prolactine ou cortisol libre urinaire si suspicion endocrinopathie
    + anticorps anti transglutaminase si suspicion maladie coeliaque
    + tryptase sérique (mastocytose) 

    Dans ce contexte de fracture sur une chute de sa hauteur, une recherche d’ostéopathie fragilisante a été réalisée.
    Le bilan retrouve : TSH à mUI/L, phosphore à mmol/l et calcium à mmol/L, la PTH à ng/l, vitamine D à nmol/l. L’électrophorèse des protéines sériques retrouve : Phosphatases alcalines à UI/l..
    Une ostéodensitométrie a été réalisée le // retrouvant un T-score au niveau du rachis à -, un T-score au niveau du col à - et au niveau du fémur à -.

    Calcul du FRAX dans le contexte de T-score >-2.5, sans fracture majeure, qui retrouve un risque de fracture majeur à 10 ans de x % (seuil d’intervention à x %). Il y a / n’y a donc pas d’indication à mettre en place un traitement à visée anti-ostéoporotique.`;

    // Fonction pour formater le bilan d'ostéoporose
    function formatBilanOsteoporose(inputText) {
        var formattedBilanOsteoporose = 'Bilan d\'ostéoporose:\n';
        for (var param in bilanOsteoporoseParams) {
            var pattern = new RegExp(param + "\\s*[:\\s]*\\s*([\\d.,]+)\\s*(" + bilanOsteoporoseParams[param].unit + ")?", "i");
            var match = inputText.match(pattern);
            if (match) {
                var value = match[1].replace(",", ".");
                var unit = match[2] || bilanOsteoporoseParams[param].unit;
                formattedBilanOsteoporose += bilanOsteoporoseParams[param].name + " : " + value + " " + unit + ";\n";
            } else {
                formattedBilanOsteoporose += bilanOsteoporoseParams[param].name + " : _____ " + bilanOsteoporoseParams[param].unit + ";\n";
            }
        }
        // Ajoutez le texte supplémentaire au format final
        formattedBilanOsteoporose += additionalText;
        return formattedBilanOsteoporose;
    }

    // Appel de la fonction pour formater le bilan d'ostéoporose
    var bilanOsteoporoseText = formatBilanOsteoporose(preprocessedText);

    // Afficher le texte formaté du bilan d'ostéoporose dans la zone de sortie correspondante
    var bilanOsteoporoseTextarea = document.getElementById("bilanOsteoporoseText");
    bilanOsteoporoseTextarea.value = bilanOsteoporoseText.trim();

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
            .then(() => {
                alert("Le texte final a été copié dans le presse-papiers avec succès !");
            })
            .catch(err => {
                console.error('Erreur lors de la copie du texte : ', err);
                alert("Une erreur s'est produite lors de la copie du texte dans le presse-papiers.");
            });
    });
    
    document.getElementById("formatButton").addEventListener("click", function() {
        // Votre code de formatage précédent
    }); 
  });
  