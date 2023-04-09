import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const SalesReport = () => {

    let currDate = dayjs(new Date()).format('YYYY-MM-DD');
    const [value, setValue] = useState(dayjs(currDate).locale('en-gb'));
    const [queryDate, setQueryDate] = useState(currDate);
    // useEffect(() => {
    //     setQueryDate(currDate);
    // }, [])   
    const [is404, set404] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const baseUrl = process.env.REACT_APP_API_URL;

    const [soldBuckets, setSoldBuckets] = useState([]);

    const pickDate = (newValue) => {
        setValue(newValue);
        console.log(dayjs(newValue).format('YYYY-MM-DD'))
        setQueryDate(dayjs(newValue).format('YYYY-MM-DD'));
    }

    // console.log(soldBuckets, is404, value)

    const findSales = async () => {
        if (!queryDate) {
            console.log('returned');
            return;
        }
        let res = await axios.get(`${baseUrl}/api/v1/reports/sales?date=${queryDate}`, { validateStatus: false });
        console.log(res)
        if(res.status == 404) {
            set404(true);
            setSoldBuckets([])
        }
        else {
            set404(false);
            setSoldBuckets(res.data.sales);
        }
    }

    const columns = [
        { field: 'batchId', type: 'string', headerName: 'Batch ID', flex: 1 },
        { field: 'boqName', type: 'string', headerName: 'BOQ Name', flex: 1 },
        { field: 'prodName', type: 'string', headerName: 'Product Name', flex: 1 },
        { field: 'bktQty', type: 'number', headerName: 'Qty (kg)', minWidth: 100 },
    ]

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
            <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>SALES REPORT</Box>
                    {/* <Button size='small' variant='contained' onClick={handleDialogOpen}>Add item</Button> */}
                </Box>
                <Box style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: 'white', margin: '0 auto' }}>
                    <Box style={{ display:'flex', flexGrow: 1}} >

                        <DatePicker
                            label="Pick a date"
                            value={value}
                            onChange={(newValue) => pickDate(newValue)}
                        />
                        <Button variant="contained" onClick={findSales}>SUBMIT</Button>
                    </Box>
                </Box>
                {/* {is404 ? "No sales found for the above date" :  */}
                    <DataGrid 
                        autoHeight
                        getRowId={(soldBuckets) => soldBuckets._id}
                        rows={soldBuckets}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                        rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        sx={{ backgroundColor: 'white' }}
                    />

                {/* } */}
            </Container>
        </>
    )
}

export default SalesReport