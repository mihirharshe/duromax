import { Container, Paper, FormControl, Grid, TextField, Box, Stack, Typography, Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ReactToPrint from 'react-to-print';

export const StockReportPrintHelper = () => {
    const componentRef = useRef();

    return (
        <div style={{ paddingBottom: '40px' }}>
            <StockOutReport ref={componentRef} />
            <ReactToPrint
                trigger={() => <Container><Button style={{ marginLeft: '180px', marginTop: '30px' }} variant="contained">Print</Button></Container>}
                content={() => componentRef.current}
            />
        </div>
    )
}

export const StockOutReport = React.forwardRef(({ }, ref) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const { transactionId } = useParams();
    let { state } = useLocation();
    const [stockReport, setStockReport] = useState(state);
    useEffect(() => {
        const fetchStockReport = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/reports/stock-out/${transactionId}`);
                setStockReport(res.data.stockReport);
            } catch (err) {
                console.error(err);
            }
        }
        if (!state) {
            fetchStockReport();
        }
    }, [])

    // const [stockReport, setStockReport] = useState({});
    let saleDate = (new Date(stockReport?.createdAt)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

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
        textAlign: "left",
        wordWrap: 'break-word'
    }

    const cellThStyle = {
        border: "1px solid black",
        borderCollapse: "collapse",
        padding: "15px",
        textAlign: "left",
        backgroundColor: "#f0f0f0"
    }

    const pageStyles = {
        width: "794px",
        height: "1193px",
        margin: "0 auto",
        padding: "30px",
        boxSizing: "border-box",
        border: "1px solid #000",
        backgroundColor: 'white'
    }

    const headerStyles = {
        display: "flex",
        justifyContent: 'space-between',
        marginBottom: "40px",
        marginTop: "40px"
    }

    const headerLeftStyles = {
        display: "flex",
        flexDirection: "column",
        width: "50%",
        fontSize: "18px"
    }

    const headerRightStyles = {
        display: "flex",
        flexDirection: "column",
        width: "50%",
        fontSize: "18px"
    }

    const dateStyles = {
        fontWeight: 'bold'
    }

    const transactionIdStyles = {
        fontWeight: 'bold'
    }

    const customerStyles = {
        fontWeight: "bold",
        textAlign: "end"
    }

    const stockTableStyles = {
        width: "100%",
        tableLayout: "fixed",
        borderCollapse: "collapse",
        fontSize: "16px"
    }

    const stockTableTHStyles = {
        backgroundColor: "#f0f0f0"
    }

    const stockTableTDStyles = {
        border: "1px solid #000",
        padding: "8px"
    }


    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2, fontSize: '22px' }}>
                {/* <Box style={{ display: 'flex', width: '794px', height: '1123px', backgroundColor: 'white', margin: '0 auto' }}>
                    <Box style={{ flexGrow: 1, }} >
                        <div style={{ marginLeft: '60px', marginTop: '40px', fontWeight: 'bold', fontSize: '27px' }}>Stock Report - {stockReport?.transactionId}</div>
                        <table style={tableStyle}>
                            <tbody>
                                <tr>
                                    <th style={cellStyle}>Customer: </th>
                                    <td style={cellStyle}>{stockReport?.customer}</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Product ID: </th>
                                    <td style={cellStyle}>{ }</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Date of Production: </th>
                                    <td style={cellStyle}>{ }</td>
                                </tr>
                                <tr>
                                    <th style={cellStyle}>Batch ID: </th>
                                    <td style={cellStyle}>{ }</td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>
                </Box> */}


                <div style={pageStyles} ref={ref}>
                    <h2 style={{ textAlign: 'center' }} >STOCK OUT REPORT</h2>
                    <div style={headerStyles}>
                        <div style={headerLeftStyles}>
                            <span style={dateStyles}>Date of sale: {saleDate}</span>
                            <span style={transactionIdStyles}>Transaction ID: {stockReport?.transactionId}</span>
                        </div>
                        <div style={headerRightStyles}>
                            <span style={customerStyles}>Customer: {stockReport?.customer}</span>
                        </div>
                    </div>
                    <table style={stockTableStyles}>
                        <thead>
                            <tr>
                                <th style={{...cellThStyle, width: '180px' }}>Bucket ID</th>
                                <th style={{...cellThStyle, width: '190px'}}>BOQ Name</th>
                                <th style={{...cellThStyle, width: '190px'}}>Product Name</th>
                                {/* <th style={cellThStyle}>Color Shade</th> */}
                                <th style={{...cellThStyle, width: '90px'}}>Qty (kg)</th>
                                <th style={{...cellThStyle, width: '80px'}}>Units</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockReport?.materialData.map((item) => (
                                <tr key={item._id}>
                                    <td style={cellStyle}>{item.labelId}</td>
                                    <td style={cellStyle}>{item.boqName}</td>
                                    <td style={cellStyle}>{item.prodName}</td>
                                    {/* <td style={cellStyle}>{item.colorShade}</td> */}
                                    <td style={cellStyle}>{item.qty}</td>
                                    <td style={cellStyle}>{item.units}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </Container>
        </>

    )
});