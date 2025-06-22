import React, { useEffect, useState, useCallback, useMemo } from 'react';
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

export const Bucket = () => {
    const [buckets, setBuckets] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [name, setName] = useState('');
    const [qty, setQty] = useState('');
    const [capacity, setCapacity] = useState('');
    const [alertQty, setAlertQty] = useState('');
    const [itemId, setItemId] = useState('');
    const [error, setError] = useState(false);
    const [pageSize, setPageSize] = useState(100);

    const baseUrl = process.env.REACT_APP_API_URL;

    const handleDialogOpen = () => {
        setOpen(true);
    }

    const handleDialogClose = () => {
        setOpen(false);
        setName('');
        setQty('');
        setCapacity('');
        setAlertQty('');
        setError(false);
    }

    const handleEditDialogOpen = () => {
        setEditOpen(true);
    }

    const handleEditDialogClose = () => {
        setEditOpen(false);
        setName('');
        setQty('');
        setCapacity('');
        setAlertQty('');
        setError(false);
    }

    const handleInputChange = (e) => {
        if (e.target.id === 'name') {
            setName(e.target.value);
        } else if (e.target.id === 'qty') {
            setQty(e.target.value);
        } else if (e.target.id === 'capacity'){
            setCapacity(e.target.value);
        } else {
            setAlertQty(e.target.value);
        }
    }

    const handleDialogSubmit = async () => {
        if (!validationCheck()) {
            setError(true);
            return;
        }
        const data = {
            name: name,
            capacity: capacity,
            alertQty: alertQty
        }
        try {
            const res = await axios.post(`${baseUrl}/api/v1/bkt`, data);
            setBuckets([...buckets, res.data.bucket]);
            handleDialogClose();
        } catch (err) {
            console.log(err);
        }
    }

    const validationCheck = () => {
        if (name === '' || alertQty === '' || capacity === '') {
            return false;
        }
        return true;
    }

    const handleEditDialogSubmit = async () => {
        if (!validationCheck()) {
            setError(true);
            return;
        }
        const data = {
            name: name,
            qty: qty,
            capacity: capacity,
            alertQty: alertQty
        }
        try {
            const res = await axios.put(`${baseUrl}/api/v1/bkt/${itemId}`, data);
            // console.log(res);
            const editedItemId = res.data.bucket._id;
            const editedItem = buckets.find(item => item._id === editedItemId);
            // const newMaterials = materials.filter(material => material._id !== editedItemId);
            const newMaterials = buckets.slice(0);
            newMaterials.splice(buckets.indexOf(editedItem), 1, res.data.bucket);
            setBuckets(newMaterials);
            handleEditDialogClose();
        } catch (err) {
            console.log(err);
        }
    }



    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/bkt`);
                setBuckets(res.data.buckets);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    // const deleteItem = useCallback(async (id) => {
    //     try {
    //         await axios.delete(`${baseUrl}/rm/${id}`);
    //         setMaterials(materials.filter(material => material._id !== id));
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }
    // , [materials]);

    const handleEdit = useCallback((row) => async (e) => {
        handleEditDialogOpen();
        setName(row.name);
        setQty(row.qty);
        setCapacity(row.capacity);
        setAlertQty(row.alertQty);
        setItemId(row._id);
    }, []);

    const deleteItem = useCallback((id) => async () => {
        console.log(id);
        try {
            await axios.delete(`${baseUrl}/api/v1/bkt/${id}`);
            setBuckets((buckets) => buckets.filter((row) => row._id !== id));
        }
        catch (err) {
            console.log(err);
        }
    }, []);

    const columns = useMemo(() => [
        { field: 'name', type: 'string', headerName: 'Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'qty', type: 'number', headerName: 'Quantity', minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'capacity', type: 'number', headerName: 'Capacity', minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'alertQty', type: 'number', headerName: 'Alert Quantity', minWidth: 100, headerAlign: 'center', align: 'center' },
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
            ],
            headerAlign: 'center', align: 'center'
        }
    ], [handleEdit, deleteItem]);


    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>List of buckets :</Box>
                    <Button size='small' variant='contained' onClick={handleDialogOpen}>Add item</Button>
                </Box>
                <Box style={{ display: 'flex', height: '80vh', width: '100%', backgroundColor: 'white' }}>
                    <Box style={{ flexGrow: 1 }}>
                        <DataGrid
                            // autoHeight
                            getRowId={(buckets) => buckets._id}
                            rows={buckets}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        />
                    </Box>
                </Box>
            </Container>
            <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add new bucket</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the details of the bucket you want to add.
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
                        error={error && name === ''}
                        helperText={error && name === '' ? 'Please enter a name' : ''}
                        fullWidth
                    />
                    <TextField 
                        required
                        autoFocus
                        margin="dense"
                        id="capacity"
                        label="Capacity"
                        type="number"
                        value={capacity}
                        onChange={handleInputChange}
                        error={error && capacity === ''}
                        helperText={error && capacity === '' ? 'Please enter capacity' : ''}
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
                        error={error && alertQty === ''}
                        helperText={error && alertQty === '' ? 'Please enter an alert quantity' : ''}
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
            <Dialog open={editOpen} onClose={handleEditDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit bucket</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        value={name}
                        onChange={handleInputChange}
                        error={name === ''}
                        helperText={name === '' ? 'Please fill this field' : ''}
                        fullWidth
                    />
                    {/* <TextField
                        required
                        margin="dense"
                        id="qty"
                        label="Quantity"
                        type="number"
                        value={qty}
                        onChange={handleInputChange}
                        error={qty === ''}
                        helperText={qty === '' ? 'Please fill this field' : ''}
                        fullWidth
                    /> */}
                    <TextField
                        required
                        margin="dense"
                        id="capacity"
                        label="Capacity"
                        type="number"
                        value={capacity}
                        onChange={handleInputChange}
                        error={capacity === ''}
                        helperText={capacity === '' ? 'Please fill this field' : ''}
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
                        error={alertQty === ''}
                        helperText={alertQty === '' ? 'Please fill this field' : ''}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogSubmit} color="primary">
                        Save
                    </Button>
                    <Button onClick={handleEditDialogClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}