// Import net module.
var net = require('net');
const base64 =  require('base-64');
//locker controller
Locker = require('./LockerModel');
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
                    Locker.get(function (err, locker) {
                        if (err) {
                            res.json({
                                status: "error",
                                message: err,
                            });
                        }
                        res.json({
                            status: "success",
                            message: "Locker data retrieved successfully",
                            data: locker
                        });
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

/**
 * curl -i -X POST -H 'Content-Type: application/x-www-form-urlencoded' -d 'actioncode=StaffOpen&year=2009' "http://localhost:3000/api/v1/lockers?command=water&amount=2&test=3"
 * req.body = { actioncode: 'StaffOpen', year: '2009' } req.query = { command: 'water', amount: '2', test: '3' }
 * curl -i -X POST -H 'Content-Type: application/json' -d '{"actioncode": "StaffOpen", "year": "2009"}' "http://localhost:3000/api/v1/lockers?command=water&amount=2&test=3"
 * req.body = { actioncode: 'StaffOpen', year: '2009' } req.query = { command: 'water', amount: '2', test: '3' }
 */
exports.command = (req, res, next) => {
    try{
        authenticate(req, res, function(err, apiClient) {
            if(err) {
                return res.status(400).send(err)
            } else if(!err && apiClient) {
                var ApiParameters = req.params,
                    ApiBody = req.body,
                    ApiQuery = req.query;
                console.log(ApiParameters);
                if (ApiParameters.action_code == "UserOpen" && ApiParameters.outlet_id == Outlet){
                    console.log("Initiate UserOpen ");
                    lock(OPEN,ApiQuery.locker);
                    nodeClient.write(hexVal); 

                    res.status(200).send('Receive action code');
                } else if (ApiParameters.action_code == "OpenAll" && ApiParameters.outlet_id == Outlet){
                    console.log("Initiate OpenAll");
                    lock(OPEN,ApiQuery.locker);
                    nodeClient.write(hexVal); 

                    res.status(200).send('Receive action code');
                } else if (ApiParameters.action_code == "StaffOpen" && ApiParameters.outlet_id == Outlet){
                    console.log("Initiate StaffOpen");
                    lock(OPEN,ApiQuery.locker);
                    nodeClient.write(hexVal); 

                    res.status(200).send('Receive action code');            
                } else if (ApiParameters.action_code == "RiderOpen" && ApiParameters.outlet_id == Outlet){
                    console.log("RiderOpen");
                    lock(OPEN,ApiQuery.locker);
                    nodeClient.write(hexVal); 

                    res.status(200).send('Receive action code');            
                } else if (ApiParameters.action_code == "StaffDeposit" && ApiParameters.outlet_id == Outlet){
                    console.log("Initiate StaffDeposit ");
                    lock(OPEN,ApiQuery.locker);
                    nodeClient.write(hexVal); 

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
exports.view = function (req, res, next) {
    // Locker.findById(req.params.lockers_id, function (err, locker) {
    //     if (err)
    //         res.send(err);
    //     res.json({
    //         message: 'Locker details loading..',
    //         data: locker
    //     });
    // });
    authenticate(req, res, function(err, apiClient) {
        if(err) {
            return res.status(400).send(err)
        } else if(!err && apiClient) {
            console.log(req.params);
            Locker.findById(req.params.lockers_id).exec().then((data) =>{
                res.json({
                    status:1,
                    message: 'Locker details loading..', 
                    data
                })
            })
            .catch(next);
        }
    })
};

/**
 * High 4 bit: Board(CU) No. Low 4 bit : No. of Box or Cell of Locker CU)
CMD: Classify Command language
0x30 : Request locker’s door open or close Status
0x31 : Request door open
0x32 : Get lock status and infrared sensor status(locker/cabinet status) of all CU boards on
the RS485 bus (Notice: For this command, address of CU board is a fixed value as F)
ADDR: High 4 bit: Board(CU) No. Low 4 bit : No. of Box or Cell of Locker CU)
*/
const OPEN = 0x01
const STATUS = 0x00;
const PREFIX = 0x02; // JavaScript allows hex numbers.
const SUFFIX = 0x03;
var CMD = 0x00;
var ADDR = 0x00;
var SUM = 0x37;
var bytesToSend = [PREFIX, ADDR, CMD, SUFFIX, SUM],
    hexVal = new Uint8Array(bytesToSend);
var response = {address:0, command:0, lock:0, present:0};
const Outlet = {
    location: "TamanSungaiBesi",
    brand: "WashStudio"
}; //Hardcoded Location
var lockerStatus = [
    {name: 'locker1', bitmask: 0x0100, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker2', bitmask: 0x0200, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker3', bitmask: 0x0400, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker4', bitmask: 0x0800, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker5', bitmask: 0x1000, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker6', bitmask: 0x2000, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker7', bitmask: 0x4000, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker8', bitmask: 0x8000, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker9', bitmask: 0x0001, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker10', bitmask: 0x0002, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker11', bitmask: 0x0004, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker12', bitmask: 0x0008, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker13', bitmask: 0x0010, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker14', bitmask: 0x0020, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker15', bitmask: 0x0040, lock: false, empty: false, staffReady:false, riderReady:false},
    {name: 'locker16', bitmask: 0x0080, lock: false, empty: false, staffReady:false, riderReady:false}
];

// This function create and return a net.Socket object to represent TCP client.
function getConn(connName){

    var option = {
        host:'192.168.0.178',
        port: 5000
    }

    // Create TCP client.
        var client = net.createConnection(option, function () {
        console.log('Connection name : ' + connName);
        console.log('Connection local address : ' + client.localAddress + ":" + client.localPort);
        console.log('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    });

    client.setTimeout(20000);
    client.setEncoding('hex');

    // When receive server send back data.
    client.on('data', function (data) {
        console.log('Server return data : ' + data);
        lockerStatus = maskingCompare(data);
        // console.log(lockerStatus);        
    });

    // When connection disconnected.
    client.on('end',function () {
        console.log('Client socket disconnect. ');
    });

    client.on('timeout', function () {
        console.log('Client connection timeout. ');
    });

    client.on('error', function (err) {
        console.error(JSON.stringify(err));
    });

    return client;
}

var maskingCompare = function(data){
    var pattern1 = /^02([a-f0-9]{2})+([a-f0-9]{2})+([a-f0-9]{4})+([a-f0-9]{4})03[a-f0-9]{2}/g
    response.address = data.replace(pattern1, "$1");
    response.command = data.replace(pattern1, "$2");
    response.lock = data.replace(pattern1, "$3");
    response.present = data.replace(pattern1, "$4");
    // console.log(response);
    const result = lockerStatus.map(status =>{
        const lockReceive = parseInt(response.lock,16);
        const objReceive = parseInt(response.present,16);
        return Object.assign({}, status, {
            lock: (lockReceive & status.bitmask) != 0,
            empty: (objReceive & status.bitmask) != 0
        })        
    })
    // console.log(result);
    return result;
}

/**
 * For Door lock command sending
 */
var lock = function(command, numbersLock){
    if(command == OPEN){
        CMD = 0x31;
        ADDR = (numbersLock-1) & 0x0F;        
        SUM = PREFIX + SUFFIX + CMD + ADDR;
        bytesToSend = [PREFIX, ADDR, CMD, SUFFIX, SUM];
        hexVal = new Uint8Array(bytesToSend);
   
    } else if (command == STATUS){
        CMD = 0x30;
        ADDR = (numbersLock-1) & 0x0F;
        SUM = PREFIX + SUFFIX + CMD + ADDR;
        bytesToSend = [PREFIX, ADDR, CMD, SUFFIX, SUM];
        hexVal = new Uint8Array(bytesToSend);
        
    } else if (command == SREADY){ //Staff Ready
        CMD = 0x30;
        ADDR = (numbersLock-1) & 0x0F;
        SUM = PREFIX + SUFFIX + CMD + ADDR;
        bytesToSend = [PREFIX, ADDR, CMD, SUFFIX, SUM];
        hexVal = new Uint8Array(bytesToSend);
        
    } else if (command == RREADY){ //Rider Ready
        CMD = 0x30;
        ADDR = (numbersLock-1) & 0x0F;
        SUM = PREFIX + SUFFIX + CMD + ADDR;
        bytesToSend = [PREFIX, ADDR, CMD, SUFFIX, SUM];
        hexVal = new Uint8Array(bytesToSend);
        
    }
}


// // Create node client socket.
var nodeClient = getConn('Node');
test = lock(STATUS,5);
// maskingCompare('02003522810040037c');

// console.log(hexVal);
// lock(STATUS,2);
nodeClient.write(hexVal); 

