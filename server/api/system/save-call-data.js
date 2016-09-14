var fs = require('fs');

module.exports = function ({ name, data }) {
    const path = `${__dirname}/../../journal/${ name.replace(/\+/, '') }.json`;
    fs.writeFile( path, data, error => {
        if ( error ) throw error;
        console.log("Journal", path, "saved");
    });
};