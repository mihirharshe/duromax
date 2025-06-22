import { useEffect, useState, useCallback, useMemo } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, FormControl } from '@mui/material';
import axios from 'axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useRefreshToken from '../../hooks/useRefreshToken';
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
    const [editOpen, setEditOpen] = useState(false);
    const [name, setName] = useState('');
    const [qty, setQty] = useState('');
    const [alertQty, setAlertQty] = useState('');
    const [itemId, setItemId] = useState('');
    const [error, setError] = useState(false);
    const [pageSize, setPageSize] = useState(100);

    const [duplicateRMerror, setDuplicateRMerror] = useState(false);
    const [duplicateRMname, setDuplicateRMname] = useState('');

    const baseUrl = process.env.REACT_APP_API_URL;

    const axiosPrivate = useAxiosPrivate();
    const refresh = useRefreshToken();

    const handleDialogOpen = () => {
        setOpen(true);
    }

    const handleDialogClose = () => {
        setOpen(false);
        setName('');
        setQty('');
        setAlertQty('');
        setError(false);
        setDuplicateRMerror(false);
        setDuplicateRMname(''); 
    }

    const handleEditDialogOpen = () => {
        setEditOpen(true);
    }

    const handleEditDialogClose = () => {
        setEditOpen(false);
        setName('');
        setQty('');
        setAlertQty('');
        setError(false);
        setDuplicateRMerror(false);
        setDuplicateRMname('');
    }

    const handleInputChange = (e) => {
        if (e.target.id === 'name') {
            setName(e.target.value);
        } else if (e.target.id === 'qty') {
            setQty(e.target.value);
        } else {
            setAlertQty(e.target.value);
        }
    }

    const handleDialogSubmit = async (e) => {
        e.preventDefault();
        if (!validationCheck()) {
            setError(true);
            return;
        }
        const data = {
            name: name,
            alertQty: alertQty
        }
        try {
            const res = await axiosPrivate.post(`${baseUrl}/api/v1/rm`, data);
            if (res.status !== 200)
                throw Error(res.statusText);
            setMaterials([...materials, res.data.rawMaterial]);
            handleDialogClose();
        } catch (err) {
            console.log(err.response.data);
            if (err.response.data.field === 'name') {
                setDuplicateRMerror(true);
                setDuplicateRMname(err.response.data.value);
            }
        }
    }

    const validationCheck = () => {
        if (name === '' || alertQty === '') {
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
            alertQty: alertQty
        }
        try {
            const res = await axiosPrivate.put(`${baseUrl}/api/v1/rm/${itemId}`, data);
            // console.log(res);
            const editedItemId = res.data.rawMaterial._id;
            const editedItem = materials.find(item => item._id === editedItemId);
            // const newMaterials = materials.filter(material => material._id !== editedItemId);
            const newMaterials = materials.slice(0);
            newMaterials.splice(materials.indexOf(editedItem), 1, res.data.rawMaterial);
            setMaterials(newMaterials);
            handleEditDialogClose();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosPrivate.get(`${baseUrl}/api/v1/rm`);
                setMaterials(res.data.rawMaterials);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    const handleEdit = useCallback((row) => async (e) => {
        handleEditDialogOpen();
        setName(row.name);
        setQty(row.qty);
        setAlertQty(row.alertQty);
        setItemId(row._id);
    }, []);

    const deleteItem = useCallback((id) => async () => {
        console.log(id);
        try {
            await axiosPrivate.delete(`${baseUrl}/api/v1/rm/${id}`);
            setMaterials((materials) => materials.filter((row) => row._id !== id));
        }
        catch (err) {
            console.log(err);
        }
    }, []);

    const columns = useMemo(() => [
        { field: 'name', type: 'string', headerName: 'Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'qty', type: 'number', headerName: 'Quantity(kg)', minWidth: 120, headerAlign: 'center', align: 'center' },
        { field: 'alertQty', type: 'number', headerName: 'Alert Quantity(kg)', minWidth: 140, headerAlign: 'center', align: 'center' },
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
                    <Box component='span'>List of raw materials :</Box>
                    <Button size='small' variant='contained' onClick={handleDialogOpen}>Add item</Button>
                </Box>
                <Box style={{ display: 'flex', height: '80vh', width: '100%', backgroundColor: 'white' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <DataGrid
                            // autoHeight
                            getRowId={(materials) => materials._id}
                            rows={materials}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        />
                    </Box>
                </Box>
            </Container>
            <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <Box component='form' onSubmit={handleDialogSubmit}>
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
                            error={duplicateRMerror}
                            helperText={duplicateRMerror && `Raw material with the name ${duplicateRMname} already exists`}
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
                        <Button type='submit' color="primary">
                            Add
                        </Button>
                        <Button onClick={handleDialogClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <Dialog open={editOpen} onClose={handleEditDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit raw material</DialogTitle>
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
                        disabled
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
            {/* <Button onClick={() => refresh()}>REFRESH</Button> */}
        </>
    );
}