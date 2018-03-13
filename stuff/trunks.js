const trunks = require('./trunks.json')
const accounts = require('./accounts.json')
const users = require('./users.json')
const { find } = require('lodash')


// accounts.forEach( account => {
// 	const { numbers } = find(trunks, { _id: account._id })
// 	console.log( account.name, `(${ numbers.length })`)
// 	numbers.forEach( ({ number, name }) => console.log(name, ' ', number))
// 	console.log('')
// })


accounts.forEach( ({ _id, name }) => {
	const { managers } = find(users, { _id })
	console.log( name, `(${ managers.length })`)
	managers.forEach( ({ number, name }) => console.log(name, ' ', number.join(', ')))
	console.log('')
})