const request = require('request-promise');
const util = require('./util');

async function collect(url, _) {
    const metrics = await getMetrics(url);

    const desktop = {SRP: metrics['desktopSRP'],
                     PDP: metrics['desktopPDP']};
    const mobile  = {SRP: metrics['mobileSRP'],
                     PDP: metrics['mobilePDP']};

    return { desktop: desktop, mobile: mobile };
}

async function getMetrics(url) {
    let parsedUrl = new URL(url);

    try {
        return await request(parsedUrl.origin + '/chunkStats.json').then(body => {
            return Promise.resolve(JSON.parse(body));
        });
    } catch(error) {
        return Promise.resolve({});
    }
}

const fieldFormatters = {
    SRP: util.bytesToKiloBytes,
    PDP: util.bytesToKiloBytes
};

const fieldMappings = {
    SRP: 'SRP Bundlesize (kB)',
    PDP: 'PDP Bundlesize (kB)'
};

module.exports.collect = collect;
const formatTableRowFn = util.makeFormatTableRowFn(fieldMappings, fieldFormatters);
module.exports.formatTable = util.makeFormatTable(fieldMappings, formatTableRowFn);
