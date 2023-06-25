import { useState, useEffect, useMemo } from 'react'
import { Container, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { CustomSnackbar } from '../Snackbar/CustomSnackbar';

const StockInventory = () => {

    const baseUrl = process.env.REACT_APP_API_URL;
    const [pageSize, setPageSize] = useState(100);
    const [allBoqQty, setAllBoqQty] = useState([]);
    const [sbOpen, setSbOpen] = useState(false);
    const [sbParams, setSbParams] = useState({
        severity: '',
        message: ''
    });

    useEffect(() => {
        const fetchBoqQty = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/reports/stock-inventory`);
                setAllBoqQty(res.data.stockInventory);
            } catch (err) {
                console.error(err);
                setSbOpen(true);
                setSbParams({
                    severity: 'error',
                    message: err.response.data.message
                })
            }
        }
        fetchBoqQty();
    }, [])

    const columns = useMemo(() => [
        { field: '_id', type: 'string', headerName: 'BOQ Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'totalQty', type: 'number', headerName: 'Total quantity (kg)', flex: 1, headerAlign: 'center', align: 'center' },
    ]);

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>Stock Inventory :</Box>
                </Box>
                <Box style={{ display: 'flex', height: '80vh', width: '100%', backgroundColor: 'white' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <DataGrid
                            // autoHeight
                            getRowId={(materials) => materials._id}
                            rows={allBoqQty}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: '_id', sort: 'asc' }],
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Container>
            <CustomSnackbar open={sbOpen} setOpen={setSbOpen} severity={sbParams.severity} message={sbParams.message} />
        </>
    )
}

export default StockInventory