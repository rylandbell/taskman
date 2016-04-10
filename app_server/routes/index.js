var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET list of all tasks */
router.get('/', ctrlMain.list);
router.get('/list',ctrlMain.list);

/* GET task details page */
router.get('/details', ctrlMain.details);

module.exports = router;
