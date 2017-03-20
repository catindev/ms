const _ = require("lodash");
const calculate = require('./index');

module.exports = (request, response) => {
    const { json } = request.query;

    const pathToReport = './ready/' + request.params.id + '.js';

    try {
        var report = require( pathToReport );
    } catch (e) {
        return response.render( 'reports/error' );
    }

    const render = data => response.render( 'reports/', Object.assign({}, data, { _ }) );

    calculate( report )
        .then( data => json ? response.json(data) : render(data) )
        .catch( error => {
            console.log('router error', error.message)
            // response.end(error.message)
            return response.render( 'reports/error-500' );
        });
};