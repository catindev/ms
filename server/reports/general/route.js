const moment = require('moment');
const calculate = require('./index');

module.exports = (request, response) => {

    const pathToReport = '../ready/' + request.params.id + '.js';

    let report = false;
    try {
        report = require( pathToReport );
    } catch (e) {
        response.end(`
            <div style="font-size: 20px; padding: 2rem;">
                <h1 style="line-height: 1;">Ошибка</h1>
                <p>Отчёт не найден или ссылка устарела. Обратитесь в тех. поддержку.</p>            
            </div>
        `);
    }

    const range = {
        start: moment(report.general.date).format('D MMMM YYYY'),
        end: moment().format('D MMMM YYYY')
    };

    const render = general => response.render(
        'reports/index', { customer: report.customer, general, range }
    );

    calculate(report.general.accounts, report.general.date)
        .then( render )
        .catch( error => {
            console.log('router error', error.message)
            response.end(error.message)
        });
};