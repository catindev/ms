const calculate = require('./general-stats');

module.exports = (request, response) => {

    const pathToReport = './ready/' + request.params.id + '.js';

    try {
        var report = require( pathToReport );
    } catch (e) {
        return response.render( 'reports/error' );
    }

    // const render = general => response.render(
    //     'reports/index', {
    //         customer: report.customer, general, range, reportID: request.params.id
    //     }
    // );

    calculate( report )
        .then(  data => response.json(data) )
        .catch( error => {
            console.log('router error', error.message)
            response.end(error.message)
        });
};