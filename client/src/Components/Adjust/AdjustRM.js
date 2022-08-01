import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { CustomSnackbar } from '../Snackbar/CustomSnackbar';
import { InputLabel } from '@mui/material';

export const AdjustRM = () => {



    const [records, setRecords] = useState([]);
    const [allRM, setAllRM] = useState([]);
    const [singleRM, setSingleRM] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [qty, setQty] = useState('');
    const [desc, setDesc] = useState('');
    const [operation, setOperation] = useState('');
    const [severity, setSeverity] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/adj-rm');
                setRecords(res.data.records);
            } catch (err) {
                console.log(err)
            }
        }
        const fetchRM = async () => {
            try {
                const res = await axios.get('http://localhost:5000/rm');
                setAllRM(res.data.rawMaterials);
            } catch (err) {
                console.log(err)
            }
        }
        fetchData();
        fetchRM();
    }, []);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    }

    const handleDialogClose = () => {
        setOpenDialog(false);
        setDesc('');
        setSingleRM('');
        setQty('');
    }

    const handleDialogSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: singleRM,
            qtyChange: qty,
            action: operation,
            description: desc,
        }
        // setRecords([...records, data])
        try {
            const res = await axios.post('http://localhost:5000/adj-rm/add', data);
            if (res.status === 200) {
                setOpen(true);
                setSeverity('success');
                setMessage(res.data.message);
            }
            const newRecords = [...records, res.data.record];
            setRecords(newRecords);
        } catch (err) {
            console.log(err);
            setOpen(true);
            setSeverity('error');
            setMessage(err.message);
        }
        handleDialogClose();
    }

    const columns = useMemo(() => [
        { field: 'name', type: 'string', headerName: 'Name', flex: 0.25, headerAlign: 'center', align: 'center'},
        { field: 'description', type: 'string', headerName: 'Description', flex: 0.25 , headerAlign: 'center', align: 'center'},
        { field: 'qtyChange', type: 'number', headerName: 'Qty adjusted', minWidth: 100, headerAlign: 'center', align: 'center' },
        {
            field: 'createdAt',
            type: 'date',
            headerName: 'Date created',
            minWidth: 175,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleString().replace(',', '');
            },
            headerAlign: 'center', 
            align: 'center'
        },
        { field: 'action', type: 'string', headerName: 'Operation', width: 120, headerAlign: 'center', align: 'center' }
    ], []);

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>List of Records :</Box>
                    <Button size='small' variant='contained' onClick={handleDialogOpen}>Add record</Button>
                </Box>
                <Box style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: 'white' }}>
                    <Box style={{ flexGrow: 1 }}>
                        <DataGrid
                            autoHeight
                            getRowId={(row) => row._id}
                            rows={records}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        />
                    </Box>
                </Box>
                <CustomSnackbar open={open} setOpen={setOpen} severity={severity} message={message} />
            </Container>
            <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <Box component='form' onSubmit={handleDialogSubmit}>

                    <DialogTitle id="form-dialog-title">Adjust raw material</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the details of the record.
                        </DialogContentText>
                        <FormControl fullWidth>
                            <InputLabel id="select-rm-label">Raw material</InputLabel>
                            <Select
                                required
                                labelId='select-rm-label'
                                id="select-rm-id"
                                value={singleRM ?? ""}
                                label="Select Raw Material"
                                onChange={(e) => { setSingleRM(e.target.value) }}
                                fullWidth
                            >
                                {allRM.map((item, id) => (
                                    <MenuItem key={id} value={item.name}>{item.name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <TextField
                            required
                            margin="dense"
                            id="qty"
                            label="Quantity"
                            type="number"
                            value={qty ?? ""}
                            onChange={(e) => { setQty(e.target.value) }}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel id="select-operation-label">Operation</InputLabel>
                            <Select
                                required
                                labelId='select-operation-label'
                                id="select-operation-id"
                                value={operation ?? ""}
                                label="Operation"
                                onChange={(e) => { setOperation(e.target.value) }}
                                fullWidth
                            >
                                <MenuItem value='Addition'>Addition</MenuItem>
                                <MenuItem value='Subtraction'>Subtraction</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            required
                            margin="dense"
                            id="description"
                            label="Description"
                            value={desc ?? ""}
                            onChange={(e) => { setDesc(e.target.value) }}
                            fullWidth
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" type='submit'>
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

export default AdjustRM