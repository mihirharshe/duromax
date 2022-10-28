const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        const user = await userModel.findOne({ email }); 
        if(!user) {
            return res.status(401).json({ message: 'User does not exist' });
        }
        if(!user.active) { 
            return res.status(401).json({ message: 'Your account has been disabled. Please contact the administrator.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign(
            { 
                "UserInfo": { 
                    "id": user._id,
                    "name": user.name,
                    "email": user.email,
                    "roles": user.roles
                }
            }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '15s' }
        ); 
        const refreshToken = jwt.sign( 
            { email: user.email },  
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '1d' } 
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // prevents client side javascript from reading the cookie
            sameSite: 'none', // prevents CSRF attacks
            // secure: true, // only send the cookie over https
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({ accessToken });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if(!cookies?.refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const refreshToken = cookies.refreshToken;
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if(err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const user = await userModel.findOne({ email: decoded.email });
            if(!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const accessToken = jwt.sign(
                { 
                    "UserInfo": { 
                        "id": user._id,
                        "name": user.name,
                        "email": user.email,
                        "roles": user.roles
                    }
                }, 
                process.env.ACCESS_TOKEN_SECRET, 
                { expiresIn: '15s' }
            );
            res.status(200).json({ accessToken });
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

const handleLogout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if(!cookies?.refreshToken) {
            return res.sendStatus(204);
        }
        res.clearCookie('refreshToken', {
            httpOnly: true, 
            sameSite: 'none', 
            // secure: true 
        });
        res.status(200).json({ message: 'Logged out' });
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    handleLogin,
    handleRefreshToken,
    handleLogout
}