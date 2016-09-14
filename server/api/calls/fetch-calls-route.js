const metaInfo = require('./meta-info');

const fetchCalls = {
    'my': require('./fetch-my'),
    'missed': require('./fetch-missed'),
    'new': require('./fetch-my-new'),
    'all': require('./fetch-all')
};

module.exports = function fetchCallsRoute(request, response) {
    let { limit = 0, skip = 0, filter = 'all' } = request.query || {};

    const params = { limit, skip, user: request.user };

    const fetchMetaAndRender = calls => metaInfo(
        params, meta => response.render(
            'calls/index', {
                calls,
                meta,
                filter,
                user: request.user,
                page: 'calls',
                title: 'звонки'
            }
        )
    );

    fetchCalls[ filter ]( params, fetchMetaAndRender );
};