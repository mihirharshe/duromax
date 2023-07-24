import React, { useState, useEffect } from 'react'
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RawMaterialReport = () => {

    let navigate = useNavigate();

    const [pageSize, setPageSize] = useState(100);
    const [rawMaterials, setRawMaterials] = useState([]);
    // const [selectedRM, setSelectedRM] = useState();
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchRMReport = async () => {
            let res = await axios.get(`${baseUrl}/api/v1/reports/raw-materials`);
            setRawMaterials(res.data.rmReport);
        }

        fetchRMReport();
    }, [])

    const handleOpenAdj = (name) => {
        navigate(`/reports/raw-materials/${name}`)
        // console.log(name)
    }

    const columns = [
        { field: 'name', type: 'string', headerName: 'RM', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'totalQty', type: 'number', headerName: 'Total Qty(kg)', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'usedQty', type: 'number', headerName: 'Used Qty(kg)', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'stockQty', type: 'number', headerName: 'Stock Qty(kg)', flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    // setSelectedRM(params.row.name);
                    handleOpenAdj(params.row.name);
                };

                return <Button variant='contained' onClick={onClick}>Adjustments</Button>
            },
            headerAlign: 'center', align: 'center'
        }
    ]

    return (
        <Container maxWidth='lg' sx={{ marginTop: 2 }}>
            <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                <Box component='span'>RAW MATERIALS REPORT</Box>
            </Box>
            <Box style={{ display: 'flex', width: '100%', height: '80vh', backgroundColor: 'white', margin: '0 auto' }}>
                <Box style={{ display: 'flex', flexGrow: 1 }} >
                    <DataGrid
                        // autoHeight
                        getRowId={(rawMaterials) => rawMaterials._id}
                        rows={rawMaterials}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                        rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>
            </Box>
        </Container>
    )
}

export default RawMaterialReport