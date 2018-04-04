db.contacts.find({ account:ObjectId("57d9fff08ca2296e2639ca93"), name: { $exists: true } }, {_id:0,name:1,phone:1}).forEach(printjson)
