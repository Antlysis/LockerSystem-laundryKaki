const mongoose = require('mongoose');


// Setup schema
var paymentSchema = mongoose.Schema({
  ActionCode: {
    type: String,
    required: true
  },
  UserID: {
      type: Number
  },
  Amount: {
    type: Number
  },
  Description: {
    type: Number
  },
  PaymentType: {
    type: Number
  },
  ProductType: {
    type: Number
  },
  Outlet: {
    type: Object,
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

var ResponseSchema = mongoose.Schema({
    ActionCode: {
      type: String,
      required: true
    },
    ResponseCode: {
        type: Number
    },
    TransactionID: {
        type: Number
    },
    UserID: {
      type: Number
    },
    TransactionDate: {
        type: Number 
    },
    TransactionTime: {
        type: Number 
    },
    create_date: {
      type: Date,
      default: Date.now
    }
  });

// Export Locker model
var Payment = module.exports = mongoose.model('payment', paymentSchema);
var PayResponse = module.exports = mongoose.model('response', ResponseSchema);

module.exports.get = function (callback, limit) {
    Payment.find(callback).limit(limit);
}
module.exports.get = function (callback, limit) {
  PayResponse.find(callback).limit(limit);
}