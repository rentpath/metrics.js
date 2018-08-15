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

    let pageMetrics = await page.evaluate(async () => {
        const metrics = {};

        var t = window.performance.timing;
        const interactive = (t.domInteractive - t.domLoading);
        const dcl = (t.domContentLoadedEventStart - t.domLoading);
        const domComplete = (t.domComplete - t.domLoading);
        const load = (t.loadEventStart - t.requestStart);
        const nodeCount = document.getElementsByTagName('*').length;

        metrics['interactive'] = interactive;
        metrics['dcl'] = dcl;
        metrics['domComplete'] = domComplete;
        metrics['load'] = load;
        metrics['nodeCount'] = nodeCount;

        var paint = window.performance.getEntriesByType('paint');
        const fcp = paint[1];

        metrics['paint'] = Math.ceil(fcp.startTime);

        return Promise.resolve(metrics);
    });
    await browser.close();

    return pageMetrics;
};
