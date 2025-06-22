import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';
import Container from '@mui/system/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import Countdown from 'react-countdown';
import { CustomSnackbar } from '../Snackbar/CustomSnackbar';
import ShowLabels from './ShowLabels';

export const ScreenProd = () => {

    const { id } = useParams();
    const countdownRef = useRef(null);
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

    useEffect(() => {
        console.log(allBatches);
        if (allBatches.length > 0 && allBatches[selectedBatch]?.stage != 'Screening' && allBatches[selectedBatch]?.stage != 'Finished') {
            switch (allBatches[selectedBatch].stage) {
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
    }, [allBatches]);

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

        setValue(1);
        setSelectedBatch(0);
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
        console.log(batchArray);
        if (batchArray.length > 0) {
            const newIdx = batchArray[selectedBatch].currentIdx;
            setIdx(newIdx);
            if (prodBoq.content[newIdx])
                setCurrElement({ ...prodBoq.content[newIdx], totalQty: (prodBoq.content[newIdx]?.qty * batchQty).toFixed(2) });
        }
    }, [batchArray, selectedBatch])

    const handleSelectElement = () => {
        if (prodBoq.content) {
            setCurrElement({ ...prodBoq.content[idx], totalQty: (prodBoq.content[idx].qty * batchQty).toFixed(2) });
        }
    }

    const saveCompletedElements = async () => {
        if(completedElements.length >= 0) {
            await axios.put(`${baseUrl}/api/v1/prod/status/${id}`, { status: 'Processing' });
        }
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

    const handleCompletion = async () => {
        // Ensure we are in the correct stage
        if (allBatches[selectedBatch]?.stage !== 'Screening') {
            console.warn("Completion triggered for non-Screening batch");
            return;
        }

        const currentBatchIndex = selectedBatch;
        const currentElement = { ...currElement }; // Capture current element state
        const nextElementIndex = idx + 1;
        const isLastElementInBatch = nextElementIndex >= prodBoq.content.length;

        // Prepare data for API calls and state updates
        const completedElementData = {
            ...currentElement,
            batch: currentBatchIndex + 1,
            totalQty: currentElement.qty * batchQty // Use raw number for DB consistency
        };

        const nextStage = isLastElementInBatch ? 'QualityTesting' : 'Screening';

        try {
            // --- Perform Side Effects (API Calls) ---

            // Use Promise.all for concurrent updates where possible
            await Promise.all([
                // 1. Save the completed element
                axios.post(`${baseUrl}/api/v1/prod/completed/${id}`, {
                    materials: completedElementData
                }),
                // 2. Update batch details (index and stage)
                axios.post(`${baseUrl}/api/v1/prod/batch/${id}`, {
                    batchIdx: currentBatchIndex,
                    batchDetails: {
                        // Assuming currentIdx stores the index of the *next* element to process
                        currentIdx: nextElementIndex,
                        stage: nextStage,
                        completed: false // 'completed' might mean the whole batch lifecycle, set based on final stage? Needs clarification.
                    }
                }),
                // 3. Update product status to 'Processing' if this is the first element ever completed
                (completedElements.length === 0) ?
                    axios.put(`${baseUrl}/api/v1/prod/status/${id}`, { status: 'Processing' })
                    : Promise.resolve() // No-op if status doesn't need update
            ]);

            // --- Update Local State (after successful API calls) ---

            // 1. Add formatted element to the completed list for display
            setCompletedElements(prev => [...prev, {
                ...completedElementData,
                totalQty: formatDisplayNumber(completedElementData.totalQty.toFixed(2))
            }]);

            // 2. Update the index for the next element
            setIdx(nextElementIndex);

            // 3. Update the master list of all batches
            setAllBatches(prevBatches => {
                const newBatches = [...prevBatches];
                newBatches[currentBatchIndex] = {
                    ...newBatches[currentBatchIndex],
                    currentIdx: nextElementIndex,
                    stage: nextStage,
                    // completed: newBatches[currentBatchIndex].completed // Keep existing completed status or update based on nextStage?
                };
                return newBatches;
            });

            // 4. Update the current element display if there are more elements in this batch
            if (!isLastElementInBatch && prodBoq.content[nextElementIndex]) {
                 setCurrElement({
                    ...prodBoq.content[nextElementIndex],
                    totalQty: (prodBoq.content[nextElementIndex].qty * batchQty).toFixed(2)
                });
            } else {
                // Clear current element if batch screening is done
                 setCurrElement({ name: '', qty: '', mixTime: '', _id: '', totalQty: '' });
            }

            // --- Handle UI Changes ---
            handleClose(); // Close the backdrop

            if (isLastElementInBatch) {
                // Navigate to the next stage for this batch
                navigate(`/screen/${id}/test/${currentBatchIndex + 1}`);
            }

        } catch (error) {
            console.error("Error handling completion:", error);
            // Consider adding user feedback like a snackbar message
            // Potentially revert optimistic UI updates or refetch state?
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
            switch (allBatches[selectedBatch].stage) {
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
        updateIdx();
        setTimeout(() => {
            countdownRef.current.start();
        }, 1);
    }

    const setCountdownRef = (countdown) => {
        if (countdown) {
            countdownRef.current = countdown.getApi();
        }
    }

    const handleClose = () => {
        setBackdropOpen(false);
    }

    const formatDisplayNumber = (input) => {
        if (input === 'NaN' || input === null || input === undefined)
            return "-";

        const numberValue = parseFloat(input);
        const isWholeNumber = Number.isInteger(numberValue);

        return isWholeNumber ? Math.floor(numberValue) : numberValue;
    };


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
                        <TabPanel key={i} value={`${i + 1}`} sx={{ padding: '30px 0 0 0' }}>
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                                <Grid item xs={3}>
                                    <Paper align='center'>
                                        <Box p={2}>
                                            <Typography gutterBottom variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
                                                Composition
                                            </Typography>
                                            <Divider />
                                            {prodBoq.content.map((materials, element) => (
                                                <div key={element}>
                                                    <span style={{ fontSize: '34px' }}>{materials.name}</span>
                                                    <Divider />
                                                </div>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={5.5}>
                                    <Paper align='center'>
                                        <Box p={2}>
                                            <Typography gutterBottom variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
                                                Current Element
                                            </Typography>
                                            <Divider />
                                            <div>
                                                <Typography gutterBottom variant='h1' component='div' fontWeight={500}>
                                                    {currElement ? (currElement.name ? currElement.name : '-') : '-'}
                                                </Typography>
                                                <Divider />
                                                <Typography gutterBottom variant='h1' component='div' fontWeight={500}>
                                                    {currElement.totalQty ? formatDisplayNumber(currElement.totalQty) : '-'}
                                                </Typography>
                                            </div>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={3.5}>
                                    <Paper align='center'>
                                        <Box p={2}>
                                            <Typography gutterBottom variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
                                                Completed
                                            </Typography>
                                            <Divider />
                                            {completedElements && completedElements.map((element, i) => (
                                                <div key={i}>
                                                    <span style={{ fontSize: '24px' }}>{element.name} - {`Batch ${element.batch}`} - {element.totalQty}</span>
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
                                        date={time + ((currElement.mixTime === 0 ? currElement.mixTime + 1 : currElement.mixTime) * 1000)}
                                        onComplete={handleCompletion}
                                        autoStart={false}
                                        key={time}
                                        ref={setCountdownRef}
                                        renderer={renderer}
                                    />
                                </Box>
                            </Backdrop>
                            {allBatches[selectedBatch]?.completed ? <ShowLabels batchId={i + 1} /> : null}
                        </TabPanel>
                    ))}

                </TabContext>
            </Container>
        </>
    )
}