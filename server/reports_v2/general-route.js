const _ = require("lodash");
const calculate = require('./general-stats');

module.exports = (request, response) => {

    const pathToReport = './ready/' + request.params.id + '.js';

    try {
        var report = require( pathToReport );
    } catch (e) {
        return response.render( 'reports/error' );
    }

    const render = data => response.render( 'reports_v2/general', Object.assign({}, data, { _ }) );

    calculate( report )
        // .then(  data => response.json(data) )
        .then( render )
        .catch( error => {
            console.log('router error', error.message)
            response.end(error.message)
        });
};