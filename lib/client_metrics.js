const collectMetrics = require('./collectMetrics');
const puppeteer = require('puppeteer');

module.exports.collect = async function(url, options) {
    const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser',
                                            ignoreHTTPSErrors: true,
                                            args: ['--no-sandbox', '--headless', '--disable-gpu']});
    const page = await browser.newPage();

    if (options.isMobile) {
        page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25');
        await page.goto(url);
    } else {
        await page.goto(url);
    }

    let pageMetrics = await page.evaluate(collectMetrics);
    await browser.close();

    return pageMetrics;
};
