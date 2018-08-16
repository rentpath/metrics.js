module.exports = function() {
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
};
