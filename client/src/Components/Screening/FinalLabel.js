import React, { useRef } from 'react'
import Button from '@mui/material/Button'
import { useBarcode } from 'next-barcode';
import ReactToPrint from 'react-to-print'
import Barcode from 'react-barcode';
import dayjs from 'dayjs';

const FinalLabel = React.forwardRef(({ labelDetails, batchId, commonLabel, manualLabel }, ref) => {
    const tableStyle = {
        backgroundColor: "white",
        fontSize: "18px",
        padding: "16px"
    }

    const divStyle = {
        width: "407.88px",
        height: "370.5px",
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

    const rowStyle = commonLabel.mrp ? { lineHeight: '1.25' } : {};

    // const { inputRef } = useBarcode({
    //     value: labelDetails.labelId
    // })
    const componentRef = useRef();

    // const card = (
    //     <>
    //         <CardContent>
    //             <Typography variant="h6" component="div">
    //                 PRODUCT - {commonLabel.product}
    //             </Typography>
    //             <Typography variant="h6">
    //                 COLOR SHADE - {commonLabel.colorShade}
    //             </Typography>
    //             <Typography variant="h6" component="div">
    //                 QTY - {labelDetails.qtyKg?.toFixed(2)} Kg / {labelDetails.qtyL?.toFixed(2)} Ltr
    //             </Typography>
    //             <Typography variant="h6" component="div">
    //                 BATCH NO. - {commonLabel.batchNo}
    //             </Typography>
    //         </CardContent>
    //     </>
    // );
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
                        <tr style={rowStyle}>
                            <td>PRODUCT</td>
                            <td width="10%">:</td>
                            <td>{commonLabel.name}</td>
                        </tr>
                        <tr style={rowStyle}>
                            <td>COLOUR SHADE</td>
                            <td>:</td>
                            <td>{commonLabel.colorShade}</td>
                        </tr>
                        <tr style={rowStyle}>
                            <td>QUANTITY</td>
                            <td>:</td>
                            <td>{parseFloat(labelDetails.qtyKg)?.toFixed(3)} kg / {parseFloat(labelDetails.qtyL)?.toFixed(3)} ltr</td>
                        </tr>
                        <tr style={rowStyle}>
                            <td>BATCH NO.</td>
                            <td>:</td>
                            <td>{commonLabel.batchNo}</td>
                        </tr>
                        <tr style={rowStyle}>
                            <td>PART</td>
                            <td>:</td>
                            <td>{commonLabel.part}</td>
                        </tr>
                        <tr style={rowStyle}>
                            <td>MFG. DATE</td>
                            <td>:</td>
                            <td>{manualLabel ? commonLabel.updatedAt : dayjs(commonLabel.updatedAt).format('DD/MM/YYYY') }</td>
                        </tr>
                        {commonLabel.mrp &&
                            <tr style={rowStyle}>
                                <td>MRP</td>
                                <td>:</td>
                                <td>₹{commonLabel.mrp}</td>
                            </tr>
                        }
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