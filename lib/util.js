const greenSquare = '![#c5f015](https://placehold.it/15/c5f015/000000?text=+)'
const yellowSquare = '[#fff66](https://placehold.it/15/fff66/000000?text=+)'
const redSquare = '![#f03c15](https://placehold.it/15/f03c15/000000?text=+)'

function prependColor(delta) {
    if (delta == 0) {
        return yellowSquare + ' ' + delta;
    } else if (delta < 0) {
        // Negative delta is positive result e.g. we made it faster or smaller
        return greenSquare + ' ' + delta;
    } else {
        return redSquare + ' ' + delta;
    }
}

function computeDelta(controlValue, prValue) {
    return prValue - controlValue;
}

function formatDelta(controlValue, prValue) {
    const delta = computeDelta(controlValue, prValue);
    return prependColor(delta);
}

function bytesToKiloBytes(bytes) {
    return Math.ceil(bytes / 1000);
}

function makeFormatTableRowFn(fieldMappings, fieldFormatters) {
    return function(field, control, pr) {
        const fieldName = fieldMappings[field];

        let fieldFormatter = (x) => x;

        if (fieldFormatters[field]) {
            fieldFormatter = fieldFormatters[field];
        }

        const controlDesktopValue = fieldFormatter(control.desktop[field]);
        const prDesktopValue = fieldFormatter(pr.desktop[field]);
        const desktopDelta = formatDelta(controlDesktopValue, prDesktopValue);

        const controlMobileValue = fieldFormatter(control.mobile[field]);
        const prMobileValue = fieldFormatter(pr.mobile[field]);
        const mobileDelta = formatDelta(controlMobileValue, prMobileValue);

        return [fieldName,
                controlDesktopValue,
                prDesktopValue,
                desktopDelta,
                controlMobileValue,
                prMobileValue,
                mobileDelta];
    };
}

function makeFormatTable(fieldMappings, formatTableRowFn) {
    return function(control, pr) {
        return Object.keys(fieldMappings).map((field) => {
            return formatTableRowFn(field, control, pr);
        });
    };
}

module.exports.prependColor = prependColor;
module.exports.formatDelta = formatDelta;
module.exports.bytesToKiloBytes = bytesToKiloBytes;
module.exports.makeFormatTableRowFn = makeFormatTableRowFn;
module.exports.makeFormatTable = makeFormatTable;
