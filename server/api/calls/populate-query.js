module.exports = [
    { path: 'account', model: 'Account' },
    { path: 'number', model: 'Number' },
    {
        path: 'contact', model: 'Contact',
        populate: { path: 'user', model: 'User' }
    }
];