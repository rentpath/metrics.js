const collectMetrics = require('./collectMetrics');
const puppeteer = require('puppeteer');
const puppeteerHar = require('puppeteer-har');
const util = require('./util');

async function collect(url, options) {
    const desktop = await getMetrics(url, false, options);
    const mobile = await getMetrics(url, true, options);

    return { desktop: desktop, mobile: mobile };
}

const defaultOptions = {executablePath: '/usr/bin/chromium-browser',
                        args: ['--no-sandbox', '--headless', '--disable-gpu']};

async function getMetrics(url, isMobile, options) {
    const browser = await puppeteer.launch(Object.assign(defaultOptions, options));

    const page = await browser.newPage();
    const har = new puppeteerHar(page);
    await har.start();

    if (isMobile) {
        page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
    }

    await page.goto(url);

    const pageMetrics = await page.evaluate(collectMetrics);
    const harResults = await har.stop();
    await browser.close();

    return {...pageMetrics, har: harResults};
}

const fieldFormatters = {
    dcl: util.formatMillis,
    interactive: util.formatMillis,
    domComplete: util.formatMillis,
    load: util.formatMillis,
    paint: util.formatMillis
};

const fieldMappings = {
    dcl: 'DOM Content Loaded',
    interactive: 'Interactive',
    domComplete: 'DOM Complete',
    load: 'Load',
    paint: 'Paint',
    nodeCount: 'Client DOM nodes'
};

module.exports.collect = collect;
const formatTableRowFn = util.makeFormatTableRowFn(fieldMappings, fieldFormatters);
module.exports.formatTable = util.makeFormatTable(fieldMappings, formatTableRowFn);
