const express = require('express');
const router = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var lockerController = require('./LockerController');
var scaleController = require('./ScaleController')
var paymentController = require('./PaymentController')

// Locker routes
router.route('/lockers/:action_code/outlet/:outlet_id')
    .get(lockerController.index)
    .post(lockerController.command);
    
router.route('/lockers/:lockers_id/outlet/:outlet_id')
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
    
router.route('/scale/:action_code')
    .get(scaleController.view);

// Payment routes
router.route('/payment/:action_code')
    .get(paymentController.index)
    .post(paymentController.command);

router.route('/payment/:action_code')
    .get(paymentController.view);


router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
// Error Handler
// centralized error handler - note how it has four parameters
router.use(function(err, req, res, next) {
    var someErrorMessage = "Testing 12344 error here"
    // formulate an error response here
    console.log(err);
    res.status(500).send(someErrorMessage)
});

 module.exports = router

 