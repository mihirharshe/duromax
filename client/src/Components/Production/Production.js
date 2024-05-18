import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Menu, Select } from '@mui/material';
import axios from 'axios';
import { Container } from '@mui/system';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog';
import InputLabel from '@mui/material/InputLabel';
import FormControl from "@mui/material/FormControl";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

class PackSizeError extends Error {
    constructor(message) {
        super(message);
    }
}

export const Production = () => {

    const [open, setOpen] = useState(false);
    const [pageSize, setPageSize] = useState(100);
    const [productions, setProductions] = useState([]);
    const [data, setData] = useState({
        name: '',
        boqId: '',
        qty: '',
        pack_size: '',
        desc: '',
        productLabelName: '',
        colorShade: '',
        part: ''
    });
    const [allBoq, setAllBoq] = useState([]);
    const [selectedBoq, setSelectedBoq] = useState();
    const [updatedBoqContent, setUpdatedBoqContent] = useState([]);
    const [packSizeError, setPackSizeError] = useState(false);
    const [packSizeErrorText, setPackSizeErrorText] = useState('');
    const [rmAvailableError, setRMAvailableError] = useState(false);
    const [rmAvailableErrorText, setRMAvailableErrorText] = useState('');

    useEffect(() => {
        const fetchExtendedBoqContent = async () => {
            let res = await axios.get(`${baseUrl}/api/v1/prod/boqContent/${selectedBoq._id.toString()}`);
            setUpdatedBoqContent(res.data.updatedContent);
        };
        if (selectedBoq)
            fetchExtendedBoqContent();
    }, [selectedBoq])

    const resetValues = () => {
        setData({
            name: '',
            boqId: '',
            qty: '',
            pack_size: '',
            desc: '',
            productLabelName: '',
            colorShade: '',
            part: ''
        })
        setRMAvailableError(false);
        setPackSizeError(false);
    }

    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    }

    const handleDialogOpen = () => {
        setOpen(true);
    }

    const handleDialogClose = () => {
        setOpen(false);
        resetValues();
    }

    const baseUrl = process.env.REACT_APP_API_URL;

    const deleteItem = useCallback((id) => async () => {
        try {
            let res = await axios.delete(`${baseUrl}/api/v1/prod/${id}`);
            if (res.status == 200)
                setProductions((productions) => productions.filter(row => row._id !== id));
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleDialogSubmit = async (e) => {
        e.preventDefault();
        if (rmAvailableError) return;
        try {
            if (!data.qty || !data.boqId) {
                setPackSizeErrorText('Either qty or boq is missing');
            } else {
                const selectedItem = allBoq.find(item => item.name === data.name);
                let batchSize = selectedItem.batch_size;
                let batchCount = Math.ceil(data.qty / batchSize);
                let batchQty = data.qty / batchCount;
                let parsedVal = parseFloat((batchQty / data.pack_size).toFixed(3));
                if (!Number.isInteger(parsedVal)) {
                    throw new PackSizeError(`Invalid pack size. Pack size should be divisible by resultant batch size ${batchQty}`);
                }
                setPackSizeError(false);
            }
            const res = await axios.post(`${baseUrl}/api/v1/prod/add`, data);
            setProductions([...productions, res.data.production]);
            handleDialogClose();
        } catch (err) {
            console.error(err);
            if (err instanceof PackSizeError) {
                setPackSizeError(true);
                setPackSizeErrorText(err.message)
            }
        }
    }

    const checkMaterialAvailability = async (e) => {
        let inputQty = e.target.value;
        updatedBoqContent.map((rmContent) => {
            let qtyRequiredKG = (rmContent.qty * inputQty) / 1000;
            if (rmContent.availableQty - qtyRequiredKG < 0) {
                setRMAvailableError(true);
                setRMAvailableErrorText(`Insufficient quantity of ${rmContent.name}`);
            } else {
                setRMAvailableError(false);
                setRMAvailableErrorText('');
            }
        });
    }

    const handleSelectBOQ = (e) => {
        const selectedItem = allBoq.find(item => item.name == e.target.value)
        setSelectedBoq(selectedItem);
        setData({
            ...data,
            name: e.target.value,
            boqId: selectedItem._id.toString()
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/prod`);
                setProductions(response.data.productions);
            } catch (err) {
                console.log(err);
            }
        }
        const fetchBoq = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/boq`);
                setAllBoq(response.data.boq);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
        fetchBoq();
    }, []);

    const columns = useMemo(() => [
        { field: 'name', type: 'string', headerName: 'Product Name', minWidth: 150, flex: 0.25, headerAlign: 'center', align: 'center' },
        { field: 'qty', type: 'number', headerName: 'Quantity (kg)', minWidth: 120, headerAlign: 'center', align: 'center' },
        { field: 'pack_size', type: 'number', headerName: 'Pack Size (kg)', minWidth: 120, headerAlign: 'center', align: 'center' },
        { field: 'desc', type: 'string', headerName: 'Remarks', flex: 1, headerAlign: 'center', align: 'center' },
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
            field: 'status',
            type: 'string',
            headerName: 'Status',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (params) => {
                if (params.value)
                    return params.value.toUpperCase();
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={deleteItem(params.id)}
                />,
            ]
        },
        {
            field: 'priority',
            type: 'string',
            headerName: 'Priority',
            minWidth: 100,
        }
    ], []);


    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>List of productions :</Box>
                    <Button size='small' variant='contained' onClick={handleDialogOpen}>Add item</Button>
                </Box>
                <Box style={{ display: 'flex', height: '80vh', width: '100%', backgroundColor: 'white' }}>
                    <Box style={{ flexGrow: 1 }}>
                        <DataGrid
                            // autoHeight
                            getRowId={(prod) => prod._id}
                            rows={productions}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'createdAt', sort: 'desc' }],
                                    // sortModel: [{ field: 'priority', sort: 'asc' }]
                                },
                                columns: {
                                    columnVisibilityModel: {
                                        priority: false
                                    }
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Container>

            <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <Box component='form' onSubmit={(e) => handleDialogSubmit(e)}>
                    <DialogTitle id="form-dialog-title">Add new production</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Please enter the details of the production you want to insert</DialogContentText>
                        <FormControl sx={{ width: '100%', marginBottom: 0.5 }}>
                            <InputLabel id="select-rm-label">Select Product</InputLabel>
                            <Select
                                required
                                labelId='select-boq-label'
                                id="select-boq-id"
                                value={data.name}
                                label="Select Product"
                                onChange={(e) => { handleSelectBOQ(e) }}
                                fullWidth
                            >
                                {allBoq.map((item) => (
                                    <MenuItem key={item._id} value={item.name}>{item.name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>

                        <TextField
                            required
                            margin="dense"
                            id="qty"
                            name="qty"
                            label="Quantity"
                            type="number"
                            value={data.qty}
                            onChange={handleInputChange}
                            onBlur={checkMaterialAvailability}
                            error={rmAvailableError}
                            helperText={rmAvailableError && rmAvailableErrorText}
                            fullWidth
                        />
                        <TextField
                            required
                            margin="dense"
                            id="pack_size"
                            name="pack_size"
                            label="Pack Size"
                            type="number"
                            value={data.pack_size}
                            error={packSizeError}
                            helperText={packSizeError && packSizeErrorText}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            required
                            margin="dense"
                            id="productLabelName"
                            name="productLabelName"
                            label="Product Label Name"
                            type="text"
                            value={data.productLabelName}
                            // error={packSizeError}
                            // helperText={packSizeError && packSizeErrorText}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            required
                            margin="dense"
                            id="colorShade"
                            name="colorShade"
                            label="Color Shade"
                            type="text"
                            value={data.colorShade}
                            // error={packSizeError}
                            // helperText={packSizeError && packSizeErrorText}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="part">Select Part</InputLabel>
                            <Select
                                required
                                margin="dense"
                                labelId="part"
                                id="part"
                                name="part"
                                value={data.part}
                                label="Part"
                                onChange={handleInputChange}
                                fullWidth
                            // displayEmpty
                            // renderValue={data.part !== "" ? null : () => <span style={{color: "#666"}}>test</span>}
                            >
                                {/* <MenuItem hidden>Test</MenuItem> */}
                                <MenuItem value="A">A</MenuItem>
                                <MenuItem value="B">B</MenuItem>
                                <MenuItem value="C">C</MenuItem>
                                <MenuItem value="D">D</MenuItem>
                                <MenuItem value="SINGLE">SINGLE</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            id="MRP"
                            name="mrp"
                            label="MRP (₹)"
                            type="number"
                            value={data.mrp}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            required
                            margin="dense"
                            id="Remarks"
                            name="desc"
                            label="Remarks"
                            type="text"
                            value={data.desc}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type='submit' color="primary">
                            Add
                        </Button>
                        <Button onClick={handleDialogClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}
