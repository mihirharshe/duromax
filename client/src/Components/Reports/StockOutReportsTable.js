import { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import { Container, Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const StockOutReportsTable = () => {

    const baseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [stockReports, setStockReports] = useState([]);
    const [pageSize, setPageSize] = useState(100);

    useEffect(() => {
        const fetchStockReports = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/reports/stock-out`);
                setStockReports(res.data.stockReports)
            } catch (err) {
                console.error(err);
            }
        }
        fetchStockReports();
    }, []);

    const columns = useMemo(() => [
        { field: 'transactionId', type: 'string', headerName: 'Transaction ID', flex: 0.25, headerAlign: 'center', align: 'center' },
        { field: 'customer', type: 'string', headerName: 'Customer', flex: 0.25, headerAlign: 'center', align: 'center' },
        {
            field: 'createdAt',
            type: 'date',
            headerName: 'Date of sale',
            minWidth: 175,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleString().replace(',', '');
            },
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    // navigate(`/reports/batch/${params.row.productionId}/${params.row.batch}`)
                    console.log(params);
                    navigate(`/reports/stock-out/${params.row.transactionId}`, { state: params.row });
                };
                return <Button variant='contained' onClick={onClick}>SHOW</Button>
            }
        }
    ], []);

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>STOCK REPORTS</Box>
                </Box>
                <Box style={{ display: 'flex', width: '100%', height: '80vh', backgroundColor: 'white', margin: '0 auto' }}>
                    <Box style={{ display: 'flex', flexGrow: 1 }} >
                        <DataGrid
                            // autoHeight
                            getRowId={(row) => row._id}
                            rows={stockReports}
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
        </>
    )
}

export default StockOutReportsTable