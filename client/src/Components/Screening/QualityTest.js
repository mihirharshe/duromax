import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Container from '@mui/system/Container';
import Box from '@mui/material/Box';

import { useParams } from 'react-router-dom';
import { Grid, FormControl, Stack, TextField, Button } from '@mui/material';

import { CustomSnackbar } from '../Snackbar/CustomSnackbar'

export const QualityTest = () => {

    const { id, batchId } = useParams();
    const [productDetails, setProductDetails] = useState({});
    // const [batchDetails, setBatchDetails] = useState({});
    const [quality, setQuality] = useState({
        hegmen: '',
        viscosity: '',
        density: ''
    });

    const [open , setOpen] = useState(false);

    console.log(batchId);
    useEffect(() => {
        const fetchProd = async () => {
            const res = await axios.get(`http://localhost:5000/api/v1/prod/${id}`)
            setProductDetails(res.data.production);
            console.log(res);
            if(res.data.production.batches[batchId - 1].quality) {
                setQuality(res.data.production.batches[batchId - 1].quality);
            }
            // setBatchDetails(res.data.production.batches[batchId - 1]);
            // console.log(batchDetails);
        }
        fetchProd();
    }, [])

    const handleChange = (e) => {
        setQuality({
            ...quality,
            [e.target.id]: e.target.value - 0
        })
    }

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/v1/prod/batch/${id}`, {
                batch: batchId - 0,
                quality
            });
            setOpen(true);
        } catch(err) {
            console.log(err);
        }
    }

    console.log(quality);


    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box component='div' marginBottom={1}>
                    <Box component='div'>PRODUCT - {productDetails.name}</Box>
                    <Box component='div'>BATCH - {batchId}</Box>
                </Box>
                <Stack spacing={2}>
                    <Box component='span'>Quality Test : </Box>
                    <Grid container rowSpacing={1} columns={{ xs: 4, sm: 8, md: 12 }} >
                        <Grid item xs={4}>
                            <FormControl>
                                {/* <InputLabel htmlFor='hegmen'>Hegmen Gauge</InputLabel> */}
                                <TextField
                                    id='hegmen'
                                    label='Hegmen Gauge'
                                    type='number'
                                    value={quality.hegmen}
                                    onChange={handleChange}
                                    required
                                    sx={{ backgroundColor: 'white'}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl>
                                {/* <InputLabel htmlFor='viscosity'>Viscosity</InputLabel> */}
                                <TextField
                                    id='viscosity'
                                    label='Viscosity'
                                    type='number'
                                    value={quality.viscosity}
                                    onChange={handleChange}
                                    required
                                    sx={{ backgroundColor: 'white'}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl>
                                {/* <InputLabel htmlFor='density'>Density</InputLabel> */}
                                <TextField
                                    id='density'
                                    label='Density'
                                    type='number'
                                    value={quality.density}
                                    onChange={handleChange}
                                    required
                                    sx={{ backgroundColor: 'white'}}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button variant='contained' color='info' onClick={handleSubmit} sx={{ width: 80 }}>Save</Button>
                </Stack>
            </Container>
            <CustomSnackbar open={open} setOpen={setOpen} severity="success" message="Quality Test saved successfully" />
        </>
    )
}