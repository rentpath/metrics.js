const psi = require('psi');

module.exports.collect = async function(url, options) {
    const strategy = options.isMobile ? 'mobile' : 'desktop';
    const psiOpts = {strategy: strategy};

    if (options.key) {
        psiOpts['key'] = options.key;
    }

    let data;

    try {
        data = await psi(url, psiOpts);
    } catch (error) {
        console.log('Error fetching url:', url);
        console.error(error);
        process.exit(1);
    }

    return data;
};
