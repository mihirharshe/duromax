const customerModel = require('../models/customer.model');

const getCustomers = async (req, res) => {
    const customers = await customerModel.find({});
    res.status(200).json({ customers });
}

const addCustomer = async (req, res) => {
    try {
        const { name, address, contact, email, gstNumber } = req.body;
        const customer = new customerModel({
            name,
            address,
            contact,
            email,
            gstNumber
        });
        await customer.save();
        res.status(201).json({
            message: 'Successfully added customer',
            customer
        });
    } catch(err) {
        res.status(400).json({
            message: 'Failed to add customer',
            error: err.message
        });
    }
}

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, contact, email, gstNumber } = req.body;
        const customer = await customerModel.findByIdAndUpdate(
            id,
            { name, address, contact, email, gstNumber },
            { new: true }
        );
        res.status(200).json({ customer });
    } catch(err) {
        res.status(400).json({
            message: 'Failed to update customer',
            error: err.message
        });
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await customerModel.findById(id);
        await customer.remove();
        res.status(200).json({ message: 'Successfully deleted customer' });
    } catch(err) {
        res.status(400).json({
            message: 'Failed to delete customer',
            error: err.message
        });
    }
}

module.exports = {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
}

