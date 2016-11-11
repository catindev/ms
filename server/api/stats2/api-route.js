module.exports = (request, response) => {
    const  states = {
        'leads/all': require('./leads'),
        'leads/intervals': require('./leads'),
        'leads/target': require('./target-users'),
        'leads/nontarget': require('./target-users-percent'),
        'calls/incoming': require('./calls-incoming'),
        'calls/missing': require('./calls-missing'),
        'calls/ratio': require('./calls-ratio'),
        'waiting': require('./waiting')
    };

    let { account } = request.user;
    let { state } = request.params;
    let { start, end, interval, type } = request.query;

    const fnName = type === 'false' ? state : `${ state }/${ type }`;
    fnName in states
        ? states[ fnName ]({ start, end, interval, account }).then( data => response.json(data) )
        : response.status(400).json({ error: 'invalid stats state for ' + fnName });
};