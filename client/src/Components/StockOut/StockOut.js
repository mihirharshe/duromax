import axios from 'axios';
import { useState, useEffect } from 'react'
import { Container, Paper, FormControl, Grid, TextField, Box, InputLabel, Typography, Button, Select, MenuItem, Autocomplete } from '@mui/material';
import { CustomSnackbar } from '../Snackbar/CustomSnackbar';

const StockOut = () => {

    const baseUrl = process.env.REACT_APP_API_URL;

    const [stockOutParams, setStockOutParams] = useState({
        labelId: '',
        soldTo: '',
        units: ''
    });

    const [sbOpen, setSbOpen] = useState(false);
    const [snackbarParams, setSnackbarParams] = useState({
        severity: '',
        message: ''
    });

    const [availableUnits, setAvailableUnits] = useState();
    const [isAvailableUnitsLoaded, setAvailableUnitsLoaded] = useState(false);

    const [scannedStocks, setScannedStocks] = useState([]);

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/customers`);
                setCustomers(response.data.customers);
            } catch (err) {
                setSnackbarParams({
                    severity: 'error',
                    message: err?.response?.data?.message || 'Failed to fetch customers'
                });
                setSbOpen(true);
            }
        };
        fetchCustomers();
    }, []);

    const handleChange = (e) => {
        setStockOutParams(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    // const handleLabelSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    // const res = await axios.get(`${baseUrl}/api/v1/stock-out/available-stock/${stockOutParams.labelId}`);
    //         setAvailableUnits(res.data.availableUnits);
    //         setAvailableUnitsLoaded(true);
    //     } catch (err) {
    // console.log(err);
    // setAvailableUnitsLoaded(false);
    // setSnackbarParams({
    //     severity: 'error',
    //     message: err.response.data.message
    // })
    //     }
    // }

    const [units, setUnits] = useState({});

    const handleUnitChange = (labelId, e) => {
        const newUnits = { ...units };
        newUnits[labelId] = e.target.value;
        setUnits(newUnits);
    }

    const handleLabelSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`${baseUrl}/api/v1/stock-out/available-stock/${stockOutParams.labelId}`);
            const scannedDetails = {
                labelId: res.data.labelId,
                prodName: res.data.prodName,
                boqName: res.data.boqName,
                colorShade: res.data.colorShade,
                qty: res.data.qty,
                availableUnits: res.data.availableUnits
            }
            const labelIdExists = scannedStocks.some(item => item.labelId === scannedDetails.labelId);
            if (labelIdExists) {
                throw new Error(`Stock with Label ID: ${scannedDetails.labelId} has already been scanned.`)
            }
            setScannedStocks(prev => [...prev, scannedDetails]);
        } catch (err) {
            setAvailableUnitsLoaded(false);
            setSbOpen(true);
            setSnackbarParams({
                severity: 'error',
                message: err?.response?.data?.message || err.message
            })
        }
    }

    const removeStock = (labelId) => {
        const updatedStocks = scannedStocks.filter(stock => stock.labelId !== labelId);
        setScannedStocks(updatedStocks);
    }
    const handleStockOut = async (e) => {
        e.preventDefault();
        let isValid = true;
        scannedStocks.forEach(stock => {
            const inputUnits = Number(units[stock.labelId]) || 0;
            if (inputUnits <= 0 || inputUnits > stock.availableUnits) {
                isValid = false;
                return;
            }
        });

        if (!isValid) {
            setSnackbarParams({
                severity: 'error',
                message: 'Please enter valid number of units for all stocks'
            });
            setSbOpen(true);
            return;
        }
        try {
            const data = scannedStocks.map(stock => ({
                labelId: stock.labelId,
                units: Number(units[stock.labelId]) || 0,
                boqName: stock.boqName,
                prodName: stock.prodName,
                colorShade: stock.colorShade,
                qty: stock.qty
            }));
            const res = await axios.post(`${baseUrl}/api/v1/stock-out`, {
                scannedStocks: data,
                customerId: stockOutParams.soldTo
            });
            setSnackbarParams({
                severity: 'success',
                message: res.data.message
            });
            setSbOpen(true);
            setScannedStocks([]);
        } catch (err) {
            setSnackbarParams({
                severity: 'error',
                message: err?.response?.data?.message || 'Something went wrong'
            });
            setSbOpen(true);
        }
    }
    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }} >
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>Enter details for stock out</Box>
                </Box>
                <Box component='form' onSubmit={(e) => handleLabelSubmit(e)}>
                    <Paper elevation={3}>
                        <Grid container alignItems="center" padding={2}>
                            <Grid item xs={3}>
                                <Typography variant='h6'>Label ID</Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <TextField
                                        autoFocus
                                        name="labelId"
                                        id="labelId"
                                        label="Label ID"
                                        type="text"
                                        variant="outlined"
                                        required
                                        defaultValue={stockOutParams.labelId || ""}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Button type="submit" variant="contained">SUBMIT</Button>
                </Box>
                <Box component='form' onSubmit={(e) => handleStockOut(e)}>
                    {scannedStocks.map((stock, index) => (
                        <div key={index}>
                            <p>Label ID: {stock.labelId}</p>
                            <p>Product Name: {stock.prodName}</p>
                            <p>BOQ Name: {stock.boqName}</p>
                            <p>Color Shade: {stock.colorShade}</p>
                            <p>Quantity: {stock.qty} kg</p>
                            <p>Available Units: {stock.availableUnits}</p>
                            <TextField
                                label="Units to stock out"
                                value={units[stock.labelId] || ''}
                                onChange={(event) => handleUnitChange(stock.labelId, event)}
                            />
                            <div style={{ marginTop: 15 }}><Button variant="contained" color="error" onClick={() => removeStock(stock.labelId)}>Remove</Button></div>
                            <hr />
                        </div>
                    ))}
                    {scannedStocks.length > 0 &&
                        <>
                            <div>
                                <Typography variant='h6'>Customer</Typography>
                                <FormControl sx={{ m: 1 }} fullWidth>
                                    <Autocomplete
                                        options={customers}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(event, newValue) => {
                                            setStockOutParams(prev => {
                                                const updatedState = {
                                                    ...prev,
                                                    soldTo: newValue ? newValue._id : ''
                                                };
                                                return updatedState;
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Search Customer"
                                                required
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </FormControl>
                            </div>
                            <div>
                                <Button 
                                    type="submit" 
                                    variant="contained"
                                    disabled={!stockOutParams.soldTo}
                                >
                                    STOCK OUT
                                </Button>
                            </div>
                        </>
                    }
                </Box>
                {/* {isAvailableUnitsLoaded &&
                    <Box component='form' onSubmit={(e) => handleStockOut(e)}>
                        <Paper elevation={3}>
                            <Grid container alignItems="center" padding={2}>
                                <Grid item xs={3}>
                                    <Typography variant='h6'>Number of units</Typography>
                                    <FormControl sx={{ m: 1 }}>
                                        <TextField
                                            name="units"
                                            id="units"
                                            label="Units to stock out"
                                            type="number"
                                            variant="outlined"
                                            helperText={isAvailableUnitsLoaded && `Available units: ${availableUnits}`}
                                            required
                                            defaultValue={stockOutParams.units || ""}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant='h6'>Customer</Typography>
                                    <FormControl sx={{ m: 1 }}>
                                        <TextField
                                            name="soldTo"
                                            id="soldTo"
                                            label="Customer"
                                            type="text"
                                            variant="outlined"
                                            helperText=' '
                                            required
                                            defaultValue={stockOutParams.soldTo || ""}
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Button type="submit" variant="contained">STOCK OUT</Button>
                    </Box>} */}
            </Container>
            <CustomSnackbar open={sbOpen} setOpen={setSbOpen} severity={snackbarParams.severity} message={snackbarParams.message} />
        </>
    )
}

export default StockOut