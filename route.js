const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require('./config/winston');

var lockerController = require('./LockerController');
var scaleController = require('./ScaleController')
var paymentController = require('./PaymentController')

// Locker routes
router.route('/lockers/:action_code')
    .get(lockerController.index)
    .post(lockerController.command);
    
router.route('/locker/:lockers_name')
    .get(lockerController.view);

// router.param('lockers_id', function(request, response, next, lockersId) {
//     // Fetch the element by its ID (elementId) from a database
//     // Narrow down the search when request.story is provided
//     // Save the found element object into request object
//     console.log(lockersId);
// });

// Scale routes
router.route('/scale/:action_code')
    .get(scaleController.index);
    
router.route('/scales/:action_code')
    .get(scaleController.view);

// Payment routes
router.route('/payment/:action_code')
    .get(paymentController.index)
    .post(paymentController.command);

router.route('/payment/:action_code')
    .get(paymentController.view);

var options = {
    // customCss: '.swagger-ui .topbar { display: none }'
};
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument,options));
  
router.use(morgan('combined', { 
    stream: logger.stream 
    }
));

// Error Handler
// centralized error handler - note how it has four parameters
router.use(function(err, req, res, next) {
    var someErrorMessage = "Internal error here"
    // formulate an error response here
    console.log(err);
    res.status(500).send(someErrorMessage)
});

 module.exports = router

 