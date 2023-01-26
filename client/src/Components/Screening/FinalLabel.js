import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useBarcode } from 'next-barcode';

const FinalLabel = React.forwardRef(({ labelDetails, batchId }, ref) => {

    const tableStyle = {
        backgroundColor: "white",
        fontSize: "22px",
        padding: "20px"
    }

    const divStyle = {
        width: "fit-content",
        backgroundColor: "white",
        margin: "0 auto",
        border: "1px solid black"
    }

    const barcodeStyle = {
        width: "fit-content",
        backgroundColor: "white",
        margin: "0 auto",
    }

    const { inputRef } = useBarcode({
        value: labelDetails.labelId
    })

    const card = (
        <>
            <CardContent>
                <Typography variant="h6" component="div">
                    PRODUCT - {labelDetails.product}
                </Typography>
                <Typography variant="h6">
                    COLOR SHADE - {labelDetails.colorShade}
                </Typography>
                <Typography variant="h6" component="div">
                    QTY - {labelDetails.qtyKg?.toFixed(2)} Kg / {labelDetails.qtyL?.toFixed(2)} Ltr
                </Typography>
                <Typography variant="h6" component="div">
                    BATCH NO. - {batchId}
                </Typography>
            </CardContent>
        </>
    );

    console.log(labelDetails);

    return (
        // <div ref={ref}>
        //     <Box sx={{ minWidth: 275 }}>
        //         <Card variant="outline">{card}</Card>
        //     </Box>
        // </div>

        <div ref={ref} style={divStyle}>
            <table style={tableStyle}>
                <tbody>
                    <tr>
                        <td>PRODUCT</td>
                        <td width="10%">:</td>
                        <td>{labelDetails.product}</td>
                    </tr>
                    <tr>
                        <td>COLOUR SHADE</td>
                        <td>:</td>
                        <td>{labelDetails.colorShade}</td>
                    </tr>
                    <tr>
                        <td>QUANTITY</td>
                        <td>:</td>
                        <td>{labelDetails.qtyKg?.toFixed(2)}Kg / {labelDetails.qtyL?.toFixed(2)}Ltr</td>
                    </tr>
                    <tr>
                        <td>BATCH NO.</td>
                        <td>:</td>
                        <td>{batchId}</td>
                    </tr>
                </tbody>
            </table>
            <div style={barcodeStyle}>
                <svg ref={inputRef}></svg>
            </div>
        </div>
    )
});

export default FinalLabel