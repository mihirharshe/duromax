import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const BatchReportsTable = () => {
    const [batchReports, setBatchReports] = useState([]);
    const [pageSize, setPageSize] = useState(100);

    let navigate = useNavigate();

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchBatchReports = async () => {
            const res = await axios.get(`${baseUrl}/api/v1/reports/batch`);
            if (res.status == 200)
                setBatchReports(res.data.batchReports);
        }
        fetchBatchReports();
    }, [])

    const columns = useMemo(() => [
        { field: 'prodName', type: 'string', headerName: 'Product Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'boqName', type: 'string', headerName: 'BOQ Name', flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'updatedAt',
            type: 'date',
            headerName: 'Production Date',
            minWidth: 175,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleString().replace(',', '');
            },
            headerAlign: 'center',
            align: 'center'
        },
        { 
            field: 'batch', 
            type: 'number', 
            headerName: 'Label ID', 
            flex: 0.5,
            headerAlign: 'center', 
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {params.value}
                </Box>
            ),
        },
        { field: 'colorShade', type: 'string', headerName: 'Color Shade', width: 120, headerAlign: 'center', align: 'center' },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 125,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    navigate(`/reports/batch/${params.row.productionId}/${params.row.batch}`)
                };
                return <Button variant='contained' onClick={onClick}>SHOW</Button>
            }
        }
    ], []);


    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>BATCH REPORTS</Box>
                </Box>
                <Box style={{ display: 'flex', width: '100%', height: '80vh', backgroundColor: 'white', margin: '0 auto' }}>
                    <Box style={{ display: 'flex', flexGrow: 1 }} >
                        <DataGrid
                            // autoHeight
                            getRowId={(rawMaterials) => rawMaterials._id}
                            rows={batchReports}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                            sx={{ backgroundColor: 'white', '& .MuiDataGrid-cell': { padding: '8px 16px'} }}
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'updatedAt', sort: 'desc' }],
                                }
                            }}
                            getRowHeight={() => 'auto'}
                        />
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default BatchReportsTable