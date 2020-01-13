const mongoose = require('mongoose');


// Setup schema
var lockerSchema = mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  bitmask: {
      type: Number
  },
  lock: {
      type: Boolean,
      required: true
  },
  empty: {
    type: Boolean,
    required: true
  },
  outlet: {
    type: Object,
    required: true
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