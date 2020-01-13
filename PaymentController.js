const base64 =  require('base-64');

//Payment controller
Payments = require('./PaymentModel');
Keys = require('./KeyModel');
TCPServicePayloadResponse = require('./PaymentModel');

// Handle index actions
exports.index = function (req, res) {
    try{
        authenticate(req, res, function(err, apiClient) {
            if(err) {
                return res.status(400).send(err)
            } else if(!err && apiClient) {
                var ApiParameters = req.params,
                    ApiBody = req.body,
                    ApiQuery = req.query;
                console.log(ApiParameters);
                if (ApiParameters.action_code == "PaymentRequest"){
                    console.log("Initiate PaymentRequest");

                    res.status(200).send('Receive action code');
                } else if (ApiParameters.action_code == "PaymentStatus"){
                    console.log("Initiate PaymentStatus");

                    res.status(200).send('Receive action code');
                } else if (ApiParameters.action_code == "VoidPayment"){
                    console.log("Initiate VoidPayment");

                    res.status(200).send('Receive action code');            
                } else {
                    res.json({
                        status: "success",
                        message: "Incorrect action code"
                    });
                }
                console.log(ApiBody)
                console.log("query: ",ApiQuery);
            }
        })
    } catch(err){
        next(err);
    } 
};

// Handle view locker info
exports.view = function (req, res) {
    authenticate(req, res, function(err, apiClient) {
        if(err) {
            return res.status(400).send(err)
        } else if(!err && apiClient) {
            Payments.findById(req.params.payment_id, function (err, payment) {
                if (err)
                    res.send(err);
                res.json({
                    message: 'Locker details loading..',
                    data: payment
                });
            });
        }
    })
};

exports.command = function (req, res){
    try{
        authenticate(req, res, function(err, apiClient) {
            if(err) {
                return res.status(400).send(err)
            } else if(!err && apiClient) {
                var ApiParameters = req.params,
                    ApiBody = req.body,
                    ApiQuery = req.query;
                console.log(ApiParameters);
                if (ApiParameters.action_code == "PaymentRequest"){
                    console.log("Initiate PaymentRequest");

                    res.status(200).send('Receive action code');
                } else if (ApiParameters.action_code == "PaymentStatus"){
                    console.log("Initiate PaymentStatus");

                    res.status(200).send('Receive action code');
                } else if (ApiParameters.action_code == "VoidPayment"){
                    console.log("Initiate VoidPayment");

                    res.status(200).send('Receive action code');            
                } else {
                    res.json({
                        status: "success",
                        message: "Incorrect action code"
                    });
                }
                SaleRequest.PaymentType = ApiQuery.PaymentType;
                console.log(ApiBody)
                console.log("query: ",ApiQuery);
            }

        })
    } catch(err){
        next(err);
    } 
}

// Handle create contact actions
exports.new = function (req, res) {
    authenticate(req, res, function(err, apiClient) {
        if(err) {
            return res.status(400).send(err)
        } else if(!err && apiClient) {
            var payments = new Payments();
            payments.name = req.body.name ? req.body.name : contact.name;
            // payments.gender = req.body.gender;
            // payments.email = req.body.email;
            // payments.phone = req.body.phone;// save the payments and check for errors
            payments.save(function (err) {
                res.json({
                    message: 'New payments created!',
                    data: payments
                }); 
            });
        }
    })
};

function authenticate(req, res, callback) {
  var pat1 = /Basic ([0-9a-zA-Z]+)/g
  var pat2 = /([0-9a-zA-Z]+):([0-9a-zA-Z]+)/g
  // console.log(req.headers.authorization)
  var code = req.headers.authorization.replace(pat1, "$1")
  var data = base64.decode(code)
  var clientid = data.replace(pat2, "$1")
  var clientSecret = data.replace(pat2, "$2")
  if(!clientid) {
    msg.status = "Missing Client ID"
    return res.status(400).send(msg)
  } else if (!clientSecret) {
    msg.status = "Missing Client Secret"
    return res.status(400).send(msg)
  }
  Keys.authenticate(clientid, clientSecret, function(error, apiClient) {
    if(apiClient) {
        callback(null, apiClient)
    } else {
        console.log(error)
        callback(error)
    }
  })
}

var SaleRequest = {
    "ActionCode": { },
    "ReferenceNo": { },
    "DeveloperID": {},
    "Amount": {},
    "Description": {},
    "PaymentType": {},
    "ProductType": {},
    "CouponCode": {},
    "NetworkSelection": {},
  }

var SalesResponse = {
    "ActionCode": {},
    "ResponseCode": {},
    "TransactionID": {},
    "ApprovalCode": {},
    "CardType": {},
    "ApplicationLabel": {},
    "CardNo": {},
    "CardHolderName": {},
    "TraceNo": {},
    "TC": {},
    "AID": {},
    "CVM_Type": {},
    "TransactionDate": {},
    "TransactionTime": {},
    "TID": {},
    "MID": {},
    "BatchNo": {},
    "InvoiceNo": {},
    "RREF_No": {},
    "TSI": {},
    "TVR": {},
    "EntType": {},
    "AmountAuthorised": {},
    "PrivateField": {},
    "EntryType": {}
}

var VoidRequest = {
    "ActionCode": {}, 
    "ReferenceNo": {},
    "DeveloperID": {}, 
    "TransactionID": {}, 
    "VoidType": {}, 
    "NetworkSelection": {}
}


var VoidResponse = {
    "ActionCode": {},
    "ResponseCode": {},
    "ReferenceNo": {}
}
var CancelResquest = {
    "ActionCode": {}
}


var CancelResponse = {
    "ActionCode": {}, 
    "ResponseCode": {}
}


var QRPaymentRequest = {
    "ActionCode": { },
    "ReferenceNo": { },
    "DeveloperID": {},
    "Amount": {},
    "Description": {},
    "QRType": {},
    "PrivateField": {},
    "NetworkSelection": {},
  }

var QRPaymentResponse = {
    "ActionCode": { },
    "ResponseCode": { },
    "ReferenceNo": {},
    "PrivateField": {},
}

var InquiryQRPaymentRequest = {
    "ActionCode": { },
    "ReferenceNo": { },
    "DeveloperID": {},
    "TransactionID": {},
    "QRType": {},
    "PrivateField": {},
    "NetworkSelection": {},
}

var InquiryQRPaymentResponse = {
    "ActionCode": { },
    "ResponseCode": { },
    "ReferenceNo": {},
    "PrivateField": {},
    "TransactionID": {},
    "QRType": {},    
    "AmountAuthorised": {},
}

var TerminalStatusRequest = {
    "ActionCode": { }
}
var TerminalStatusResponse = {
    "ActionCode": { },
    "ResponseCode": {}
}
var SettlementInfoRequest = {
    "ActionCode": { },
    "DeveloperID": {},
    "NetworkSelection": {}
}
var SettlementInfoResponse = {
    "ActionCode": { },
    "ResponseCode": {},
    "TotalTransactionAmount": {},
    "TotalTransactionCount": {}
}

var SettlementRequest = {
    "ActionCode": { },
    "DeveloperID": {},
    "NetworkSelection": {}
}
var SettlementResponse = {
    "ActionCode": { },
    "ResponseCode": {},
}

var SuperksCouponValidationRequest = {
    "ActionCode": { },
    "DeveloperID": {},
    "Amount": {},
    "CouponCode": {},
    "NetworkSelection": {}
}
var SuperksCouponValidationResponse = {
    "ActionCode": { },
    "ResponseCode": {},
    "CouponCode": {},
    "FinalAmount": {},
    "DiscountAmount": {},
    "CouponType": {},
    "CouponValue": {}
}

var TCPServicePayloadResponse = {
    "ActionCode":{},
    "Address":{},
    "Port": {},
    "Payload": {},
    "Timeout": {},
    "RequestType": {}
}

var TCPServicePayloadRequest = {
    "ActionCode": {},
    "Payload":{},
    "NetworkSelection": {}
}