var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/rm', require('./rawMaterial'));
router.use('/bkt', require('./bucket'));
router.use('/boq', require('./boqMain'));
router.use('/adj-rm', require('./adjRM'));
router.use('/adj-bkt', require('./adjBkt'));
router.use('/prod', require('./productionInsert'));
router.use('/reports', require('./reports'));

router.use('/users', require('./users'));
router.use('/auth', require('./auth'));

module.exports = router;
