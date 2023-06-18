import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from "@mui/material/FormControl";
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { CustomSnackbar } from '../Snackbar/CustomSnackbar';
import { Grid } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const AddBoq = () => {

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    let navigate = useNavigate();

    const [allBoq, setAllBoq] = useState([]);

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/rm`);
                setAllRM(res.data.rawMaterials);
            } catch (err) {
                console.log(err);
            }
        }
        const fetchAllBoq = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/boq`);
                setAllBoq(res.data.boq);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
        fetchAllBoq();
    }, []);


    const [boqContent, setBoqContent] = useState([
        {
            name: "",
            qty: "",
            mixTime: ""
        },
    ]);

    const [boq, setBoq] = useState({
        name: "",
        batch_size: "",
        content: boqContent,
        qualityTestLimits: {
            densityRange: {
                from: '',
                to: ''
            },
            hegmenRange: {
                from: '',
                to: ''
            },
        }
    });

    const [allRM, setAllRM] = useState([]);

    const handleAddItem = () => {
        setBoqContent([...boqContent, {
            name: '',
            qty: '',
            mixTime: ''
        }])
    }

    const handleRemoveItem = useCallback((id) => {
        const newBoqContent = [...boqContent];
        newBoqContent.splice(id, 1);
        setBoqContent(newBoqContent);
    }, [boqContent]);

    const handleBoqChangeName = async (e, index) => {
        const newBoqContent = [...boqContent];
        newBoqContent[index].name = e.target.value;
        setBoqContent(newBoqContent);
    }

    const handleBoqChangeQty = async (e, index) => {
        const newBoqContent = [...boqContent];
        newBoqContent[index].qty = e.target.value;
        setBoqContent(newBoqContent);
    }

    const handleBoqChangeTime = async (e, index) => {
        const newBoqContent = [...boqContent];
        newBoqContent[index].mixTime = e.target.value;
        setBoqContent(newBoqContent);
    }

    const handleBoqMainName = async (e) => {
        const newBoq = { ...boq };
        newBoq.name = e.target.value;
        setBoq(newBoq);
    }

    const handleBoqMainBatchSize = async (e) => {
        const newBoq = { ...boq };
        newBoq.batch_size = e.target.value;
        setBoq(newBoq);
    }

    const handleBoqDensityRangeLL = async (e) => {
        const newBoq = { ...boq };
        newBoq.qualityTestLimits.densityRange.from = e.target.value;
        setBoq(newBoq);
    }

    const handleBoqDensityRangeUL = async (e) => {
        const newBoq = { ...boq };
        newBoq.qualityTestLimits.densityRange.to = e.target.value;
        setBoq(newBoq);
    }

    const handleBoqHegmenRangeLL = async (e) => {
        const newBoq = { ...boq };
        newBoq.qualityTestLimits.hegmenRange.from = e.target.value;
        setBoq(newBoq);
    }

    const handleBoqHegmenRangeUL = async (e) => {
        const newBoq = { ...boq };
        newBoq.qualityTestLimits.hegmenRange.to = e.target.value;
        setBoq(newBoq);
    }

    const handleDragEnd = async (props) => {
        const srcIdx = props.source.index;
        const desIdx = props.destination?.index;
        if (desIdx !== undefined) {
            const newBoqContent = [...boqContent];
            newBoqContent.splice(desIdx, 0, newBoqContent.splice(srcIdx, 1)[0]);
            setBoqContent(newBoqContent);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (allBoq.find(item => item.name === boq.name)) { // checking if boq name already exists
            setSnackbarSeverity('error');
            setSnackbarMessage(`BOQ ${boq.name} already exists`);
            setOpenSnackbar(true);
            return;
        }
        const newBoq = { ...boq };
        newBoq.content = boqContent;
        setBoq(newBoq);
        try {
            const res = await axios.post(`${baseUrl}/api/v1/boq`, newBoq);
            console.log(res);
            if (res.status === 200) {
                setOpenSnackbar(true);
                setSnackbarSeverity('success');
                setSnackbarMessage(res.data.message);
                setTimeout(() => {
                    navigate('/boq');
                }, 3000);
            }
        } catch (err) {
            console.log(err);
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(err.message);
        }
    }

    return (
        <>

            <Container maxWidth='lg' sx={{ marginTop: 2 }} >
                <DragDropContext
                    onDragEnd={handleDragEnd}
                >
                    <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                        <Box component='span'>ADD BOQs:</Box>
                    </Box>
                    <Box component='form' onSubmit={handleSubmit}>
                        <Stack spacing={1}>
                            <Item elevation={3}>
                                <Grid container alignItems="center" padding={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            id="boqName"
                                            type="text"
                                            label="Name"
                                            variant="outlined"
                                            value={boq.name || ''}
                                            onChange={handleBoqMainName}
                                            placeholder='Enter Production Name'
                                            sx={{ m: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            id="boqSize"
                                            type="number"
                                            label="Batch Size (in kgs)"
                                            variant="outlined"
                                            value={boq.batch_size || ''}
                                            onChange={handleBoqMainBatchSize}
                                            placeholder='Enter Max Batch Size'
                                            sx={{ m: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            required
                                            id="densityFrom"
                                            type="number"
                                            label="Density lower limit"
                                            variant="outlined"
                                            value={boq.qualityTestLimits.densityRange.from || ''}
                                            onChange={handleBoqDensityRangeLL}
                                            placeholder='Enter lower limit for density'
                                            sx={{ m: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            required
                                            id="densityTo"
                                            type="number"
                                            label="Density upper limit"
                                            variant="outlined"
                                            value={boq.qualityTestLimits.densityRange.to || ''}
                                            onChange={handleBoqDensityRangeUL}
                                            placeholder='Enter upper limit for density'
                                            sx={{ m: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            required
                                            id="hegmenFrom"
                                            type="number"
                                            label="Hegmen lower limit"
                                            variant="outlined"
                                            value={boq.qualityTestLimits.hegmenRange.from || ''}
                                            onChange={handleBoqHegmenRangeLL}
                                            placeholder='Enter lower limit for hegmen'
                                            sx={{ m: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            required
                                            id="hegmenFrom"
                                            type="number"
                                            label="Hegmen upper limit"
                                            variant="outlined"
                                            value={boq.qualityTestLimits.hegmenRange.to || ''}
                                            onChange={handleBoqHegmenRangeUL}
                                            placeholder='Enter upper limit for hegmen'
                                            sx={{ m: 1 }}
                                        />
                                    </Grid>
                                </Grid>
                            </Item>
                            {boqContent.length < 25 && <Button sx={{ maxWidth: 80, alignSelf: 'flex-end' }} variant='contained' onClick={handleAddItem}>Add</Button>}
                            <div>
                                <Droppable droppableId="droppable-1">
                                    {(provided, _snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {boqContent.map((boq, id) => (
                                                <Draggable key={id} draggableId={`draggable-${id}`} index={id} >
                                                    {(provided, _snapshot) => (
                                                        <>
                                                            <Item
                                                                elevation={3}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                            >
                                                                <div
                                                                    // ref={provided.innerRef}
                                                                    // {...provided.draggableProps}
                                                                    // {...provided.dragHandleProps}
                                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 8 }}
                                                                >
                                                                    {boqContent.length !== 1 && <span {...provided.dragHandleProps}><DragHandleIcon /></span>}
                                                                    <Grid container alignItems="center" justifyContent="center">
                                                                        <Grid item xs={12} md={3}>
                                                                            <FormControl sx={{ m: 1, minWidth: 210 }}>
                                                                                <InputLabel id="select-rm-label">Raw Material</InputLabel>
                                                                                <Select
                                                                                    required
                                                                                    labelId='select-rm-label'
                                                                                    id="select-rm-id"
                                                                                    value={boq.name}
                                                                                    label="Select Raw Material"
                                                                                    onChange={(e) => { handleBoqChangeName(e, id) }}
                                                                                >
                                                                                    {allRM.map((item, id) => (
                                                                                        <MenuItem key={id} value={item.name}>{item.name}</MenuItem>
                                                                                    ))}

                                                                                </Select>
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} md={3}>
                                                                            <FormControl sx={{ m: 1 }}>
                                                                                <TextField
                                                                                    required
                                                                                    id="select-qty-id"
                                                                                    type="number"
                                                                                    label="Quantity (in grams)"
                                                                                    variant="outlined"
                                                                                    value={boq.qty}
                                                                                    onChange={(e) => { handleBoqChangeQty(e, id) }}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={12} md={3}>
                                                                            <FormControl sx={{ m: 1 }}>
                                                                                <TextField
                                                                                    required
                                                                                    id="select-time-id"
                                                                                    type="number"
                                                                                    label="Mix time (in secs)"
                                                                                    variant="outlined"
                                                                                    value={boq.mixTime}
                                                                                    onChange={(e) => { handleBoqChangeTime(e, id) }}
                                                                                />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        {boqContent.length > 1 && (
                                                                            <Grid item xs={12} md={2}>
                                                                                <Button variant='contained' color='error' onClick={() => { handleRemoveItem(id) }}>Remove</Button>
                                                                            </Grid>
                                                                        )}
                                                                        {provided.placeholder}
                                                                    </Grid>
                                                                </div>
                                                            </Item>
                                                            {id !== boqContent.length - 1 && <Divider />}
                                                        </>
                                                    )}

                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </Stack>
                        <div style={{ display: 'flex', justifyContent: 'space-around', width: 200, marginLeft: 'auto', marginRight: 'auto', marginTop: 16 }}>
                            <Button variant='contained' type='submit'>Save</Button>
                            <Button variant='contained' color='error' onClick={() => navigate(`/boq`)}>Cancel</Button>
                        </div>
                        <CustomSnackbar
                            open={openSnackbar}
                            setOpen={setOpenSnackbar}
                            severity={snackbarSeverity}
                            message={snackbarMessage}
                        />
                    </Box>
                </DragDropContext>
            </Container>
        </>
    )
}