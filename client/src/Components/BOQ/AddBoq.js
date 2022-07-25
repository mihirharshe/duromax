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
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const AddBoq = () => {

    let navigate = useNavigate();

    const [boqContent, setBoqContent] = useState([
        {
            name: '',
            qty: '',
            mixTime: ''
        },
    ]);
    
    const [boq, setBoq] = useState({
        name: '',
        batch_size: '',
        content: boqContent
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

    const handleDragEnd = async (props) => {
        console.log(props);
        const srcIdx = props.source.index;
        const desIdx = props.destination?.index;
        console.log(desIdx);
        if (desIdx !== undefined) {
            const newBoqContent = [...boqContent];
            newBoqContent.splice(desIdx, 0, newBoqContent.splice(srcIdx, 1)[0]);
            setBoqContent(newBoqContent);
        }

    }

    const handleSubmit = async () => {
        const newBoq = { ...boq };
        newBoq.content = boqContent;
        setBoq(newBoq);
        // console.log(newBoq);
        try {
            const res = await axios.post('http://localhost:5000/boq', newBoq);
            console.log(res);
        } catch(err) {
            console.log(err);
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/rm');
                setAllRM(res.data.rawMaterials);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    console.log(boqContent);

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
                                <TextField
                                    required
                                    id="boqName"
                                    type="text"
                                    label="Name"
                                    variant="outlined"
                                    value={boq.name}
                                    onChange={handleBoqMainName}
                                    placeholder='Enter Production Name'
                                    sx={{ m: 1 }}
                                />
                                <TextField
                                    required
                                    id="boqSize"
                                    type="number"
                                    label="Batch Size (in kgs)"
                                    variant="outlined"
                                    value={boq.batch_size}
                                    onChange={handleBoqMainBatchSize}
                                    placeholder='Enter Max Batch Size'
                                    sx={{ m: 1 }}
                                />
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

                                                                    {boqContent.length !== 1 && <span {...provided.dragHandleProps}><DragIndicatorIcon /></span>}
                                                                    <FormControl sx={{ m: 1, minWidth: 150 }}>
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
                                                                    <FormControl sx={{ m: 1 }}>
                                                                        <TextField
                                                                            id="select-qty-id"
                                                                            type="number"
                                                                            label="Quantity (in grams)"
                                                                            variant="outlined"
                                                                            value={boq.qty}
                                                                            onChange={(e) => { handleBoqChangeQty(e, id) }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormControl sx={{ m: 1 }}>
                                                                        <TextField
                                                                            id="select-time-id"
                                                                            type="number"
                                                                            label="Mix time (in secs)"
                                                                            variant="outlined"
                                                                            value={boq.mixTime}
                                                                            onChange={(e) => { handleBoqChangeTime(e, id) }}
                                                                        />
                                                                    </FormControl>
                                                                    {boqContent.length > 1 && <Button variant='contained' color='error' onClick={() => { handleRemoveItem(id) }}>Remove</Button>}
                                                                    {provided.placeholder}
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
                        <div style={{ display:'flex', justifyContent: 'space-around', width: 200, marginLeft: 'auto',marginRight:'auto' , marginTop: 16 }}>
                            <Button variant='contained' type='submit'>Save</Button>
                            <Button variant='contained' color='error' onClick={() => navigate(-1)}>Cancel</Button>
                        </div>
                    </Box>
                </DragDropContext>
            </Container>
        </>
    )
}