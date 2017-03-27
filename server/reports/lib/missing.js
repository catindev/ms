module.exports = function getCustomersWithMissingCallsOnly({Call, ObjectId,}) {

		const findGoodCalls = stringID => Call.find({
				contact: ObjectId(stringID),
				status: 3,
		}).count();

		const isMissing = results => (item, index) => results[index] === 0;
		const isNotMissing = results => (item, index) => results[index] > 0;

		const assign = (state = {}) => results => Object.assign({}, state, {
				missing: state.no_profile.filter(isMissing(results)),
				no_profile: state.no_profile.filter(isNotMissing(results)) || false,
		});

		return function(state) {

				return Promise
						.all(state.no_profile.map(findGoodCalls))
						.then(assign(state))
						.catch(error => {
								throw error
						});

		}

};
