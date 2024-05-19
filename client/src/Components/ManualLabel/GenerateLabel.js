import { useState, useEffect } from 'react'
import { Container, Paper, FormControl, Grid, TextField, Box, InputLabel, Typography, Button, Select, MenuItem } from '@mui/material';
import FinalLabel from '../Screening/FinalLabel';

const GenerateLabel = () => {

    const [labelDetails, setLabelDetails] = useState({
        qtyKg: 0,
        qtyL: 0,
        labelId: '',
    });

    const [commonLabel, setCommonLabel] = useState({
        name: '',
        colorShade: '',
        batchNo: '',
        part: '',
        updatedAt: ''
    });

    const [isLoaded, setIsLoaded] = useState(false);

    const handleChange = (e) => {
        setLabelDetails(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleCLChange = (e) => {
        setCommonLabel(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoaded(true);

    }

    return (
        <div>
            <Container maxWidth='lg' sx={{ marginTop: 2 }} >
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>Enter details for the label: </Box>
                </Box>
                <Box component='form' onSubmit={(e) => handleSubmit(e)}>
                    <Paper elevation={3}>
                        <Grid container alignItems="center" padding={2}>
                            <Grid item xs={3}>
                                <Typography variant='h6'>Product Name </Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <TextField
                                        // autoFocus="autoFocus"
                                        key="nameField"
                                        name="name"
                                        id="name"
                                        label="Product Name"
                                        type="text"
                                        variant="outlined"
                                        required
                                        defaultValue={commonLabel.name || ""}
                                        onChange={e => handleCLChange(e)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
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
                                        defaultValue={commonLabel.colorShade || ""}
                                        onChange={e => handleCLChange(e)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='h6'>Batch No</Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <TextField
                                        // autoFocus="autoFocus"
                                        key="batchNo"
                                        name="batchNo"
                                        id="batchNo"
                                        label="Batch No"
                                        type="text"
                                        variant="outlined"
                                        required
                                        defaultValue={commonLabel.batchNo || ""}
                                        onChange={e => handleCLChange(e)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='h6'>Qty KG</Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <TextField
                                        // autoFocus="autoFocus"
                                        key="qtyKg"
                                        name="qtyKg"
                                        id="qtyKg"
                                        label="Qty in kg"
                                        type="text"
                                        variant="outlined"
                                        required
                                        defaultValue={labelDetails.qtyKg || ""}
                                        onChange={e => handleChange(e)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='h6'>Qty Ltr</Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <TextField
                                        // autoFocus="autoFocus"
                                        key="qtyL"
                                        name="qtyL"
                                        id="qtyL"
                                        label="Qty in L"
                                        type="text"
                                        variant="outlined"
                                        required
                                        defaultValue={labelDetails.qtyL || ""}
                                        onChange={e => handleChange(e)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='h6'>Label ID</Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <TextField
                                        // autoFocus="autoFocus"
                                        key="labelId"
                                        name="labelId"
                                        id="labelId"
                                        label="Label ID"
                                        type="text"
                                        variant="outlined"
                                        required
                                        defaultValue={labelDetails.labelId || ""}
                                        onChange={e => handleChange(e)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='h6'>Part</Typography>
                                <FormControl sx={{ m: 1 }} fullWidth>
                                    {/* <TextField
                                        // autoFocus="autoFocus"
                                        key="part"
                                        name="part"
                                        id="part"
                                        label="Part"
                                        type="text"
                                        variant="outlined"
                                        required
                                        defaultValue={commonLabel.part || ""}
                                        onChange={e => handleCLChange(e)}
                                    /> */}
                                    <InputLabel id="part">Select Part</InputLabel>
                                    <Select
                                        labelId="part"
                                        id="part"
                                        name="part"
                                        value={commonLabel.part}
                                        label="Part"
                                        required
                                        onChange={e => handleCLChange(e)}
                                    >
                                        <MenuItem value="A">A</MenuItem>
                                        <MenuItem value="B">B</MenuItem>
                                        <MenuItem value="C">C</MenuItem>
                                        <MenuItem value="D">D</MenuItem>
                                        <MenuItem value="SINGLE">SINGLE</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='h6'>Mfg. Date</Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <TextField
                                        // autoFocus="autoFocus"
                                        key="date"
                                        name="updatedAt"
                                        id="updatedAt"
                                        label="Mfg. Date (DD/MM/YYYY)"
                                        type="text"
                                        variant="outlined"
                                        required
                                        value={commonLabel.updatedAt}
                                        onChange={e => handleCLChange(e)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='h6'>MRP</Typography>
                                <FormControl sx={{ m: 1 }}>
                                    <TextField
                                        // autoFocus="autoFocus"
                                        key="mrp"
                                        name="mrp"
                                        id="mrp"
                                        label="MRP (₹)"
                                        type="number"
                                        variant="outlined"
                                        value={commonLabel.mrp}
                                        onChange={e => handleCLChange(e)}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Button type="submit" variant="contained">SUBMIT</Button>
                </Box>
                {isLoaded && <div>
                    <Grid container alignItems="center" justifyContent="space-around">
                        {
                            <div>
                                <FinalLabel labelDetails={labelDetails} batchId={labelDetails.batchId} commonLabel={commonLabel} manualLabel={true}/>
                            </div>
                        }
                    </Grid>
                </div>}
                {/* {isLoaded && <Button sx={{ display: 'flex', margin: '50px auto 0 auto' }} variant="contained" onClick={() => navigate(`/reports/batch/${id}/${batchId}`)}>NEXT</Button>} */}
                {/* <svg ref={inputRef} /> */}
            </Container>
        </div>
    )
}

export default GenerateLabel