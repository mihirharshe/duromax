import React, { useState, useEffect, useMemo } from 'react'
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AdjBktReport = () => {
    const { id } = useParams();

    const [bktLC, setBktLC] = useState([]);
    const [pageSize, setPageSize] = useState(100);
    const [bktName, setBktName] = useState('');

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchAdjBkt = async () => {
            const res = await axios.get(`${baseUrl}/api/v1/reports/buckets/${id}`, { validateStatus: false });
            if (res.status == 404)
                setBktLC([]);
            else {
                setBktLC(res.data.bkt);
                setBktName(res.data.bkt[0].name);
            }
        }
        fetchAdjBkt();
    }, [])

    const columns = useMemo(() => [
        { field: 'name', type: 'string', headerName: 'Name', flex: 0.25, headerAlign: 'center', align: 'center' },
        { field: 'description', type: 'string', headerName: 'Description', flex: 0.25, headerAlign: 'center', align: 'center' },
        { field: 'qtyChange', type: 'number', headerName: 'Qty adjusted', minWidth: 100, headerAlign: 'center', align: 'center' },
        {
            field: 'createdAt',
            type: 'date',
            headerName: 'Date created',
            minWidth: 175,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleString().replace(',', '');
            },
            headerAlign: 'center',
            align: 'center'
        },
        { field: 'action', type: 'string', headerName: 'Operation', width: 120, headerAlign: 'center', align: 'center' }
    ], []);

    return (
        <Container maxWidth='lg' sx={{ marginTop: 2 }}>
            <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                <Box component='span'>BUCKETS LIFECYCLE: {bktName}</Box>
                {/* <Button size='small' variant='contained' onClick={handleDialogOpen}>Add item</Button> */}
            </Box>
            {/* <Box style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: 'white', margin: '0 auto' }}>
                <Box style={{ display: 'flex', flexGrow: 1 }} >

                    <DatePicker
                        label="Pick a date"
                        value={value}
                        onChange={(newValue) => pickDate(newValue)}
                    />
                    <Button variant="contained" onClick={findSales}>SUBMIT</Button>
                </Box>
            </Box> */}
            <Box style={{ display: 'flex', width: '100%', height: '80vh', backgroundColor: 'white', margin: '0 auto' }}>
                <Box style={{ display: 'flex', flexGrow: 1 }} >
                    <DataGrid
                        // autoHeight
                        getRowId={(item) => item._id}
                        rows={bktLC}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                        rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        sx={{ backgroundColor: 'white' }}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'createdAt', sort: 'desc' }],
                            }
                        }}
                    />
                </Box>
            </Box>


        </Container>
    )
}

export default AdjBktReport