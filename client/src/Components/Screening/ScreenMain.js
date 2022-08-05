import React , { useState, useEffect, useMemo }from 'react';
import axios from 'axios';
import Container from '@mui/system/Container';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';

export const ScreenMain = () => {

    let navigate = useNavigate();

    const [pageSize, setPageSize] = useState(10);
    const [productions, setProductions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/prod');
                setProductions(res.data.productions);
            } catch(err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    const columns = useMemo(() => [
        { field: 'name', type: 'string', headerName: 'Product Name', minWidth: 150, flex: 0.25 },
        { field: 'qty', type: 'number', headerName: 'Quantity', minWidth: 100 },
        { field: 'pack_size', type: 'number', headerName: 'Pack Size', minWidth: 100 },
        { field: 'desc', type: 'string', headerName: 'Remarks', flex: 1 },
        {
            field: 'createdAt',
            type: 'date',
            headerName: 'Date added',
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
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    // icon={<Button size='small' variant='contained' color='warning'>Start</Button>}
                    icon={<PlayArrowIcon color='success'/>}
                    label="Start"
                    onClick={() => {
                        console.log(params.row.name);
                        navigate(`/screen/${params.id}`);
                    }}
                />,
            ]
        }
    ], []);

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>List of screening :</Box>
                </Box>
                <Box style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: 'white' }}>
                    <Box style={{ flexGrow: 1 }}>
                        <DataGrid
                            autoHeight
                            getRowId={(prod) => prod._id}
                            rows={productions}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        />
                    </Box>
                </Box>
            </Container>
        </>
    )
}