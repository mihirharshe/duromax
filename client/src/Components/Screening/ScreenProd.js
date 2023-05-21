import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';
import Container from '@mui/system/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import Countdown from 'react-countdown';

import { CustomSnackbar } from '../Snackbar/CustomSnackbar';
import ShowLabels from './ShowLabels';

export const ScreenProd = () => {

    const { id } = useParams();
    const countdownRef = useRef();
    let navigate = useNavigate();
    const [time, setTime] = useState(Date.now());

    const [backdropOpen, setBackdropOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [prodBoq, setProdBoq] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(0);
    const [idx, setIdx] = useState(0);
    const [allBatches, setAllBatches] = useState([]);
    const [batchDetails, setBatchDetails] = useState([]);

    const [completedElements, setCompletedElements] = useState([]);
    const [currElement, setCurrElement] = useState({
        name: '',
        qty: '',
        mixTime: '',
        _id: '',
        totalQty: ''
    });
    const baseUrl = process.env.REACT_APP_API_URL;

    // const handleSelectBatch = (batchNumber) => {
    //     setSelectedBatch(batchNumber);
    // }

    useEffect(() => {
        const fetchProd = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/prod/${id}`);
                setSelectedProduct(res.data.production);
            }
            catch (err) {
                console.log(err);
            }
        }
        const fetchBatchDetails = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/prod/batch/all/${id}`);
                setBatchDetails(res.data.batches);
            }
            catch (err) {
                console.log(err);
            }
        }
        const fetchCompletedElements = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/prod/completed/${id}`);
                setCompletedElements(res.data.materials);
            } catch (err) {
                console.log(err);
            }
        }
        fetchProd();
        fetchBatchDetails();
        fetchCompletedElements();
    }, []);

    useEffect(() => {
        if (selectedProduct.name) {
            const fetchBoq = async () => {
                try {
                    const res = await axios.get(`${baseUrl}/api/v1/boq/name/${encodeURIComponent(selectedProduct.name)}`);
                    setProdBoq(res.data.boq);
                }
                catch (err) {
                    console.log(err);
                }
            }
            fetchBoq();
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (prodBoq.content) {
            setCurrElement({ ...prodBoq.content[idx], totalQty: parseFloat((prodBoq.content[idx]?.qty * batchQty).toFixed(2)) });
        }
    }, [prodBoq]);


    const batch_size = prodBoq.batch_size;
    const prodQty = selectedProduct.qty;
    const batchCount = Math.ceil(prodQty / batch_size);
    const batchQty = prodQty / batchCount;
    const generateBatchArray = (batchCount) => {
        const gen = batchCount ? (new Array(batchCount - batchDetails.length).fill({ completed: false, currentIdx: 0, stage: 'Screening' })) : [];
        const newArr = [...batchDetails, ...gen]
        return newArr;
    }

    const batchArray = useMemo(() => generateBatchArray(batchCount), [batchCount]);

    useEffect(() => {
        setAllBatches(batchArray);
    }, [batchArray]);

    useEffect(() => {
        if (batchArray.length > 0) {
            setIdx(batchArray[selectedBatch].currentIdx);
        }
    }, [batchArray, selectedBatch])

    const handleSelectElement = () => {
        if (prodBoq.content) {
            setCurrElement({ ...prodBoq.content[idx], totalQty: (prodBoq.content[idx].qty * batchQty).toFixed(2) });
        }
    }

    const saveCompletedElements = async () => {
        await axios.post(`${baseUrl}/api/v1/prod/completed/${id}`, {
            materials: { ...currElement, batch: selectedBatch + 1, totalQty: currElement.qty * batchQty }
        });
    }

    const updateSingleBatch = async () => {
        const updatedBatches = [...allBatches];
        if (updatedBatches[selectedBatch].currentIdx >= prodBoq.content.length) {
            updatedBatches[selectedBatch].completed = false;
            updatedBatches[selectedBatch].stage = 'QualityTesting'
        }
        await axios.post(`${baseUrl}/api/v1/prod/batch/${id}`, {
            batchIdx: selectedBatch,
            batchDetails: {
                completed: updatedBatches[selectedBatch].completed,
                currentIdx: updatedBatches[selectedBatch].currentIdx,
                stage: updatedBatches[selectedBatch].stage
            }
        });
    }

    const [value, setValue] = useState('1');

    const handleTabChange = (e, newValue) => {
        setValue(newValue);
        setSelectedBatch(newValue - 1);
        setIdx(allBatches[newValue - 1].currentIdx);
        const newBatchElementIdx = allBatches[newValue - 1].currentIdx;
        setCurrElement({ ...prodBoq.content[newBatchElementIdx], totalQty: (prodBoq.content[newBatchElementIdx]?.qty * batchQty).toFixed(2) });
    }

    const handleCompletion = async () => { // ON COMPLETE ADD TO DB -> whole batchDetails array. Need to look into completedElements as well
        if (allBatches[selectedBatch].stage === 'Screening') {
            setCompletedElements([...completedElements, { ...currElement, batch: selectedBatch + 1, totalQty: (currElement.qty * batchQty).toFixed(2) }]);
            setIdx(idx + 1);
            await saveCompletedElements();
            await updateSingleBatch();
            handleSelectElement();
            handleClose();
            setSelectedProduct({ ...selectedProduct, completedMaterials: [...completedElements, { ...currElement, batch: selectedBatch + 1, totalQty: (currElement?.qty * batchQty).toFixed(2) }] })
            if (allBatches[selectedBatch].currentIdx >= prodBoq.content.length) {
                const updatedBatch = [...allBatches];
                updatedBatch[selectedBatch] = { ...updatedBatch[selectedBatch], completed: false, currentIdx: idx, stage: 'QualityTesting' }
                setAllBatches(updatedBatch);
                navigate(`/screen/${id}/test/${selectedBatch + 1}`);
            }
        }
    };


    const renderer = ({ api, formatted }) => {
        const { minutes, seconds } = formatted;
        return (
            <>
                <Typography component="div" variant="h1" style={{ color: '#fff' }}>
                    {minutes}:{seconds}
                </Typography>
            </>
        );
    }

    const updateIdx = () => {
        const newArr = [...allBatches];
        newArr[selectedBatch] = { ...newArr[selectedBatch], currentIdx: idx + 1 }
        setAllBatches(newArr);
    }

    const handleStart = () => {
        if (allBatches[selectedBatch].stage != 'Screening') {
            switch(allBatches[selectedBatch].stage) {
                case 'QualityTesting':
                    navigate(`/screen/${id}/test/${selectedBatch + 1}`);
                    break;
                case 'BucketFilling':
                    navigate(`/screen/${id}/bktFill/${selectedBatch + 1}`);
                    break;
                case 'Labelling':
                    navigate(`/screen/${id}/label/${selectedBatch + 1}`);
                    break;
                default:
                    break;
            }
        }
        setBackdropOpen(!backdropOpen);
        setTime(Date.now());
        // setIdx(idx + 1);
        // const updatedIdx = [...allBatches];
        // updatedIdx.splice(selectedBatch, 1, { success: false, currentIdx: idx, content: prodBoq.content });
        // setAllBatches(updatedIdx);    
        updateIdx();
        setTimeout(() => {
            countdownRef.current.api.start();
        }, 1);
    }

    const handleClose = () => {
        setBackdropOpen(false);
    }


    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>PRODUCT : {selectedProduct.name}</Box>
                </Box>
                Choose your batch :
                <Box style={{ display: 'flex', height: '100%', width: '100%' }}>
                    {/* {batchCount ?
                        [...Array(batchCount)].map((_, i) => (
                            <Button variant="contained" key={i} sx={{ marginRight: 2 }}>batch {i + 1}</Button>
                        ))
                    : <CircularProgress />} */}
                    {/* <ToggleButtonGroup 
                        value={selectedBatch} 
                        onChange={handleSelectBatch}
                        exclusive
                        sx={{backgroundColor: 'white'}}
                    >
                        {batchCount ?
                            [...Array(batchCount)].map((_, i) => (
                                <ToggleButton key={i} value={i + 1}>batch {i + 1}</ToggleButton>
                            ))
                        : null}
                    </ToggleButtonGroup> */}
                </Box>
                <TabContext value={`${value}`}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList aria-label='tabs-example' onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
                            {allBatches.map((batch, i) => (
                                <Tab
                                    key={i}
                                    label={`Batch ${i + 1}`}
                                    value={`${i + 1}`}
                                // disabled={batch.success} 
                                />
                            ))}
                            {/* <Tab label='Tab One' value='1'/>
                            <Tab label='Tab Two' value='2'/>
                            <Tab label='Tab Three' value='3'/> */}
                        </TabList>
                    </Box>
                    {batchArray.map((batch, i) => (
                        <TabPanel key={i} value={`${i + 1}`}>
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                                <Grid item xs={3}>
                                    <Paper align='center'>
                                        <Box p={2}>
                                            <Typography gutterBottom variant='h6' component='div'>
                                                Composition
                                            </Typography>
                                            <Divider />
                                            {prodBoq.content.map((materials, element) => (
                                                <div key={element}>
                                                    <span>{materials.name}</span>
                                                    <Divider />
                                                </div>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper align='center'>
                                        <Box p={2}>
                                            <Typography gutterBottom variant='h6' component='div'>
                                                Current Element
                                            </Typography>
                                            <Divider />
                                            <div>
                                                <Typography gutterBottom variant='h4' component='div' fontWeight={500}>
                                                    {currElement ? (currElement.name ? currElement.name : '-') : '-'}
                                                </Typography>
                                                <Divider />
                                                <Typography gutterBottom variant='h4' component='div' fontWeight={500}>
                                                    {currElement.totalQty ? (currElement.totalQty === 'NaN' ? null : currElement.totalQty) : '-'}
                                                </Typography>
                                            </div>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={3}>
                                    <Paper >
                                        <Box p={2}>
                                            <Typography gutterBottom variant='h6' component='div'>
                                                Completed
                                            </Typography>
                                            <Divider />
                                            {completedElements && completedElements.map((element, i) => (
                                                <div key={i}>
                                                    <span>{element.name} - {`Batch ${element.batch}`} - {element.totalQty}</span>
                                                    <Divider />
                                                </div>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Button
                                variant='contained'
                                sx={{ marginTop: 2 }}
                                onClick={handleStart}
                                disabled={allBatches[selectedBatch]?.completed}
                            >
                                <span>Start</span>
                                {allBatches[selectedBatch]?.completed ? <CheckCircleIcon sx={{ marginLeft: 1 }} /> : <PlayCircleOutlineIcon sx={{ marginLeft: 1 }} />}
                            </Button>
                            <Backdrop open={backdropOpen} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Countdown
                                        date={time + ((currElement.mixTime === 0 ? currElement.mixTime + 0.9 : currElement.mixTime) * 1000)}
                                        onComplete={handleCompletion}
                                        autoStart={false}
                                        key={time}
                                        ref={countdownRef}
                                        renderer={renderer}
                                    />
                                </Box>
                            </Backdrop>
                            { allBatches[selectedBatch]?.completed ? <ShowLabels batchId={i+1}/> : null}
                        </TabPanel>
                    ))}

                </TabContext>
            </Container>
        </>
    )
}