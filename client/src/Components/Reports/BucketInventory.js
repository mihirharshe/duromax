import React, { useState, useEffect, useMemo } from 'react';
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';


export const BucketInventory = () => {

    const [allStocks, setAllStocks] = useState([]);
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchStockInventory = async () => {
            let res = await axios.get(`${baseUrl}/api/v1/reports/inventory-bkts`);
            setAllStocks(res.data.inventoryBuckets);
        }
        fetchStockInventory();
    }, [])

    const [pageSize, setPageSize] = useState(100);
    const [selectedBucketId, setSelectedBucketId] = useState('');

    // sell button dialog box settings -
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setSelectedBucketId('');
        setOpen(false);
    };
    const sellBucket = async () => {
        let res = await axios.put(`${baseUrl}/api/v1/reports/sell-bkt/${selectedBucketId}`);
        if(res.status == 200) {
            // selectedBucketId -> change sold false to true in allStocks
            let idx = allStocks.findIndex(bucket => bucket._id === selectedBucketId);
            if (idx != -1) {
                const updatedStocks = [...allStocks];
                updatedStocks[idx] = res.data.updatedBucket;
                setAllStocks(updatedStocks);
            }
            handleClose();
        }
    }

    const columns = useMemo(() => [
        { field: 'labelId', type: 'string', headerName: 'Bucket ID', flex: 1, headerAlign: 'center', align: 'center'},
        { field: 'boqName', type: 'string', headerName: 'BOQ Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'prodName', type: 'string', headerName: 'Product Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'colorShade', type: 'string', headerName: 'Color Shade', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'bktQty', type: 'number', headerName: 'Qty (kg)', minWidth: 100, headerAlign: 'center', align: 'center' },
        // {
        //     field: 'soldTime',
        //     type: 'date',
        //     headerName: 'Date of Sale',
        //     minWidth: 175,
        //     valueFormatter: (params) => {
        //         if(!params.value)
        //             return "-";
        //         return new Date(params.value).toLocaleString().replace(',', '');
        //     },
        //     headerAlign: 'center', 
        //     align: 'center'
        // },
        {
            field: 'createdAt',
            type: 'date',
            headerName: 'Date of creation',
            minWidth: 175,
            valueFormatter: (params) => {
                if(!params.value)
                    return "-";
                return new Date(params.value).toLocaleString().replace(',', '');
            },
            headerAlign: 'center', 
            align: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     headerName: 'Actions',
        //     width: 200,
        //     renderCell: (params) => {
        //         const onClick = (e) => {
        //             e.stopPropagation();
        //             setSelectedBucketId(params.row._id);
        //             handleClickOpen();
        //         };

        //         return params.row.sold ?
        //             <Button variant="contained" disabled>SOLD</Button> :
        //             <Button variant='contained' onClick={onClick}>SELL</Button>
        //     }
        // }
    ])

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>Bucket Inventory :</Box>
                </Box>
                <Box style={{ display: 'flex', height: '80vh', width: '100%', backgroundColor: 'white' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <DataGrid
                            // autoHeight
                            getRowId={(materials) => materials._id}
                            rows={allStocks}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'createdAt', sort: 'desc' }],
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Container>


            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to sell?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action is irreversible
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={sellBucket}>YES</Button>
                    <Button onClick={handleClose} autoFocus>
                        NO
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

