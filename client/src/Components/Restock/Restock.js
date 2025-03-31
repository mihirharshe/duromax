import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import axios from 'axios';
import { CustomSnackbar } from '../Snackbar/CustomSnackbar';

export const Restock = () => {
    const [labelId, setLabelId] = useState('');
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
                // Handle unsealed bucket case in the future
                setSnackbar({
                    open: true,
                    severity: 'info',
                    message: 'Restocking unsealed buckets is not yet implemented'
                });
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
                        onChange={(e) => setBucketState(e.target.value)}
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

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={!labelId}
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
