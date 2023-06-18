import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/system/Container';
import Box from '@mui/material/Box';

import { Navigate, useParams } from 'react-router-dom';
import { Grid, FormControl, Stack, TextField, Button } from '@mui/material';

import { CustomSnackbar } from '../Snackbar/CustomSnackbar'

export const QualityTest = () => {

    const { id, batchId } = useParams();
    const [snackbarParams, setSnackbarParams] = useState({
        severity: '',
        message: ''
    });
    const [quality, setQuality] = useState({
        hegmen: '',
        viscosity: '',
        density: ''
    });
    const [qualityTestDetails, setQualityTestDetails] = useState();
    const [qualityRanges, setQualityRanges] = useState();

    const [open, setOpen] = useState(false);
    const baseUrl = process.env.REACT_APP_API_URL;

    let navigate = useNavigate();

    useEffect(() => {
        const fetchProd = async () => {
            const res = await axios.get(`${baseUrl}/api/v1/prod/quality-details/${id}/${batchId}`);
            setQualityTestDetails(res.data);
            setQualityRanges(res.data.qualityRanges);
        }
        fetchProd();
    }, [])

    const handleChange = (e) => {
        setQuality({
            ...quality,
            [e.target.id]: e.target.value - 0
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${baseUrl}/api/v1/prod/batch/${id}`, {
                batch: batchId - 0,
                quality,
                stage: 'BucketFilling'
            });
            setOpen(true);
            setSnackbarParams({
                severity: 'success',
                message: 'Successfully saved quality test parameters'
            });
            navigate(`/screen/${id}/bktFill/${batchId}`);
        } catch (err) {
            console.log(err);
            setOpen(true);
            setSnackbarParams({
                severity: 'error',
                message: err.response.data.message
            });
        }
    }

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box component='div' marginBottom={1}>
                    <Box component='div'>PRODUCT - {qualityTestDetails?.name}</Box>
                    <Box component='div'>BATCH - {batchId}</Box>
                </Box>
                <Stack spacing={2}>
                    <Box component='span'>Quality Test : </Box>
                    <Box component='form' onSubmit={(e) => handleSubmit(e)}>
                        <Grid container rowSpacing={1} columns={{ xs: 4, sm: 8, md: 12 }} >
                            <Grid item xs={4}>
                                <FormControl>
                                    {/* <InputLabel htmlFor='hegmen'>Hegmen Gauge</InputLabel> */}
                                    <TextField
                                        required
                                        id='hegmen'
                                        label='Hegmen Gauge'
                                        type='number'
                                        value={qualityTestDetails?.quality?.hegmen}
                                        onChange={handleChange}
                                        helperText={`Acceptable Range: ${(qualityRanges?.qualityTestLimits?.hegmenRange?.from) ?? 1} - ${(qualityRanges?.qualityTestLimits?.hegmenRange?.to) ?? 7}`}
                                        sx={{ backgroundColor: 'white' }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl >
                                    {/* <InputLabel htmlFor='viscosity'>Viscosity</InputLabel> */}
                                    <TextField
                                        required
                                        id='viscosity'
                                        label='Viscosity'
                                        type='number'
                                        value={qualityTestDetails?.quality?.viscosity}
                                        onChange={handleChange}
                                        sx={{ backgroundColor: 'white' }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl>
                                    {/* <InputLabel htmlFor='density'>Density</InputLabel> */}
                                    <TextField
                                        required
                                        id='density'
                                        label='Density'
                                        type='number'
                                        value={qualityTestDetails?.quality?.density}
                                        onChange={handleChange}
                                        helperText={`Acceptable Range: ${(qualityRanges?.qualityTestLimits?.densityRange?.from) ?? 0.5} - ${(qualityRanges?.qualityTestLimits?.densityRange?.to) ?? 3}`}
                                        sx={{ backgroundColor: 'white' }}
                                        inputProps={{ step: 0.01 }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button variant='contained' color='info' type='submit' sx={{ width: 80 }}>Save</Button>
                    </Box>
                </Stack>
            </Container>
            <CustomSnackbar open={open} setOpen={setOpen} severity={snackbarParams.severity} message={snackbarParams.message} />
        </>
    )
}