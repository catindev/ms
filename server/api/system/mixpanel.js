const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init('bf6273b6213b5583d90ade082487cd90');

module.exports = {
    
    track({ name, data }) {
        mixpanel.track(name, data);
    },

    increment({ user, attr }) {
        mixpanel.people.increment(user, attr);
    }

};