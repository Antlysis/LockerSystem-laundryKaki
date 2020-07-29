// Import net module.
var net = require('net');
const base64 =  require('base-64');
//locker controller
Locker = require('./LockerModel');
Keys = require('./KeyModel');
const logger = require('./config/winston')



const EventEmitter = require('events');

class OnDataEmitter extends EventEmitter { }
const OnData = new OnDataEmitter();

var TCPConnectionFlag = false;

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

// Handle index actions
exports.index = asyncMiddleware(async (req, res, next) => {
    try{
        authenticate(req, res, async function(err, apiClient) {
            if(err) {
                return res.status(400).send(err)
            } else if(!err && apiClient) {
                var ApiParameters = req.params,
                    ApiBody = req.body,
                    ApiQuery = req.query;
                    // set locals, only providing error in development
                    // res.locals.message = err.message
                    // logger.setLogData(ApiBody);  
                    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);

                console.log(ApiParameters);
                if (ApiParameters.action_code == "GetAll"){
                    console.log("Initiate GetAll");
                    // nodeClient = getConn('Node');
                    // lock(STATUS,5);
                    // nodeClient.write(hexVal);                                  
                    // AllLocker = await getAllLocker();                     
                    // return res.status(200).send(AllLocker);
                    let status = false;
                    OnData.once('code', (data)=>{
                        status = true;
                        OnData.removeAllListeners('code');
                        OnData.removeAllListeners('errorS');
                        logger.info("Retun sucess response", { 
                            "sucess": true
                        });
                        res.status(200).send(data);
                        // console.log("code")                      
                    });
                    OnData.once('errorS', (data)=>{
                        status = true;
                        OnData.removeAllListeners('errorS');
                        OnData.removeAllListeners('code');
                        logger.error("Retun error response", {
                            "sucess":false
                        })
                        res.status(501).send({error: 'TCP server error', message: data})
                        // console.log("error")                                  
                    })


                    // set a timeout to remove listener and send timeout response if the TCP server fails to reply
                    setTimeout(()=>{
                        if(status) return true;
                        // Clear the enevnt listener to void memory leaks
                        OnData.removeAllListeners('code');
                        OnData.removeAllListeners('errorS');
                        logger.error("Retun error response", {
                            "sucess":false,
                            "message": " timeout in two seconds"
                        })
                        res.status(502).send({error: 'timedout, exceed time limit'})
                    }, 2000)

                    nodeClient = getConn('Node');
                    lock(STATUS,1);                    
                    nodeClient.write(hexVal); 

                    // res.status(200).send(lockerStatus);
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
});

let getAllLocker = async () =>{
    try {
        lockerData = await Locker.find(function (err, locker) {
            if (err) {
                console.log(err)
            }
            return locker;
        })    
        if(!lockerData){
            throw new Error('No data')
        }else {
            return lockerData;
        }
    } catch (Error) {
        console.log('Opps, an error occurred', Error);
    }   
};

async function authenticate(req, res, callback) {
    var pat1 = /Basic ([0-9a-zA-Z]+)/g;
    var pat2 = /([0-9a-zA-Z]+):([0-9a-zA-Z]+)/g;
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
            callback(null, apiClient);
        } else {
            console.log(error);
            callback(error)
        }
    })
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   
/**
 * curl -i -X POST -H 'Content-Type: application/x-www-form-urlencoded' -d 'actioncode=StaffOpen&year=2009' "http://localhost:3000/api/v1/lockers?command=water&amount=2&test=3"
 * req.body = { actioncode: 'StaffOpen', year: '2009' } req.query = { command: 'water', amount: '2', test: '3' }
 * curl -i -X POST -H 'Content-Type: application/json' -d '{"actioncode": "StaffOpen", "year": "2009"}' "http://localhost:3000/api/v1/lockers?command=water&amount=2&test=3"
 * req.body = { actioncode: 'StaffOpen', year: '2009' } req.query = { command: 'water', amount: '2', test: '3' }
 */
exports.command = asyncMiddleware(async (req, res, next) =>  {
    try{
        authenticate(req, res, async function(err, apiClient) {
            if(err) {
                return res.status(400).send(err)
            } else if(!err && apiClient) {
                var ApiParameters = req.params,
                    ApiBody = req.body,
                    ApiQuery = req.query;
                console.log(ApiParameters);
                
                if (ApiParameters.action_code == "Open" ){
                    console.log("Initiate OpenMultiple");

                    nodeClient = getConn('Node');
                    // await sleep(150);
                    // lock(STATUS,0);                    
                    // nodeClient.write(hexVal);  

                    let status = false;
                    OnData.on('errorS', (data)=>{
                        status = true;
                        res.status(502).send({error: 'timedout', message: data})
                        OnData.removeAllListeners('errorS');
                        console.log("error post")
                    });

                    setTimeout(()=>{
                        if(status) return true;
                        // Clear the enevnt listener to void memory leaks
                        OnData.removeAllListeners('errorS'); 
                        if (TCPConnectionFlag) {
                            lock(STATUS,1);                    
                            nodeClient.write(hexVal);                       
                            res.status(200).json({
                                status: "success",
                                msg :'Receive action code'
                            });
                            logger.info("Retun success response", {
                                "sucess":true,
                                "msg": "Command receive"
                            })
                            TCPConnectionFlag = false;
                        }else{ 
                            res.status(502).send({error: 'Timeout, connection is not established'});
                            TCPConnectionFlag = false;
                            logger.error("Retun error response", {
                                "sucess":false,
                                "message": " timeout in two seconds"
                            })
                        }
                    }, 2000);
  
                    for (const property in ApiBody) {               
                        var OMLocker = lockerStatus.findIndex(status => {
                            // if (status.name == `${property}` && status.lock == !(`${ApiBody[property]}`)){
                            if (status.name == `${property}` /*& (status.empty)*/){
                                return true;                            
                            } else false;                    
                        });
                        console.log("Locker result: "+ OMLocker);
                               
                        lock(OPEN, OMLocker);                    
                        nodeClient.write(hexVal); 
                        await sleep(150);
                    }         
                    
                    // res.status(200).send('Receive action code');
                } else if (ApiParameters.action_code == "NewOutlet" ){
                    console.log("Initiate NewOutlet");
                    var locker = new Locker();
                    locker.outlet = ApiBody.outlet ;
                    locker.brand = ApiBody.brand;
                    locker.location = ApiBody.location;
                    locker.locker = lockerStatus;

                    nodeClient = getConn('Node');
                    CMD = 0x31;
                    ADDR = ApiBody.location;        
                    SUM = PREFIX + SUFFIX + CMD + ADDR;
                    bytesToSend = [PREFIX, ADDR, CMD, SUFFIX, SUM];
                    hexVal = new Uint8Array(bytesToSend);
                    console.log(hexVal);
                    nodeClient.write(hexVal);
                    // // save the contact and check for errors
                    // locker.save(function (err) {
                    //     res.status(200).send('Receive action code');
                    // });    
                    res.status(200).send('Receive action code');                              
                } else {
                    res.status(404).json({
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
});

// Handle view locker info
exports.view = asyncMiddleware(async (req, res, next) =>  {
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
            var name = 'name';
            var value = req.params.lockers_name;
            var query = {};
            query[locker] = value;
            Locker.findOne(query).exec().then((data) =>{
                res.json({
                    status:1,
                    message: 'Locker details loading..', 
                    data
                })
            })
            .catch(next);
        }
    })
});

/**
 * High 4 bit: Board(CU) No. Low 4 bit : No. of Box or Cell of Locker CU)
CMD: Classify Command language
0x30 : Request locker’s door open or close Status
0x31 : Request door open
0x32 : Get lock status and infrared sensor status(locker/cabinet status) of all CU boards on
the RS485 bus (Notice: For this command, address of CU board is a fixed value as F)
ADDR: High 4 bit: Board(CU) No. Low 4 bit : No. of Box or Cell of Locker CU)
*/
const OPEN = 0x01, ALL = 0x02;
const STATUS = 0x00;
const PREFIX = 0x02; // JavaScript allows hex numbers.
const SUFFIX = 0x03;
var CMD = 0x00;
var ADDR = 0x00;
var SUM = 0x37;
var bytesToSend = [PREFIX, ADDR, CMD, SUFFIX, SUM],
    hexVal = new Uint8Array(bytesToSend);
var response = {address:0, command:0, lock:0, present:0};
var lockerStatus = [
    {name: 'locker1', bitmask: 0x0100, lock: false, empty: false},
    {name: 'locker2', bitmask: 0x0200, lock: false, empty: false},
    {name: 'locker3', bitmask: 0x0400, lock: false, empty: false},
    {name: 'locker4', bitmask: 0x0800, lock: false, empty: false},
    {name: 'locker5', bitmask: 0x1000, lock: false, empty: false},
    {name: 'locker6', bitmask: 0x2000, lock: false, empty: false},
    {name: 'locker7', bitmask: 0x4000, lock: false, empty: false},
    {name: 'locker8', bitmask: 0x8000, lock: false, empty: false},
    {name: 'locker9', bitmask: 0x0001, lock: false, empty: false},
    {name: 'locker10', bitmask: 0x0002, lock: false, empty: false},
    {name: 'locker11', bitmask: 0x0004, lock: false, empty: false},
    {name: 'locker12', bitmask: 0x0008, lock: false, empty: false},
    {name: 'locker13', bitmask: 0x0010, lock: false, empty: false},
    {name: 'locker14', bitmask: 0x0020, lock: false, empty: false},
    {name: 'locker15', bitmask: 0x0040, lock: false, empty: false},
    {name: 'locker16', bitmask: 0x0080, lock: false, empty: false}
];

// This function create and return a net.Socket object to represent TCP client.
function getConn(connName){

    var option = {
        host:'192.168.33.178',
        port: 5000
    }

    // Create TCP client.
    var client = net.createConnection(option, function () {
        console.log('Connection name : ' + connName);
        console.log('Connection local address : ' + client.localAddress + ":" + client.localPort);
        console.log('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
        TCPConnectionFlag = true;
    });

    client.setTimeout(1000);
    client.setEncoding('hex');

    // When receive server send back data.
    client.on('data', async (data) => {
        console.log('Server return data : ' + data);
        lockerStatus = maskingCompare(data);
        // console.log(lockerStatus);
        // Locker.findOneAndUpdate({ outlet: 'outlet1'}, {locker: lockerStatus}, {useFindAndModify: false ,upsert: true}, (err) => {
        //     if(err) {
        //         console.log(err)
        //     } else {
        //         console.log("updated the locker sets database")
        //     }
        // })
        OnData.emit('code', lockerStatus);
        // newLockerData = await saveLocker();    
    });

    // When connection disconnected.
    client.on('end',function () {
        console.log('Client socket disconnect. ');
    });

    client.on('timeout', function () {
        msg = ' Client connection timeout. ';
        // OnData.emit('errorS', msg);
        TCPConnectionFlag = false;
        logger.error("Retun error response", {
            "sucess":false,
            "message": msg
        })
        console.log(msg);
    });

    client.on('error', function (err) {
        OnData.emit('errorS', JSON.stringify(err));
        console.error(JSON.stringify(err));
        logger.error("Retun error response", {
            "sucess":false,
            "message": JSON.stringify(err)
        })
        TCPConnectionFlag = false;
    });

    return client;
}

let saveLocker = async () =>{
    try {
        lockerData = await Locker.findOneAndUpdate({ outlet: 'outlet1'}, {locker: lockerStatus}, {useFindAndModify: false ,upsert: true, new: true}, (err) => {
            if(err) {
                console.log(err)
            } else {
                console.log("updated the locker sets database")
            }
        })
        if(!lockerData){
            throw new Error('No data')
        }else {
            return lockerData;
        }
    } catch (Error) {
        console.log('Opps, an error occurred', Error);
    }   
};

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
            empty: (objReceive & status.bitmask) == 0
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
        ADDR = (numbersLock) & 0x0F;        
        SUM = PREFIX + SUFFIX + CMD + ADDR;
        bytesToSend = [PREFIX, ADDR, CMD, SUFFIX, SUM];
        hexVal = new Uint8Array(bytesToSend);
   
    } else if (command == STATUS){
        CMD = 0x30;
        ADDR = (numbersLock) & 0x0F;
        SUM = PREFIX + SUFFIX + CMD + ADDR;
        bytesToSend = [PREFIX, ADDR, CMD, SUFFIX, SUM];
        hexVal = new Uint8Array(bytesToSend);
        
    }
}


// Create node client socket.
var nodeClient = getConn('Node');
test = lock(STATUS,1);
// maskingCompare('02003522810040037c');

// console.log(hexVal);
// lock(STATUS,2);
nodeClient.write(hexVal); 

function checkAvailability(arr, val) 
{
  return arr.some(
           function(arrVal) 
           {
             return val === arrVal;
           } );
}
