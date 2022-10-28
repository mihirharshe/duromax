const express = require('express');
const router = express.Router();
const {
    handleLogin,
    handleRefreshToken,
    handleLogout
} = require('../controllers/auth.controller');
const loginLimiter = require('../middlewares/loginLimiter');

router.post('/login', loginLimiter, async (req, res) => {
    await handleLogin(req, res);
});

router.get('/refresh-token', async (req, res) => {
    await handleRefreshToken(req, res);
});

router.post('/logout', async (req, res) => {
    await handleLogout(req, res);
});

module.exports = router;