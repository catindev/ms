	db.contacts.find({ 
		account: ObjectId("5938ce6b60f58f7d5d3d21e7"), 
		name:{ $exists: true },
		pol:{ $exists: true }, 
		usluga:{ $exists: true } 
	})
