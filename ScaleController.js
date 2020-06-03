
//Scale controller
const base64 =  require('base-64');

Scale = require('./ScaleModel');
Keys = require('./KeyModel');
// Handle index actions
exports.index = function (req, res, next) {
    try{
        authenticate(req, res, function(err, apiClient) {
            if(err) {
                return res.status(400).send(err)
            } else if(!err && apiClient) {
                var ApiParameters = req.params,
                    ApiBody = req.body,
                    ApiQuery = req.query;  
                console.log(ApiParameters);
                if (ApiParameters.action_code == "GetAll"){
                    console.log("Initiate GetAll");
                    // Scale.get(function (err, scale) {
                    //     if (err) {
                    //         res.json({
                    //             status: "error",
                    //             message: err,
                    //         });
                    //     }
                    //     res.json({
                    //         status: "success",
                    //         message: "Scale data retrieved successfully",
                    //         data: scale
                    //     });
                    // });
                    res.json({
                        status: "success",
                        message: "Scale data retrieved successfully",
                        data: scaleStatus
                    });
                } else {
                    res.status(400).json({
                        status: "Fail to find correct code",
                        message: "Incorrect action code"
                    });
                }
                console.log(req.body)
                console.log("query: ",req.query);
            }
        })
    } catch(err){
        next(err);
    } 
};

// Handle view scale info
exports.view = function (req, res) {
    authenticate(req, res, function(err, apiClient) {
        if(err) {
            return res.status(400).send(err)
        } else if(!err && apiClient) {
            Scale.findById(req.params.scale_id, function (err, scale) {
                if (err)
                    res.send(err);
                res.json({
                    message: 'Scale details loading..',
                    data: scale
                });
            });
        }
    })
};

var scaleStatus = {
     weight: 0.001,
     statusReturn: "",
     status: {
         zero: false,
         stable: false,
         weighting: false
     }
 }


 var scaleStatus_Test = {
    weight: 5.001,
    statusReturn: "B",
    status: {
        zero: false,
        stable: true,
        weighting: false
    }
}

/**
 * Serial Port Function
 * depending on port : /dev/ttyUSB1
 */
// const SerialPort = require('serialport')
// const Readline = require('@serialport/parser-readline')
// const port = new SerialPort('/dev/ttyUSB0');

// const parser = port.pipe(new Readline({ delimiter: '\r' }))
// parser.on('data', function (data) {
//     // console.log('data received: ' + data)
//     var pattern = /([0-9]+\.+[0-9]{2})/g
//     var pattern2 = /([\x40A-F]{1})/g
//     scaleStatus.weight = data.match(pattern);
//     scaleStatus.statusReturn = data.match(pattern2);
//     //43"C"=zero,41"A" or 40"@"=scaling,42"B"=stable
//     if (scaleStatus.statusReturn == 'B'){
//         scaleStatus.status.stable = true;
//         .status.zero = false;
//         scaleStatus.status.weighting = false;
//     } else if scaleStatus(scaleStatus.statusReturn == 'C'){
//         scaleStatus.status.zero = true;
//         scaleStatus.status.weighting = false;
//         scaleStatus.status.stable = false;
//     }else if (scaleStatus.statusReturn == 'A' || scaleStatus.statusReturn == '@'){
//         scaleStatus.status.weighting = true;
//         scaleStatus.status.stable = false;
//         scaleStatus.status.zero = false;
//     } else {
//         scaleStatus.status.stable = false;
//         scaleStatus.status.zero = false;
//         scaleStatus.status.weighting = false;
//     }
// })

// parser.on("error",function (err) {
//     console.error("Serial error"+JSON.stringify(err));
// });

function authenticate(req, res, callback) {
  var pat1 = /Basic ([0-9a-zA-Z]+)/g;
  var pat2 = /([0-9a-zA-Z]+):([0-9a-zA-Z]+)/g;
  // console.log(req.headers.authorization)
    if (req.headers.authorization == null){
        console.log('nothing')
        var code = null;
    } else 
        var code = req.headers.authorization.replace(pat1, "$1");
  var data = base64.decode(code);
  var clientid = data.replace(pat2, "$1");
  var clientSecret = data.replace(pat2, "$2");
  if(!clientid) {
    msg.status = "Missing Client ID";
    return res.status(400).send(msg)
  } else if (!clientSecret) {
    msg.status = "Missing Client Secret";
    return res.status(400).send(msg)
  }
  Keys.authenticate(clientid, clientSecret, function(error, apiClient) {
    if(apiClient) {
        callback(null, apiClient)
    } else {
        console.log(error);
        callback(error);
    }
  })
}
