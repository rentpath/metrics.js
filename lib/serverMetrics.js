const request = require('request-promise');
const $ = require('cheerio');

let url;

const collect = async (url, isMobile) => {
    const options = isMobile ? {
        uri: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        }
    } : url;

    let metrics = await request(options).then(body => {
        const parsed = $(body);
        const nodeCount = parsed.find('*').length;

        let metrics = {nodeCount: nodeCount,
                       length: Buffer.byteLength(body, 'utf8')};

        return Promise.resolve(metrics);
    });

    return metrics;
};

module.exports.collect = collect;
