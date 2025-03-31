import React, { useState, useEffect, useMemo } from 'react';
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

export const BucketSales = () => {
    const [allStocks, setAllStocks] = useState([]);
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchSoldInventory = async () => {
            let res = await axios.get(`${baseUrl}/api/v1/reports/sold-inventory`);
            setAllStocks(res.data.inventoryBuckets);
        }
        fetchSoldInventory();
    }, [])

    const [pageSize, setPageSize] = useState(100);

    const columns = useMemo(() => [
        { field: 'labelId', type: 'string', headerName: 'Bucket ID', flex: 1, headerAlign: 'center', align: 'center'},
        { field: 'boqName', type: 'string', headerName: 'BOQ Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'prodName', type: 'string', headerName: 'Product Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'colorShade', type: 'string', headerName: 'Color Shade', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'bktQty', type: 'number', headerName: 'Qty (kg)', minWidth: 100, headerAlign: 'center', align: 'center' },
        { 
            field: 'customer',
            type: 'string', 
            headerName: 'Customer', 
            flex: 1, 
            headerAlign: 'center', 
            align: 'center',
            valueGetter: (params) => params.row.customer?.name || '-'
        },
        {
            field: 'soldTime',
            type: 'date',
            headerName: 'Date of Sale',
            minWidth: 175,
            valueFormatter: (params) => {
                if(!params.value)
                    return "-";
                return new Date(params.value).toLocaleString().replace(',', '');
            },
            headerAlign: 'center', 
            align: 'center'
        }
    ])

    return (
        <Container maxWidth='lg' sx={{ marginTop: 2 }}>
            <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                <Box component='span'>Bucket Sales :</Box>
            </Box>
            <Box style={{ display: 'flex', height: '80vh', width: '100%', backgroundColor: 'white' }}>
                <Box sx={{ flexGrow: 1 }}>
                    <DataGrid
                        getRowId={(materials) => materials._id}
                        rows={allStocks}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                        rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'soldTime', sort: 'desc' }],
                            }
                        }}
                    />
                </Box>
            </Box>
        </Container>
    )
} 