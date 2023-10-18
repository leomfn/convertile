document.addEventListener('DOMContentLoaded', () => {
    const utmLonField = document.getElementById('utmInputLon');
    const utmLatField = document.getElementById('utmInputLat');
    const mvtXField = document.getElementById('mvtInputX');
    const mvtYField = document.getElementById('mvtInputY');
    const mvtZoomField = document.getElementById('mvtInputZoom');

    const convertToUTMButton = document.getElementById('convertToUTMButton');
    const convertToMVTButton = document.getElementById('convertToMVTButton');

    const convertToUTM = () => {
        console.log('converting to UTM');
        const mvtZoom = parseInt(mvtZoomField.value);
        const mvtX = parseInt(mvtXField.value);
        const mvtY = parseInt(mvtYField.value);

        const lonDeg = tile2long(mvtX, mvtZoom);
        const latDeg = tile2lat(mvtY, mvtZoom);

        utmLonField.value = lonDeg;
        utmLatField.value = latDeg;

    }

    const convertToMVT = () => {
        console.log('converting to MVT');
        const utmLon = parseFloat(utmLonField.value);
        const utmLat = parseFloat(utmLatField.value);
        const mvtZoom = parseInt(mvtZoomField.value);

        const tileX = lon2tile(utmLon, mvtZoom);
        const tileY = lat2tile(utmLat, mvtZoom);

        mvtXField.value = tileX;
        mvtYField.value = tileY;
    }

    convertToUTMButton.addEventListener('click', convertToUTM);
    convertToMVTButton.addEventListener('click', convertToMVT);
});

// From https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
const lon2tile = (lon, zoom) => {
    return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

const lat2tile = (lat, zoom) => {
    return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}

const tile2long = (x, z) => {
    return ((x + 0.5) / Math.pow(2, z) * 360 - 180);
}

const tile2lat = (y, z) => {
    const n = Math.PI - 2 * Math.PI * (y + 0.5) / Math.pow(2, z);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}