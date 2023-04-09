import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactToPrint from 'react-to-print';

export const BatchReportPrintHelper = () => {
    const componentRef = useRef();

    return (
        <div style={{ paddingBottom: '40px' }}>
            <BatchReport ref={componentRef}/>
            <ReactToPrint 
                trigger={() => <Container><Button style={{ marginLeft: '180px', marginTop: '30px' }} variant="contained">Print</Button></Container>}
                content={() => componentRef.current}
            />
        </div>
    )
}

export const BatchReport = React.forwardRef(({}, ref) => {  
    const { id, batchId } = useParams();
    // const componentRef = useRef();
    // const [prod, setProd] = useState({});
    const [batchReport, setBatchReport] = useState({})
    const baseUrl = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const fetchBatch = async () => {
            const res = await axios.get(`${baseUrl}/api/v1/reports/batch/${id}/${batchId}`);
            setBatchReport(res.data.batchReport);
        }
        fetchBatch();
    }, []);

    // let productionDate = ((new Date(batchReport?.updatedAt)).toLocaleDateString("en-GB", {
    //     day: "2-digit",
    //     month: "2-digit",
    //     year: "numeric",
    //     hour: "2-digit",
    //     minute: "2-digit"
    // }) ?? "");

    let productionDate = (new Date(batchReport?.updatedAt)).toLocaleString();


    const tableStyle = {
        border: "1px solid black",
        borderCollapse: "collapse",
        width: "85%",
        margin: "0 auto",
        marginTop: "2em"
    }

    const cellStyle = {
        border: "1px solid black",
        borderCollapse: "collapse",
        padding: "15px",
        textAlign: "left"
    }

    const batchQty = {
        kg: (batchReport?.productionDetails?.qty / batchReport?.productionDetails?.totalBatches).toFixed(2),
        ltr: ((batchReport?.productionDetails?.qty / batchReport?.productionDetails?.totalBatches) / batchReport?.quality?.density).toFixed(2),
    }

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2, fontSize: '22px' }} ref={ref}>
                <Box style={{ display: 'flex', width: '794px', height: '1123px', backgroundColor: 'white', margin: '0 auto' }}>
                    <Box style={{ flexGrow: 1, }} >
                        <div style={{ marginLeft: '60px', marginTop: '40px', fontWeight: 'bold', fontSize: '27px' }}>Batch Report - {batchReport?.labelDetails?.labelId}</div>
                        <table style={tableStyle}>
                            <tbody>
                                <tr>
                                    <th style={cellStyle}>Product Name: </th>
                                    <td style={cellStyle}>{batchReport?.labelDetails?.productLabelName}</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Product ID: </th>
                                    <td style={cellStyle}>{batchReport?.productionDetails?.name}</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Date of Production: </th>
                                    <td style={cellStyle}>{productionDate}</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Batch ID: </th>
                                    <td style={cellStyle}>{batchReport?.labelDetails?.labelId}</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Serial Batch No: </th>
                                    <td style={cellStyle}>{`${batchReport?.batch}/${batchReport?.productionDetails?.totalBatches}`}</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Appearance: </th>
                                    <td style={cellStyle}>{batchReport?.labelDetails?.colorShade}</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Quantity: </th>
                                    <td style={cellStyle}>{batchQty?.kg} kg / {batchQty?.ltr} L</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Density: </th>
                                    <td style={cellStyle}>{batchReport?.quality?.density}</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Viscosity: </th>
                                    <td style={cellStyle}>{batchReport?.quality?.viscosity}</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Hegmen Gauge: </th>
                                    <td style={cellStyle}>{batchReport?.quality?.hegmen}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{ marginLeft: '60px', marginTop: '120px',width: '250px', }}>
                        <div style={{ height: '150px', border: '1px solid black' }}></div>
                        <div style={{ marginTop: '17px', width: 'fit-content', margin: '0 auto'}}>Sample</div>
                        </div>
                    </Box>
                </Box>
            </Container>
        </>
    )
});

