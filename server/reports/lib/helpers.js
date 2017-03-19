const moment = require('moment');

const mongoose = require("mongoose");
const strToOID = _id => mongoose.Types.ObjectId(_id);

const onError = error => {
    console.log(error.stack)
    throw error;
};

const assign = (originalState, newState) => Object.assign({}, originalState, newState);

const formatDate = date => moment( new Date(date) ).format('D MMMM YYYY');
const dateToISO = date => new Date(date).toISOString();

module.exports = {
    assign,
    onError,
    strToOID,
    formatDate,
    dateToISO
};