const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select('-password').lean();
        if(!users?.length) {
            return res.status(400).json({message: 'No users found'});
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

const createUser = async(req, res) => {
    try {
        const { name, email, password, roles } = req.body;
        if(!name || !email || !password || !Array.isArray(roles) || roles.length === 0) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        const user = await userModel.findOne({ email });
        if(user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ name, email, password: hashedPassword, roles });
        res.status(200).json(newUser);
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateUser = async(req, res) => {
    try {
        const { id, name, email, password, roles, active } = req.body;
        if(!id || !email || !Array.isArray(roles) || roles.length === 0 || typeof active !== 'boolean') {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        const user = await userModel.findById(id);
        if(!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const duplicate = await userModel.findOne({ email });
        if(duplicate && duplicate?._id.toString() !== id) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        user.email = email;
        user.name = name;
        user.roles = roles;
        user.active = active;
        if(password) {
            user.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteUser = async(req, res) => {
    try {
        const { id } = req.body;
        if(!id) {
            return res.status(400).json({ message: 'User ID required' });
        }
        const user = await userModel.findById(id);
        if(!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const result = await user.deleteOne();
        res.status(200).json({ message: `User ${result.email} with ID ${result._id} deleted successfully` });
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}