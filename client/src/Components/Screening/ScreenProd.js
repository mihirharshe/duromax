import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/system/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';

export const ScreenProd = () => {

    const { id } = useParams();

    const [selectedProduct, setSelectedProduct] = useState([]);
    const [prodBoq, setProdBoq] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(0);

    const handleSelectBatch = (e, batchNumber) => {
        setSelectedBatch(batchNumber);
    }

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
        if (selectedProduct.name) {
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

    const batch_size = prodBoq.batch_size;
    const prodQty = selectedProduct.qty;

    const batchCount = Math.ceil(prodQty / batch_size);

    console.log(prodQty, batch_size, batchCount);


    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>PRODUCT : {selectedProduct.name}</Box>
                </Box>
                Choose your batch :
                <Box style={{ display: 'flex', height: '100%', width: '100%'}}>
                    {/* {batchCount ?
                        [...Array(batchCount)].map((_, i) => (
                            <Button variant="contained" key={i} sx={{ marginRight: 2 }}>batch {i + 1}</Button>
                        ))
                    : <CircularProgress />} */}
                    <ToggleButtonGroup 
                        value={selectedBatch} 
                        onChange={handleSelectBatch}
                        exclusive
                        sx={{backgroundColor: 'white'}}
                    >
                        {batchCount ?
                            [...Array(batchCount)].map((_, i) => (
                                <ToggleButton key={i} value={i + 1}>batch {i + 1}</ToggleButton>
                            ))
                        : null}
                    </ToggleButtonGroup>
                </Box>
            </Container>
        </>
    )
}