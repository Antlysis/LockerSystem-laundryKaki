const mongoose = require('mongoose');

var KeysSchema = new mongoose.Schema({
  clientName: { 
    type: String,
    required: true, 
    ref: 'Operator' 
  },
  clientSecret: { 
    type: String,
    required: true, 
    ref: 'Operator' 
  }
});

KeysSchema.statics.authenticate = function (clientid, cSecret, callback) {
  Keys.findOne({ _id: clientid })
    .exec(function (err, key) {
      if (err) {
        return callback(err)
      } else if (!key) {
        //console.log("testing")
        var err = new Error('Client not found.');
        err.status = 401;
        return callback("Client not Found", null);
      }
      if(cSecret == key.clientSecret) {
        //console.log("matched")
        return callback(null, key);
      } else {
        //console.log("failed")
        return callback("Invalid Client Secret", null );
      }
    });
}

//TokenSchema.index({ createAt: 1 }, { expireAfterSeconds: 300 });

var Keys = mongoose.model('Keys', KeysSchema);
module.exports = Keys;