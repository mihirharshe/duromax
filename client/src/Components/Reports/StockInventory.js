import React, { useState, useEffect, useMemo } from 'react';
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';


export const StockInventory = () => {

    const [allStocks, setAllStocks] = useState([]);

    useEffect(() => {
        const fetchStockInventory = async () => {
            let res = await axios.get('http://localhost:5124/api/v1/reports/inventory-bkts');
            setAllStocks(res.data.inventoryBuckets);
        }
        fetchStockInventory();
    }, [])

    const [pageSize, setPageSize] = useState(10);
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
        let res = await axios.put(`http://localhost:5124/api/v1/reports/sell-bkt/${selectedBucketId}`);
        if(res.status == 200) {
            // selectedBucketId -> change sold false to true in allStocks
            // allStocks.find(bucket => bucket)
            handleClose();
        }
    }

    const columns = useMemo(() => [
        { field: 'batchId', type: 'string', headerName: 'Batch ID', flex: 1 },
        { field: 'boqName', type: 'string', headerName: 'BOQ Name', flex: 1 },
        { field: 'prodName', type: 'string', headerName: 'Product Name', flex: 1 },
        { field: 'bktQty', type: 'number', headerName: 'Qty (kg)', minWidth: 100 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 200,
            // getActions: (params) => [
            //     <GridActionsCellItem 
            //         icon={<Button />}
            //         label="SELL"
            //         // onClick={handleEdit(params.row)}
            //     />,
            //     // <GridActionsCellItem
            //     //     icon={<DeleteIcon />}
            //     //     label="Delete"
            //     //     onClick={deleteItem(params.id)}
            //     // />
            // ]
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    console.log(params.row);
                    setSelectedBucketId(params.row._id);
                    handleClickOpen();
                };

                return params.row.sold ?
                    <Button variant="contained" disabled>SOLD</Button> :
                    <Button variant='contained' onClick={onClick}>SELL</Button>
            }
        }
    ])

    console.log(allStocks);
    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>Stock Inventory :</Box>
                </Box>
                <Box style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: 'white' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <DataGrid
                            autoHeight
                            getRowId={(materials) => materials._id}
                            rows={allStocks}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
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

