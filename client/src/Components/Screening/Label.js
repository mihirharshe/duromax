import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useBarcode } from 'next-barcode';
import FinalLabel from './FinalLabel';
import ReactToPrint from 'react-to-print'

const Label = () => {

    const { id, batchId } = useParams();

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const [prod, setProd] = useState({});

    useEffect(() => {
        const fetchProd = async () => {
            const res = await axios.get(`http://localhost:5124/api/v1/prod/${id}`);
            setProd(res.data.production);
        }
        fetchProd();
    }, [])

    const [colorShade, setColorShade] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [labelDetails, setLabelDetails] = useState({});

    const handleChange = (e) => {
        setColorShade(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("submitted");
        setLoading(true);
        let bktQty = prod.batches[batchId - 1].bucketDetails[batchId - 1].bktQty;
        let density = prod.batches[batchId - 1].quality.density;
        const res = await axios.post(`http://localhost:5124/api/v1/prod/generate-label/${id}/${batchId}`, {
            labelDetails: {
                qtyKg: bktQty ?? null,
                qtyL: bktQty / density,
                colorShade
            }
        })
        if (res.status === 200) {
            setLoading(false);
            // let bktQty = prod.batches[batchId-1].bucketDetails.bktQty;
            // let density = prod.batches[batchId-1].quality.density; 
            setIsLoaded(true);
            setLabelDetails({
                labelId: res.data.labelDetails.labelId,
                product: prod.name,
                colorShade: res.data.labelDetails.colorShade,
                qtyKg: res.data.labelDetails.qtyKg,
                qtyL: res.data.labelDetails.qtyL,
            });
            console.log(labelDetails);
        }
    }

    // const { inputRef } = useBarcode({
    //     value: labelDetails.labelId
    // })

    const componentRef = useRef();

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }} >
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>Enter details for the label: </Box>
                </Box>
                <Box component='form' onSubmit={(e) => handleSubmit(e)}>
                    <Item elevation={3}>
                        <Grid container alignItems="center" justifyContent="space-around">
                            <Typography variant='h6'>Color Shade</Typography>
                            <FormControl sx={{ m: 1 }}>
                                <TextField
                                    autoFocus="autoFocus"
                                    name="colorShade"
                                    label="Color Shade"
                                    type="text"
                                    variant="outlined"
                                    required
                                    defaultValue={colorShade || ""}
                                    onChange={e => handleChange(e)}
                                />
                            </FormControl>
                        </Grid>
                    </Item>
                    <Button type="submit" variant="contained">SUBMIT</Button>
                </Box>
                <div>
                    {isLoaded && 
                        <>
                            <FinalLabel ref={componentRef} labelDetails={labelDetails} batchId={batchId} />
                            <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                                <ReactToPrint
                                    trigger={() => <Button variant="contained">Print</Button>}
                                    content={() => componentRef.current}
                                    
                                />
                            </div>
                        </>
                    }
                </div>
                {/* <svg ref={inputRef} /> */}
            </Container>
        </>
    )
}

export default Label