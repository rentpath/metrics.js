const request = require('request-promise');
const $ = require('cheerio');
const util = require('./util');

async function collect(url, options) {
    const desktop = await getMetrics(url, false, options);
    const mobile = await getMetrics(url, true, options);

    return { desktop: desktop, mobile: mobile };
}

async function getMetrics(url, isMobile, _) {
    const options = isMobile ? {
        uri: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        }
    } : url;

    return await request(options).then(body => {
        const parsed = $(body);
        const nodeCount = parsed.find('*').length;

        return Promise.resolve({nodeCount: nodeCount,
                                length: Buffer.byteLength(body, 'utf8')});
    });
}

const fieldFormatters = {
    length: util.bytesToKiloBytes
};

const fieldMappings = {
    nodeCount: 'Server Rendered DOM nodes',
    length: 'Document Length (KB)'
};

module.exports.collect = collect;
const formatTableRowFn = util.makeFormatTableRowFn(fieldMappings, fieldFormatters);
module.exports.formatTable = util.makeFormatTable(fieldMappings, formatTableRowFn);
