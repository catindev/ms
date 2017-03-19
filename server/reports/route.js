const _ = require("lodash");
const calculate = require('./stats');

module.exports = (request, response) => {

    const pathToReport = './ready/' + request.params.id + '.js';

    try {
        var report = require( pathToReport );
    } catch (e) {
        return response.render( 'reports/error' );
    }

    const render = data => response.render( 'reports/', Object.assign({}, data, { _ }) );

    calculate( report )
        // .then(  data => response.json(data) )
        .then( render )
        .catch( error => {
            console.log('router error', error.message)
            response.end(error.message)
        });
};