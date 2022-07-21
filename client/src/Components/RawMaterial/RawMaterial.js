import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import axios from 'axios';
import { Container } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export const RawMaterial = () => {
    const [materials, setMaterials] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [qty, setQty] = useState('');
    const [alertQty, setAlertQty] = useState('');

    const handleDialogOpen = () => {
        setOpen(true);
    }

    const handleDialogClose = () => {
        setOpen(false);
        setName('');
        setQty('');
        setAlertQty('');
    }

    const handleInputChange = (e) => {
        if(e.target.id === 'name') {
            setName(e.target.value);
        } else if(e.target.id === 'qty') {
            setQty(e.target.value);
        } else {
            setAlertQty(e.target.value);
        }
    }
    const handleDialogSubmit = async () => {
        const data = {
            name: name,
            qty: qty,
            alertQty: alertQty
        }
        try {
            const res = await axios.post('http://localhost:5000/rm', data);
            setMaterials([...materials, res.data.rawMaterial]);
            handleDialogClose();
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/rm');
                setMaterials(res.data.rawMaterials);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    // const deleteItem = useCallback(async (id) => {
    //     try {
    //         await axios.delete(`http://localhost:5000/rm/${id}`);
    //         setMaterials(materials.filter(material => material._id !== id));
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }
    // , [materials]);

    const handleEdit = useCallback((row) => async (e) => {
        handleDialogOpen();
        console.log(row);
        setName(row.name);
        setQty(row.qty);
        setAlertQty(row.alertQty);
    }, []);

    const deleteItem = useCallback((id) => async () => {
        console.log(id);
        try {
            await axios.delete(`http://localhost:5000/rm/${id}`);
            setMaterials((materials) => materials.filter((row) => row._id !== id));
        }
        catch (err) {
            console.log(err);
        }
    }, []);

    const columns = useMemo(() => [
        { field: 'name', type: 'string', headerName: 'Name', flex: 1 },
        { field: 'qty', type: 'number', headerName: 'Quantity', flex: 0.25 },
        { field: 'alertQty', type: 'number', headerName: 'Alert Quantity', flex: 0.25 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem 
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={handleEdit(params.row)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={deleteItem(params.id)}
                />
            ]
        }
    ], [deleteItem]);

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>List of raw materials :</Box>
                    <Button size='small' variant='contained' onClick={handleDialogOpen}>Add item</Button>
                </Box>
                <Box style={{ display: 'flex', height: '100%', width: '100%' }}>
                    <Box style={{ flexGrow: 1 }}>
                        <DataGrid
                            autoHeight
                            getRowId={(materials) => materials._id}
                            rows={materials}
                            columns={columns}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        />
                    </Box>
                </Box>
            </Container>
            <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add new raw material</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the details of the raw material you want to add.
                    </DialogContentText>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        value={name}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        required
                        margin="dense"
                        id="qty"
                        label="Quantity"
                        type="number"
                        value={qty}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        required
                        margin="dense"
                        id="alertQty"
                        label="Alert Quantity"
                        type="number"
                        value={alertQty}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogSubmit} color="primary">
                        Add
                    </Button>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}