import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Select } from '@mui/material';
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

export const Production = () => {

    const [open, setOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [productions, setProductions] = useState([]);
    const [data, setData] = useState({
        name: '',
        boqId: '',
        qty: '',
        pack_size: '',
        desc: ''
    });
    const [allBoq, setAllBoq] = useState([]);

    const resetValues = () => {
        setData({
            name: '',
            boqId: '',
            qty: '',
            pack_size: '',
            desc: ''
        })
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

    const deleteItem = useCallback((id) => async () => {
        try {
            await axios.delete(`http://localhost:5124/api/v1/prod/${id}`);
            setProductions((productions) => productions.filter(row => row._id !== id));
        } catch (err) {
            console.log(err);
        }
    }, []);

    const handleDialogSubmit = async (e) => {
        try {
            const res = await axios.post('http://localhost:5124/api/v1/prod/add', data);
            setProductions([...productions, res.data.production]);
            e.preventDefault();
            handleDialogClose();
        } catch (err) {
            console.log(err);
        }
    }

    const handleSelectBOQ = (e) => {
        const selectedItem = allBoq.find(item => item.name == e.target.value)
        setData({
            ...data,
            name: e.target.value,
            boqId: selectedItem._id.toString()
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5124/api/v1/prod');
                setProductions(response.data.productions);
            } catch (err) {
                console.log(err);
            }
        }
        const fetchBoq = async () => {
            try {
                const response = await axios.get('http://localhost:5124/api/v1/boq');
                setAllBoq(response.data.boq);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
        fetchBoq();
    }, []);

    const columns = useMemo(() => [
        { field: 'name', type: 'string', headerName: 'Product Name', minWidth: 150, flex: 0.25 },
        { field: 'qty', type: 'number', headerName: 'Quantity', minWidth: 100 },
        { field: 'pack_size', type: 'number', headerName: 'Pack Size', minWidth: 100 },
        { field: 'desc', type: 'string', headerName: 'Remarks', flex: 1 },
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
        }
    ], []);


    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>List of productions :</Box>
                    <Button size='small' variant='contained' onClick={handleDialogOpen}>Add item</Button>
                </Box>
                <Box style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: 'white' }}>
                    <Box style={{ flexGrow: 1 }}>
                        <DataGrid
                            autoHeight
                            getRowId={(prod) => prod._id}
                            rows={productions}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
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
