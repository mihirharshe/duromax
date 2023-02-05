import React, { useRef } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import { useBarcode } from 'next-barcode';
import ReactToPrint from 'react-to-print'
import Barcode from 'react-barcode';

const FinalLabel = React.forwardRef(({ labelDetails, batchId, commonLabel }, ref) => {

    const tableStyle = {
        backgroundColor: "white",
        fontSize: "22px",
        padding: "20px"
    }

    const divStyle = {
        width: "fit-content",
        backgroundColor: "white",
        margin: "0 auto",
        border: "1px solid black",
        whiteSpace: "nowrap"
    }

    const barcodeStyle = {
        width: "fit-content",
        backgroundColor: "white",
        margin: "0 auto",
    }

    // const { inputRef } = useBarcode({
    //     value: labelDetails.labelId
    // })

    const componentRef = useRef();

    const card = (
        <>
            <CardContent>
                <Typography variant="h6" component="div">
                    PRODUCT - {commonLabel.product}
                </Typography>
                <Typography variant="h6">
                    COLOR SHADE - {commonLabel.colorShade}
                </Typography>
                <Typography variant="h6" component="div">
                    QTY - {labelDetails.qtyKg?.toFixed(2)} Kg / {labelDetails.qtyL?.toFixed(2)} Ltr
                </Typography>
                <Typography variant="h6" component="div">
                    BATCH NO. - {commonLabel.batchNo}
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
        <section>
            <div ref={componentRef} style={divStyle}>
                <table style={tableStyle}>
                    <tbody>
                        <tr>
                            <td>PRODUCT</td>
                            <td width="10%">:</td>
                            <td>{commonLabel.name}</td>
                        </tr>
                        <tr>
                            <td>COLOUR SHADE</td>
                            <td>:</td>
                            <td>{commonLabel.colorShade}</td>
                        </tr>
                        <tr>
                            <td>QUANTITY</td>
                            <td>:</td>
                            <td>{labelDetails.qtyKg?.toFixed(2)}Kg / {labelDetails.qtyL?.toFixed(2)}Ltr</td>
                        </tr>
                        <tr>
                            <td>BATCH NO.</td>
                            <td>:</td>
                            <td>{commonLabel.batchNo}</td>
                        </tr>
                    </tbody>
                </table>
                {/* <div style={barcodeStyle}>
                    <svg ref={inputRef}></svg>
                </div> */}
                <div style={barcodeStyle}>
                    <Barcode value={labelDetails.labelId} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <ReactToPrint
                    trigger={() => <Button variant="contained">Print</Button>}
                    content={() => componentRef.current}
                />
            </div>
        </section>
    )
});

export default FinalLabel