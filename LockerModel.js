const mongoose = require('mongoose');


// Setup schema
var lockerSchema = mongoose.Schema({
  outlet: {
      type: String,
      required: true
  },
  location: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  locker: {
      type: Object
  },
  create_date: {
      type: Date,
      default: Date.now
  }
});

// Export Locker model
var Locker = module.exports = mongoose.model('locker', lockerSchema);
module.exports.get = function (callback, limit) {
  Locker.find(callback).limit(limit);
}