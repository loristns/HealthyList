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
    console.log(json);

    return json.products.map((product) => convertToItem(product))
}

async function searchProductByBarcode(barcode) {
    const request = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    const json = await request.json();

    if (json.product == null) {
        return undefined;
    }

    return convertToItem(json.product);
}

function computeScore(items) {
    const nutriscores = items
        .filter((item) => item.openfoodfacts.nutriscore_grade != null)
        .map((item) => 'edcba'.indexOf(item.openfoodfacts.nutriscore_grade) * 2);

    return Math.round(nutriscores.reduce((a, b) => a + b, 0) / (nutriscores.length + 1));
}

// todo : getAdvice(items)
