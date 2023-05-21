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
    // const [currentBkt, setCurrentBkt] = useState({
    //     bucketId: "",
    //     bktNo: 0,
    //     qtyChange: 0
    // });

    const [bucketData, setBucketData] = useState({});
    let updates = [];

    useEffect(() => {
        const fetchBkts = async () => {
            const res = await axios.get(`${baseUrl}/api/v1/bkt`);
            setBuckets(res.data.buckets);
        }
        fetchBkts();
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

        Object.entries(bucketData).map(data => {
            if(!data[1]["bktNo"] || !data[1]["bktQty"] || data[1]["bktNo"] == 0 || data[1]["bktQty"] == 0) return;
            let obj = {
                bktId: data[0],
                bktNo: parseInt(data[1]["bktNo"]),
                bktQty: parseInt(data[1]["bktQty"])
            };
            if(!updates.some(el => el.bktId === obj.bktId))
                updates.push(obj);
        });

        const res = await axios.put(`${baseUrl}/api/v1/prod/add-bkts/${id}/${batchId}`, {
            bucketDetails: updates,
            stage: 'Labelling'
        });
        if(res.status === 200) {
            setOpen(true);
            navigate(`/screen/${id}/label/${batchId}`)
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
            <CustomSnackbar open={open} setOpen={setOpen} severity="success" message="Bucket details saved successfully" />
        </div>
    )
}