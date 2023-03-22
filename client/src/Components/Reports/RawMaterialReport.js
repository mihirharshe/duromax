import React, { useState, useEffect } from 'react'
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RawMaterialReport = () => {

    let navigate = useNavigate();

    const [pageSize, setPageSize] = useState(10);
    const [rawMaterials, setRawMaterials] = useState([]);
    // const [selectedRM, setSelectedRM] = useState();

    useEffect(() => {
        const fetchRMReport = async () => {
            let res = await axios.get(`http://localhost:5124/api/v1/reports/raw-materials`);
            setRawMaterials(res.data.rmReport);
        }

        fetchRMReport();
    }, [])

    const handleOpenAdj = (name) => {
        navigate(`/reports/raw-materials/${name}`)
        // console.log(name)
    }

    const columns = [
        { field: 'name', type: 'string', headerName: 'RM', flex: 1 },
        { field: 'totalQty', type: 'number', headerName: 'Total Qty', flex: 1 },
        { field: 'usedQty', type: 'number', headerName: 'Used Qty', flex: 1 },
        { field: 'stockQty', type: 'number', headerName: 'Stock Qty', flex: 1 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    console.log(params.row);
                    // setSelectedRM(params.row.name);
                    handleOpenAdj(params.row.name);
                };

                return <Button variant='contained' onClick={onClick}>Adjustments</Button>
            }
        }
    ]

    return (
        <Container maxWidth='lg' sx={{ marginTop: 2 }}>
            <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                <Box component='span'>RAW MATERIALS REPORT</Box>
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

            <DataGrid
                autoHeight
                getRowId={(rawMaterials) => rawMaterials._id}
                rows={rawMaterials}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                sx={{ backgroundColor: 'white' }}
            />


        </Container>
    )
}

export default RawMaterialReport