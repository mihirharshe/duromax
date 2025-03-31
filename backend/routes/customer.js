const express = require('express');
const router = express.Router();
const { getCustomers, addCustomer, updateCustomer, deleteCustomer } = require('../controllers/customer.controller');


router.get('/', async (req, res) => {
    await getCustomers(req, res);
})

router.post('/', async (req, res) => {
    await addCustomer(req, res);
})

router.put('/:id', async (req, res) => {
    await updateCustomer(req, res);
})

router.delete('/:id', async (req, res) => {
    await deleteCustomer(req, res);
})

module.exports = router;