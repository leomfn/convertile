const wgsLonField = document.getElementById('wgsInputLon');
const wgsLatField = document.getElementById('wgsInputLat');
const mvtXField = document.getElementById('mvtInputX');
const mvtYField = document.getElementById('mvtInputY');
const mvtZoomField = document.getElementById('mvtInputZoom');

const convertToWGSButton = document.getElementById('convertToWGSButton');
const convertToMVTButton = document.getElementById('convertToMVTButton');

const wgsHint = document.getElementById('wgsHint');
const mvtHint = document.getElementById('mvtHint');

const convertToWGS = () => {
    const mvtZoom = parseInt(mvtZoomField.value);
    const mvtX = parseInt(mvtXField.value);
    const mvtY = parseInt(mvtYField.value);

    const lonDeg = tile2long(mvtX, mvtZoom);
    const latDeg = tile2lat(mvtY, mvtZoom);

    clearWGSError();
    const isValidEntry = mvtErrorCheck();

    // TODO: Properly implement X and Y range validation depending on zoom
    const isValidResult = -180 <= lonDeg && lonDeg <= 180 && -90 <= latDeg && latDeg <= 90;

    if (isValidEntry && isValidResult) {
        wgsLonField.value = lonDeg;
        wgsLatField.value = latDeg;
    }
}

const convertToMVT = () => {
    const wgsLon = parseFloat(wgsLonField.value);
    const wgsLat = parseFloat(wgsLatField.value);
    const mvtZoom = parseInt(mvtZoomField.value);

    const tileX = lon2tile(wgsLon, mvtZoom);
    const tileY = lat2tile(wgsLat, mvtZoom);

    clearMVTError();
    const isValidEntry = wgsErrorCheck();

    if (isValidEntry) {
        mvtXField.value = tileX;
        mvtYField.value = tileY;
    }
}

const mvtEnter = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        convertToWGSButton.click();
    }
}
const wgsEnter = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        convertToMVTButton.click();
    }
}

const mvtErrorCheck = () => {
    const zoomValid = checkZoom(mvtZoomField.value);
    const mvtXValid = checkMVT(mvtXField.value);
    const mvtYValid = checkMVT(mvtYField.value);

    let errMessage = 'ok';

    if (!zoomValid.valid) {
        errMessage = zoomValid.message;
    } else if (!mvtXValid.valid) {
        errMessage = mvtXValid.message;
    } else if (!mvtYValid.valid) {
        errMessage = mvtYValid.message;
    }

    mvtHint.innerHTML = errMessage;

    if (errMessage === 'ok') {
        mvtHint.style.visibility = 'hidden';
        return true;
    } else {
        mvtHint.style.visibility = 'visible';
        return false;
    }
}

const wgsErrorCheck = () => {
    const zoomValid = checkZoom(mvtZoomField.value);
    const mvtLonValid = checkWGSLon(wgsLonField.value);
    const mvtLatValid = checkWGSLat(wgsLatField.value);

    let errMessage = 'ok';

    if (!zoomValid.valid) {
        errMessage = zoomValid.message;
    } else if (!mvtLonValid.valid) {
        errMessage = mvtLonValid.message;
    } else if (!mvtLatValid.valid) {
        errMessage = mvtLatValid.message;
    }

    wgsHint.innerHTML = errMessage;

    if (errMessage === 'ok') {
        wgsHint.style.visibility = 'hidden';
        return true;
    } else {
        wgsHint.style.visibility = 'visible';
        return false;
    }
}

const clearMVTError = () => {
    mvtHint.innerHTML = 'ok';
    mvtHint.style.visibility = 'hidden';
}

const clearWGSError = () => {
    wgsHint.innerHTML = 'ok';
    wgsHint.style.visibility = 'hidden';
}

convertToWGSButton.addEventListener('click', convertToWGS);
convertToMVTButton.addEventListener('click', convertToMVT);
wgsLonField.addEventListener('keypress', wgsEnter);
wgsLatField.addEventListener('keypress', wgsEnter);
mvtXField.addEventListener('keypress', mvtEnter);
mvtYField.addEventListener('keypress', mvtEnter);

// Input string validation functions
const checkZoom = (zoomString) => {
    const checkFormat = /^\d{1,2}$/.test(zoomString);
    const checkMaxNumber = parseInt(zoomString) <= 22;
    const result = {
        valid: true
    }

    if (!checkFormat) {
        result.valid = false;
        result.message = "Zoom must be positive Integer";
    } else if (!checkMaxNumber) {
        result.valid = false;
        result.message = "Zoom must be <= 22";
    }

    return result;
}

const checkMVT = (mvtString) => {
    const checkFormat = /^\d+$/.test(mvtString);
    const result = {
        valid: true
    }

    if (!checkFormat) {
        result.valid = false;
        result.message = "MVT coordinate must be positive Integer";
    }

    return result;
}

const checkWGSLon = (lonString) => {
    const checkFormat = /^[1-9]\d*(\.\d+)?$/.test(lonString);
    const checkNumberRange = -180 <= parseFloat(lonString) && parseFloat(lonString) <= 180;
    const result = {
        valid: true
    }

    if (!checkFormat) {
        result.valid = false;
        result.message = "Lon must be Integer or Decimal";
    } else if (!checkNumberRange) {
        result.valid = false;
        result.message = "Lon must be between -180 and 180";
    }

    return result;
}

const checkWGSLat = (latString) => {
    const checkFormat = /^[1-9]\d*(\.\d+)?$/.test(latString);
    const checkNumberRange = -90 <= parseFloat(latString) && parseFloat(latString) <= 90;
    const result = {
        valid: true
    }

    if (!checkFormat) {
        result.valid = false;
        result.message = "Lat must be Integer or Decimal";
    } else if (!checkNumberRange) {
        result.valid = false;
        result.message = "Lat must be between -90 and 90";
    }

    return result;
}

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