const request = require('request-promise');
const $ = require('cheerio');
const util = require('./util');

async function collect(url, options) {
    const desktop = await getMetrics(url, false, options);
    const mobile = await getMetrics(url, true, options);

    return { desktop: desktop, mobile: mobile };
}

async function getMetrics(url, isMobile, _) {
    let options = {
        uri: url,
        resolveWithFullResponse: true,
        time: true
    }
    options = isMobile ? {
        ...options,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        }
    } : options;

    return await request(options).then(res => {
        const body = res.body;
        const parsed = $(body);
        const nodeCount = parsed.find('*').length;

        return Promise.resolve({
            nodeCount: nodeCount,
            length: body.length,
            ...res.timingPhases
        });
    });
}

const fieldFormatters = {
    length: util.bytesToKiloBytes,
    wait: Math.ceil,
    dns: Math.ceil,
    tcp: Math.ceil,
    firstByte: Math.ceil,
    download: Math.ceil,
    total: Math.ceil
};

const fieldMappings = {
    nodeCount: 'Server Rendered DOM nodes',
    length: 'Document Length (kB)',
    wait: 'Socket Initialization (ms)',
    dns: 'DNS Lookup (ms)',
    tcp: 'TCP Connection (ms)',
    firstByte: 'TTFB (ms)',
    download: 'HTTP Download (ms)',
    total: 'Total Round Trip (ms)'
};

module.exports.collect = collect;
const formatTableRowFn = util.makeFormatTableRowFn(fieldMappings, fieldFormatters);
module.exports.formatTable = util.makeFormatTable(fieldMappings, formatTableRowFn);
