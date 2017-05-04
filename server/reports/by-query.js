const _ = require("lodash");
const calculate = require('./index');

module.exports = (request, response) => {
    const { json, account, start, end } = request.query;

    const report = {
        account, id: 'by-query',
        date: { start, end }
    };
    const render = data => response.render('reports/', Object.assign({}, data, { _ }));

    calculate(report)
        .then(data => json ? response.json(data) : render(data))
        .catch(error => {
            console.log('router error', error.message)
            // response.end(error.message)
            return response.render('reports/error-500');
        });
};