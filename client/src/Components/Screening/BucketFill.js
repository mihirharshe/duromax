import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomSnackbar } from '../Snackbar/CustomSnackbar';



export const BucketFill = () => {

    const { id, batchId } = useParams();
    let navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL;

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const [open, setOpen] = useState(false);
    const [buckets, setBuckets] = useState([]);
    const [batchCount, setBatchCount] = useState();
    const [sbParams, setSbParams] = useState({
        severity: '',
        message: ''
    });
    // const [currentBkt, setCurrentBkt] = useState({
    //     bucketId: "",
    //     bktNo: 0,
    //     qtyChange: 0
    // });

    const [bucketData, setBucketData] = useState({});

    useEffect(() => {
        const fetchBkts = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/bkt`);
                setBuckets(res.data.buckets);
            } catch (err) {
                console.error(err);
                setSbParams({
                    severity: 'error',
                    message: err.response.data.message
                });
                setOpen(true);
            }
        }
        fetchBkts();
        const fetchBatchCount = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/prod/batch/count/${id}`);
                setBatchCount(res.data.batchCount);
            } catch (err) {
                console.error(err);
                setSbParams({
                    severity: 'error',
                    message: err.response.data.message
                })
                setOpen(true);
            }
        }
        fetchBatchCount();
    }, [])

    const handleBlur = (e, id) => {
        e.preventDefault();

        setBucketData(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [e.target.name]: e.target.value
            }
        }));

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updates = Object.entries(bucketData)
            .filter(([bktId, data]) => {
                return data?.bktNo && data?.bktQty && data.bktNo != 0 && data.bktQty != 0;
            })
            .map(([bktId, data]) => ({
                bktId: bktId,
                bktNo: parseInt(data.bktNo, 10),
                bktQty: parseFloat(data.bktQty)
            }));

        if (updates.length === 0) {
            setSbParams({
                severity: 'warning',
                message: 'No valid bucket data entered.'
            });
            setOpen(true);
            return;
        }

        try {
            await axios.put(`${baseUrl}/api/v1/prod/add-bkts/${id}/${batchId}`, {
                bucketDetails: updates,
                stage: 'Labelling'
            });
            setOpen(true);
            setSbParams({
                severity: 'success',
                message: 'Bucket details saved successfully'
            });
            if (batchCount == batchId) {
                await axios.put(`${baseUrl}/api/v1/prod/status/${id}`, { status: 'Completed' });
            }
            navigate(`/screen/${id}/label/${batchId}`)
        } catch (err) {
            console.error(err);
            setSbParams({
                severity: 'error',
                message: err.response.data.message
            });
            setOpen(true);
        }
    }

    return (
        <div>
            <Container maxWidth='lg' sx={{ marginTop: 2 }} >
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>BucketFill: </Box>
                </Box>
                <Box component='form' onSubmit={(e) => handleSubmit(e)}>
                    <Stack spacing={1}>
                        {/* <Grid container alignItems="center" justifyContent="center"> */}
                        {buckets.map((item, id) => (
                            <Item elevation={3} key={id}>
                                <Grid container alignItems="center" justifyContent="space-around">
                                    <Typography variant='h6'>{item.name}</Typography>
                                    <FormControl sx={{ m: 1 }}>
                                        <TextField
                                            name="bktNo"
                                            label="No. of buckets"
                                            type="number"
                                            variant="outlined"
                                            defaultValue={bucketData[item._id]?.bktNo || ""}
                                            onBlur={e => handleBlur(e, item._id)}
                                            InputProps={{
                                                inputProps: {
                                                    min: 0
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormControl sx={{ m: 1 }}>
                                        <TextField
                                            name="bktQty"
                                            label="Qty of bucket (in kgs)"
                                            type="number"
                                            variant="outlined"
                                            defaultValue={bucketData[item._id]?.bktQty || ""}
                                            onBlur={e => handleBlur(e, item._id)}
                                        />
                                    </FormControl>
                                </Grid>
                            </Item>
                        ))}
                        {/* <Grid item xs={12} md={3}>
                            <FormControl sx={{ m: 1 }}>
                                <TextField
                                    id="bktNo"
                                    label="No. of buckets"
                                    type="number"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl sx={{ m: 1 }}>
                                <TextField
                                    id="bktQty"
                                    label="Quantity of bucket (in kgs)"
                                    type="number"
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid> */}
                        {/* </Grid> */}
                    </Stack>
                    <Button type="submit" variant="contained">SUBMIT</Button>
                </Box>
            </Container>
            <CustomSnackbar open={open} setOpen={setOpen} severity={sbParams.severity} message={sbParams.message} />
        </div>
    )
}