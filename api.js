/*
{
    rayée: boolean,
    nom?: string,
    quantité?: number,
    openfoodfacts: {}
}


*/

function convertToItem(openfoodfacts) {
    return {
        name: openfoodfacts.product_name,
        quantity: openfoodfacts.quantity,
        checked: false, 
        openfoodfacts
    }
}

async function searchProductsByName(query) {
    const request = await fetch(`https://fr.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`)
    const json = await request.json();

    return json.products.map((product) => convertToItem(product))
}

async function searchProductByBarcode(barcode) {
    const request = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    Quagga.stop();
    const json = await request.json();


    if (json.product == null) {
        Quagga.start();
        return undefined;
    }

    return convertToItem(json.product);
}

function computeNutriScore(items) {
    const nutriscores = items
        .filter((item) => item.openfoodfacts.nutriscore_grade != null)
        .map((item) => ('edcba'.indexOf(item.openfoodfacts.nutriscore_grade) + 1) * 2);

    if (nutriscores.length === 0) {
        return 0;
    }

    return Math.round(nutriscores.reduce((a, b) => a + b, 0) / nutriscores.length);
}

function computeNovaScore(items) {
    const novascores = items
        .filter((item) => item.openfoodfacts.nova_groups != null)
        .map((item) => 10 - (parseInt(item.openfoodfacts.nova_groups) * 2.5));

    if (novascores.length == 0) {
        return 10;
    }

    return Math.round(novascores.reduce((a, b) => a + b, 0) / (novascores.length + 1));
}

function computeEcoScore(items) {
    const ecoscores = items
        .filter((item) => item.openfoodfacts.ecoscore_score != null)
        .map((item) => item.openfoodfacts.ecoscore_score / 10);

    return Math.round(ecoscores.reduce((a, b) => a + b, 0) / (ecoscores.length + 1));
}

function computeAverageAdditives(items) {
    const additives = items
        .filter((item) => item.openfoodfacts.additives_n != null)
        .map((item) => item.openfoodfacts.additives_n);

    return Math.round(additives.reduce((a, b) => a + b, 0) / (additives.length + 1));
}

function computeScore(items) {
    const nutriscore = computeNutriScore(items);
    const novascore = computeNovaScore(items);
    const additives = Math.max(20 - computeAverageAdditives(items), 0) / 2;

    if (items.length == 0) {
        return 0;
    }

    return Math.round(nutriscore * 0.8 + novascore * 0.1 + additives * 0.1);
}

function computeIndividualScore(item) {
    return computeScore([item]);
}

function getAdvice(items) {
    const nutriscore = computeNutriScore(items);
    const novascore = computeNovaScore(items);
    const ecoscore = computeEcoScore(items);
    const additives = computeAverageAdditives(items);

    if (items.length === 0) {
        return '';
    } else if (nutriscore < 5) {
        return "Réduisez votre consommation d'aliments à forte teneur en sucre, graisses saturées ou en sel.";
    } else if (novascore < 4) {
        return "Privilégiez des produits minimalement transformés.";
    } else if (ecoscore < 5) {
        return "Préférez des produits à l'impact environnemental plus faible.";
    } else {
        return `En moyenne, chaque produit de votre liste contient ${additives} additifs.`;
    }
}
