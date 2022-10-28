var express = require('express');
var router = express.Router();
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser } = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/verifyJWT');

router.use(verifyJWT);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/all', async (req, res) => {
    await getAllUsers(req, res);
});

router.post('/register', async (req, res) => {
    await createUser(req, res);
});

router.put('/update', async (req, res) => {
    await updateUser(req, res);
});

router.delete('/delete', async (req, res) => {
    await deleteUser(req, res);
});

module.exports = router;
