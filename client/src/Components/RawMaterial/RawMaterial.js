import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import axios from 'axios';
import { Container } from '@mui/system';

export const RawMaterial = () => {
    const [materials, setMaterials] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/rm');
                setMaterials(res.data.rawMaterials);
            } catch(err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    console.log(materials);

    // const rows = [
    //     { id: 1, col1: 'Hello', col2: 'World' },
    //     { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    //     { id: 3, col1: 'MUI', col2: 'is Amazing' },
    // ];
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1},
        { field: 'qty', headerName: 'Quantity', },
        { field: 'alertQty', headerName: 'Alert Quantity'},
    ];

    return (
        <Container>
            <Box>
                List of raw materials :
            </Box>
            <Box style={{ display: 'flex', height: '100%' }}>
                <Box style={{ flexGrow: 1 }}>
                    <DataGrid autoHeight getRowId={(materials) => materials._id} rows={materials} columns={columns} />
                </Box>
            </Box>
        </Container>
    );
}