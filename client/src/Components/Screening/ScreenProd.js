import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/system/Container';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';

export const ScreenProd = () => {

    const { id } = useParams();

    const [selectedProduct, setSelectedProduct] = useState([]);
    const [prodBoq, setProdBoq] = useState([]);

    useEffect(() => {
        const fetchProd = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/prod/${id}`);
                setSelectedProduct(res.data.production);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchProd();
    }, []);

    console.log(selectedProduct);

    useEffect(() => {
        if(selectedProduct.name) {
            const fetchBoq = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/boq/name/${selectedProduct.name}`);
                    setProdBoq(res.data.boq);
                }
                catch (err) {
                    console.log(err);
                }
            }
            fetchBoq();
        }
    }, [selectedProduct]);

    console.log(prodBoq);



    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>SCREENING : {selectedProduct.name}</Box>
                </Box>
                <Box style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: 'white' }}>
                    {/* <Box style={{ flexGrow: 1 }}>
                        <DataGrid
                            autoHeight
                            getRowId={(prod) => prod._id}
                            rows={productions}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        />
                    </Box> */}
                </Box>
            </Container>
        </>
    )
}