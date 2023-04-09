import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useBarcode } from 'next-barcode';
import FinalLabel from './FinalLabel';

const Label = () => {

    const { id, batchId } = useParams();
    let navigate = useNavigate();
    // const Item = styled(Paper)(({ theme }) => ({
    //     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    //     ...theme.typography.body2,
    //     padding: theme.spacing(1),
    //     textAlign: 'center',
    //     color: theme.palette.text.secondary,
    // }));

    const [prod, setProd] = useState({});
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchProd = async () => {
            const res = await axios.get(`${baseUrl}/api/v1/prod/${id}`);
            setProd(res.data.production);
        }
        fetchProd();
    }, [])
    const [inputLabelDetails, setInputLabelDetails] = useState({
        colorShade: '',
        productLabelName: ''
    });
    // const [colorShade, setColorShade] = useState("");
    // const [productLabelName, setProductLabelName] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [labelDetails, setLabelDetails] = useState([{}]);
    const [commonLabel, setCommonLabel] = useState({});

    // const handleChange = (e) => {
    //     setColorShade(e.target.value);
    // }

    const handleChange = (e) => {
        setInputLabelDetails(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputLabelDetails);
        setLoading(true);
        // let bktQty = prod.batches[batchId - 1].bucketDetails[batchId - 1].bktQty;
        // let density = prod.batches[batchId - 1].quality.density;
        const res = await axios.post(`${baseUrl}/api/v1/prod/bktlabels/${id}/${batchId}`, {
            labelDetails: inputLabelDetails
        })
        if (res.status === 200) {
            setLoading(false);
            setIsLoaded(true);
            // setLabelDetails({
            //     labelId: res.data.labelDetails.labelId,
            //     product: prod.name,
            //     colorShade: res.data.labelDetails.colorShade,
            //     qtyKg: res.data.labelDetails.qtyKg,
            //     qtyL: res.data.labelDetails.qtyL,
            // });
            let reducedBktDetails = res.data.bucketDetails.reduce((acc, curr) => {
                acc.push(curr.bktLabelDetails);
                return acc;
            }, [])
            setLabelDetails(reducedBktDetails);
            setCommonLabel({
                name: res.data.productLabelName,
                colorShade: res.data.colorShade,
                batchNo: res.data.batchNo
            });
        }
    }

    // const { inputRef } = useBarcode({
    //     value: labelDetails.labelId
    // })
    console.log(labelDetails)
    // const componentRef = useRef();

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }} >
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>Enter details for the label: </Box>
                </Box>
                <Box component='form' onSubmit={(e) => handleSubmit(e)}>
                    <Paper elevation={3}>
                        <Grid container alignItems="center" justifyContent="space-around">
                            <Typography variant='h6'>Product Name </Typography>
                            <FormControl sx={{ m: 1 }}>
                                <TextField
                                    // autoFocus="autoFocus"
                                    key="nameField"
                                    name="productLabelName"
                                    id="productLabelName"
                                    label="Product Name"
                                    type="text"
                                    variant="outlined"
                                    required
                                    defaultValue={inputLabelDetails.productLabelName || ""}
                                    onChange={e => handleChange(e)}
                                />
                            </FormControl>
                            <Typography variant='h6'>Color Shade</Typography>
                            <FormControl sx={{ m: 1 }}>
                                <TextField
                                    // autoFocus="autoFocus"
                                    key="colorField"
                                    name="colorShade"
                                    id="colorShade"
                                    label="Color Shade"
                                    type="text"
                                    variant="outlined"
                                    required
                                    defaultValue={inputLabelDetails.colorShade || ""}
                                    onChange={e => handleChange(e)}
                                />
                            </FormControl>
                        </Grid>
                    </Paper>
                    <Button type="submit" variant="contained">SUBMIT</Button>
                </Box>
                <div>
                    <Grid container alignItems="center" justifyContent="space-around">
                        {isLoaded &&
                            labelDetails.map((label, index) => {
                                return (
                                    <div>
                                        <FinalLabel key={index} labelDetails={label} batchId={batchId} commonLabel={commonLabel} />
                                    </div>
                                )
                            })
                        }
                    </Grid>
                </div>
                {isLoaded && <Button sx={{display: 'flex', margin: '50px auto 0 auto'}} variant="contained" onClick={() => navigate(`/reports/batch/${id}/${batchId}`)}>NEXT</Button>}
                {/* <svg ref={inputRef} /> */}
            </Container>
        </>
    )
}

export default Label