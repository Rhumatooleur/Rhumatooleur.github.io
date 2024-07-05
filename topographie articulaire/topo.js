document.addEventListener('DOMContentLoaded', () => {
    const image = document.getElementById('imageArticulations');
    const canvas = document.getElementById('canvasOverlay');
    const ctx = canvas.getContext('2d');
    const articulationNom = document.getElementById('articulationNom');

    const articulations = [
        { name: 'Épaule droite', x: 187, y: 156 },
        { name: 'Coude droit', x: 176, y: 223 },
        { name: 'Poignet droit', x: 159, y: 291 },
        { name: 'Articulation trapézo métacarpienne droite', x: 169 , y: 320 },
        { name: 'MTcP1 droite', x: 176, y: 344 },
        { name: 'MTcP2 droite', x: 158, y: 350 },
        { name: 'MTcP3 droite', x: 139, y: 346 },
        { name: 'MTcP4 droite', x: 123, y: 339 },
        { name: 'MTcP5 droite', x: 111, y: 323 },
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
        { name: 'MTtP1 droite', x: 237, y: 668 },
        { name: 'MTtP2 droite', x: 220, y: 662 },
        { name: 'MTtP3 droite', x: 207, y: 650 },
        { name: 'MTtP4 droite', x: 192, y: 637 },
        { name: 'MTtP5 droite', x: 178, y: 627 },
        { name: 'IP de l hallux droit', x: 231, y: 693 },
        { name: 'IPP2 du pied droit', x: 214, y: 681 },
        { name: 'IPP3 du pied droit', x: 200, y: 675 },
        { name: 'IPP4 du pied droit', x: 188, y: 664 },
        { name: 'IPP5 du pied droit', x: 176, y: 649 },
        { name: 'Épaule gauche', x: 303, y: 156 },
        { name: 'Coude gauche', x: 322, y: 223 },
        { name: 'Poignet gauche', x: 337, y: 291 },
        { name: 'Articulation trapézo métacarpienne gauche', x: 325 , y: 320 },
        { name: 'MTcP1 gauche', x: 320, y: 344 },
        { name: 'MTcP2 gauche', x: 337, y: 350 },
        { name: 'MTcP3 gauche', x: 356, y: 346 },
        { name: 'MTcP4 gauche', x: 372, y: 339 },
        { name: 'MTcP5 gauche', x: 383, y: 323 },
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
        { name: 'MTtP1 gauche', x: 259, y: 668 },
        { name: 'MTtP2 gauche', x: 275, y: 662 },
        { name: 'MTtP3 gauche', x: 290, y: 650 },
        { name: 'MTtP4 gauche', x: 302, y: 637 },
        { name: 'MTtP5 gauche', x: 316, y: 627 },
        { name: 'IP de l hallux gauche', x: 263, y: 693 },
        { name: 'IPP2 du pied gauche', x: 279, y: 681 },
        { name: 'IPP3 du pied gauche', x: 296, y: 675 },
        { name: 'IPP4 du pied gauche', x: 309, y: 664 },
        { name: 'IPP5 du pied gauche', x: 317, y: 649 },
        // Ajouter plus d'articulations avec leurs coordonnées X et Y
    ];

    let selectedArticulations = [];

    function resizeCanvas() {
        const rect = image.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        redrawCircles();
    }

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) * (image.naturalWidth / rect.width),
            y: (evt.clientY - rect.top) * (image.naturalHeight / rect.height)
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

    image.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('click', (evt) => {
        const mousePos = getMousePos(canvas, evt);
        const closestArticulation = findClosestArticulation(mousePos.x, mousePos.y);

        if (closestArticulation) {
            selectedArticulations.push(closestArticulation);
            redrawCircles();
            const names = selectedArticulations.map(art => art.name).join(', ');
            articulationNom.textContent = names;
        }
    });

    resizeCanvas();
});
