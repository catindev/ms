const cars = require("./stuff/cars/db");

cars.forEach( car => car.models.forEach( model => {
    const m = model.title.replace(' - ','');
    m.indexOf('(') === -1 && console.log(model.title.replace(' - ',''));
} ) );