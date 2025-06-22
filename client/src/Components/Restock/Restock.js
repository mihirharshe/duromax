import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import axios from 'axios';
import { CustomSnackbar } from '../Snackbar/CustomSnackbar';

export const Restock = () => {
    const [labelId, setLabelId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [bucketState, setBucketState] = useState('sealed');
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: '',
        message: ''
    });
    const baseUrl = process.env.REACT_APP_API_URL;

    const handleRestock = async (e) => {
        e.preventDefault();

        try {
            if (bucketState === 'sealed') {
                const response = await axios.put(`${baseUrl}/api/v1/stock-out/restock/sealed/${labelId}`);
                setSnackbar({
                    open: true,
                    severity: 'success',
                    message: response.data.message
                });
                setLabelId(''); // Clear input after successful restock
            } else {
                const response = await axios.post(`${baseUrl}/api/v1/stock-out/restock/unsealed`, {
                    labelId: labelId,
                    quantity: parseFloat(quantity)
                });
                setSnackbar({
                    open: true,
                    severity: 'success',
                    message: response.data.message || 'Unsealed bucket restock process initiated.'
                });
                setLabelId('');
                setQuantity('');
            }
        } catch (err) {
            setSnackbar({
                open: true,
                severity: 'error',
                message: err.response?.data?.message || 'An error occurred while restocking'
            });
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600 }}>
            <h2>Restock Buckets</h2>

            <form onSubmit={handleRestock}>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <FormLabel component="legend">Bucket State</FormLabel>
                    <RadioGroup
                        row
                        value={bucketState}
                        onChange={(e) => {
                            setBucketState(e.target.value);
                            setLabelId('');
                            setQuantity('');
                        }}
                    >
                        <FormControlLabel value="sealed" control={<Radio />} label="Sealed" />
                        <FormControlLabel value="unsealed" control={<Radio />} label="Unsealed" />
                    </RadioGroup>
                </FormControl>

                <TextField
                    fullWidth
                    label="Label ID"
                    value={labelId}
                    onChange={(e) => setLabelId(e.target.value)}
                    margin="normal"
                    required
                />

                {bucketState === 'unsealed' && (
                    <TextField
                        fullWidth
                        label="Quantity (kg)"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        margin="normal"
                        required
                        inputProps={{ step: "any" }}
                    />
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={!labelId || (bucketState === 'unsealed' && !quantity)}
                >
                    Restock Bucket
                </Button>
            </form>

            <CustomSnackbar
                open={snackbar.open}
                setOpen={(open) => setSnackbar(prev => ({ ...prev, open }))}
                severity={snackbar.severity}
                message={snackbar.message}
            />
        </Box>
    );
};
