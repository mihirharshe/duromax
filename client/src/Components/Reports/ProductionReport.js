import React, { useState, useEffect } from 'react'
import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProductionReport = () => {
    const { id } = useParams();

    const [prod, setProd] = useState({});
    useEffect(() => {
        const fetchProd = async () => {
            const res = await axios.get(`http://localhost:5124/api/v1/prod/${id}`);
            setProd(res.data.production);
        }
        fetchProd();
    }, []);

    let createdDate = ((new Date(prod?.createdAt)).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }) ?? "");


    const tableStyle = {
        border: "1px solid black",
        borderCollapse: "collapse",
        width: "100%"
    }

    const cellStyle = {
        border: "1px solid black",
        borderCollapse: "collapse",
        padding: "5px",
        textAlign: "left"
    }

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: 'white' }}>
                    <Box style={{ flexGrow: 1 }}>
                        ProductionReport
                        <table style={tableStyle}>
                            <tr>
                                <th style={cellStyle}>Name: </th>
                                <td style={cellStyle}>{prod?.name || ""}</td>
                            </tr>
                            <tr>
                                <th style={cellStyle}>Quantity: </th>
                                <td style={cellStyle}>{prod?.qty || ""}</td>
                            </tr>
                            <tr>
                                <th style={cellStyle}>Production Date: </th>
                                <td style={cellStyle}>{createdDate}</td>
                            </tr>
                        </table>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default ProductionReport