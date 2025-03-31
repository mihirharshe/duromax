import { useEffect, useState, useCallback, useMemo } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, FormControl } from '@mui/material';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useRefreshToken from '../../hooks/useRefreshToken';
import { Container } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [pageSize, setPageSize] = useState(100);
    const [apiError, setApiError] = useState('');
    const [touched, setTouched] = useState({
        name: false,
        email: false
    });
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact: '',
        email: '',
        gstNumber: ''
    });
    const [editFormData, setEditFormData] = useState({
        id: '',
        name: '',
        address: '',
        contact: '',
        email: '',
        gstNumber: ''
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const baseUrl = process.env.REACT_APP_API_URL;
    const axiosPrivate = useAxiosPrivate();
    const refresh = useRefreshToken();

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Invalid email address';
        }
        return errors;
    };

    const getFieldError = (field) => {
        const errors = validateForm();
        if (touched[field] && errors[field]) {
            return errors[field];
        }
        return '';
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await axiosPrivate.get(`${baseUrl}/api/v1/customers`);
                setCustomers(res.data.customers);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCustomers();
    }, []);

    const handleDialogOpen = () => {
        setOpen(true);
        setApiError('');
        setTouched({
            name: false,
            email: false
        });
    };

    const handleDialogClose = () => {
        setOpen(false);
        setApiError('');
        setTouched({
            name: false,
            email: false
        });
        setFormData({
            name: '',
            address: '',
            contact: '',
            email: '',
            gstNumber: ''
        });
    };

    const handleEditDialogOpen = (customer) => {
        setEditFormData({
            id: customer._id,
            name: customer.name || '',
            address: customer.address || '',
            contact: customer.contact || '',
            email: customer.email || '',
            gstNumber: customer.gstNumber || ''
        });
        setEditOpen(true);
        setApiError('');
    };

    const handleEditDialogClose = () => {
        setEditOpen(false);
        setApiError('');
        setEditFormData({
            id: '',
            name: '',
            address: '',
            contact: '',
            email: '',
            gstNumber: ''
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleEditInputChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.id]: e.target.value
        });
    };

    const handleBlur = (field) => () => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const handleSubmit = async () => {
        setTouched({
            name: true,
            email: true
        });

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const res = await axiosPrivate.post(`${baseUrl}/api/v1/customers`, formData);
            setCustomers([...customers, res.data.customer]);
            handleDialogClose();
        } catch (err) {
            if (err.response?.data?.message) {
                setApiError(err.response.data.message);
            } else {
                setApiError('An error occurred while adding the customer');
            }
        }
    };

    const handleEditSubmit = async () => {
        try {
            const res = await axiosPrivate.put(`${baseUrl}/api/v1/customers/${editFormData.id}`, editFormData);
            setCustomers(customers.map(customer => 
                customer._id === editFormData.id ? res.data.customer : customer
            ));
            handleEditDialogClose();
        } catch (err) {
            if (err.response?.data?.message) {
                setApiError(err.response.data.message);
            } else {
                setApiError('An error occurred while updating the customer');
            }
        }
    };

    const deleteItem = useCallback((id) => () => {
        setCustomerToDelete(id);
        setDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = async () => {
        try {
            await axiosPrivate.delete(`${baseUrl}/api/v1/customers/${customerToDelete}`);
            setCustomers((customers) => customers.filter((row) => row._id !== customerToDelete));
            setDeleteDialogOpen(false);
            setCustomerToDelete(null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCustomerToDelete(null);
    };

    const handleMenuClick = (event, params) => {
        setAnchorEl(event.currentTarget);
        setSelectedCustomer(params.row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCustomer(null);
    };
    const columns = useMemo(() => [
        { 
            field: 'name', 
            headerName: 'Name', 
            flex: 1, 
            headerAlign: 'center', 
            align: 'center',
            valueGetter: (params) => params.value || '-'
        },
        { 
            field: 'address', 
            headerName: 'Address', 
            flex: 1, 
            headerAlign: 'center', 
            align: 'center',
            valueGetter: (params) => params.value || '-'
        },
        { 
            field: 'contact', 
            headerName: 'Contact', 
            flex: 1, 
            headerAlign: 'center', 
            align: 'center',
            valueGetter: (params) => params.value || '-'
        },
        { 
            field: 'email', 
            headerName: 'Email', 
            flex: 1, 
            headerAlign: 'center', 
            align: 'center',
            valueGetter: (params) => params.value || '-'
        },
        {
            field: 'gstNumber',
            headerName: 'GST Number',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.value || '-'
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleEditDialogOpen(params.row)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={deleteItem(params.row._id)}
                />
            ]
        }
    ], [deleteItem]);

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>List of customers:</Box>
                    <Button size='small' variant='contained' onClick={handleDialogOpen}>Add Customer</Button>
                </Box>

                <Box sx={{ backgroundColor: 'white' }}>
                    <DataGrid
                        rows={customers}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        getRowId={(row) => row._id}
                        autoHeight
                        disableSelectionOnClick
                    />
                </Box>
            </Container>

            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    {apiError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {apiError}
                        </Alert>
                    )}
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur('name')}
                        error={!!getFieldError('name')}
                        helperText={getFieldError('name')}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="address"
                        label="Address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="contact"
                        label="Contact"
                        type="text"
                        value={formData.contact}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur('email')}
                        error={!!getFieldError('email')}
                        helperText={getFieldError('email')}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="gstNumber"
                        label="GST Number"
                        type="text"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} color="primary">
                        Add
                    </Button>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Edit Customer</DialogTitle>
                <DialogContent>
                    {apiError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {apiError}
                        </Alert>
                    )}
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="address"
                        label="Address"
                        type="text"
                        value={editFormData.address}
                        onChange={handleEditInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="contact"
                        label="Contact"
                        type="text"
                        value={editFormData.contact}
                        onChange={handleEditInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        value={editFormData.email}
                        onChange={handleEditInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="gstNumber"
                        label="GST Number"
                        type="text"
                        value={editFormData.gstNumber}
                        onChange={handleEditInputChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditSubmit} color="primary">
                        Save
                    </Button>
                    <Button onClick={handleEditDialogClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this customer? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
