import React, { useState, useEffect ,useMemo } from 'react'
import axios from 'axios';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import { CustomSnackbar } from '../Snackbar/CustomSnackbar';

export const Boq = () => {

    const [boq, setBoq] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('');
    const [message, setMessage] = useState('');

    const baseUrl = process.env.REACT_APP_API_URL;
    
    let navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/boq`);
                setBoq(res.data.boq);
            } catch(err) {
                console.log(err)
            }
        }
        fetchData();
    }, []);

    const handleDeleteBoq = async(id) => {
        try {
            const res = await axios.delete(`${baseUrl}/api/v1/boq/${id}`);
            if(res.status === 200) {
                setBoq((newBoq) => newBoq.filter(boq => boq._id !== id));
                setOpen(true);
                setSeverity('success');
                setMessage(res.data.message);
            }
        } catch(err) {
            console.log(err)
            setOpen(true);
            setSeverity('error');
            setMessage(err.message);
        }
    }

    const columns = useMemo(() => [
        { field: 'name', type: 'string', headerName: 'Name', flex: 1,headerAlign: 'center', align: 'center' },
        { field: 'batch_size', type: 'number', headerName: 'Batch size', minWidth: 100, headerAlign: 'center', align: 'center' },
        { 
            field: 'updatedAt', 
            type: 'date', 
            headerName: 'Last updated', 
            minWidth: 175,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleString().replace(',', '');
            },
            headerAlign: 'center', align: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem 
                    icon={<EditIcon />}
                    label="Edit"
                    showInMenu
                    onClick={() => {  
                        navigate(`/boq/edit/${params.id}`);
                    }}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    showInMenu
                    onClick={() => {
                        handleDeleteBoq(params.id);
                    }}
                />,
                <GridActionsCellItem
                    icon={<ContentCopyIcon />}
                    label="Duplicate"
                    showInMenu
                    onClick={() => {navigate({
                        pathname: `/boq/edit/${params.id}`,
                        search: '?duplicate=true'
                    })}}
                />
            ],
            headerAlign: 'center', align: 'center'
        }
    ], []);
    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>List of BOQs :</Box>
                    <Button size='small' variant='contained' onClick={() => { navigate(`/boq/add`) }}>Add item</Button>
                </Box>
                <Box style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: 'white' }}>
                    <Box style={{ flexGrow: 1 }}>
                        <DataGrid
                            autoHeight
                            getRowId={(row) => row._id}
                            rows={boq}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        />
                    </Box>
                </Box>
                <CustomSnackbar open={open} setOpen={setOpen} severity={severity} message={message} />
            </Container>
        </>
    )
}