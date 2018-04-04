db.contacts.find({ account: ObjectId("581d85701610b54c7dc21a00"), noTargetReason: { $exists: false } }).forEach(function(user){
  print(user.phone);
});
