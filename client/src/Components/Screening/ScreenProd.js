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
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useParams } from 'react-router-dom';
import Countdown from 'react-countdown';

export const ScreenProd = () => {

    const { id } = useParams();
    const countdownRef = useRef();
    const [time, setTime] = useState(Date.now());

    const [backdropOpen, setBackdropOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [prodBoq, setProdBoq] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(0);
    const [idx, setIdx] = useState(0);
    const [allBatches, setAllBatches] = useState([]);

    const [completedElements, setCompletedElements] = useState([]);
    const [currElement, setCurrElement] = useState({
        name: '',
        qty: '',
        mixTime: '',
        _id: ''
    });

    // const handleSelectBatch = (batchNumber) => {
    //     setSelectedBatch(batchNumber);
    // }

    useEffect(() => {
        const fetchProd = async () => {
            try {
                console.log("fetching prod")
                const res = await axios.get(`http://localhost:5000/prod/${id}`);
                setSelectedProduct(res.data.production);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchProd();
    }, []);

    useEffect(() => {
        if (selectedProduct.name) {
            const fetchBoq = async () => {
                try {
                    console.log("fetching boq")
                    const res = await axios.get(`http://localhost:5000/boq/name/${selectedProduct.name}`);
                    setProdBoq(res.data.boq);
                    setCurrElement(res.data.boq.content[0]);
                }
                catch (err) {
                    console.log(err);
                }
            }
            fetchBoq();
        }
    }, [selectedProduct]);

    const batch_size = prodBoq.batch_size;
    const prodQty = selectedProduct.qty;
    const batchCount = Math.ceil(prodQty / batch_size);
    const generateBatchArray = (batchCount) => {
        return batchCount ? (new Array(batchCount).fill({ success: false, content: prodBoq.content })) : [];
    }

    const batchArray = useMemo(() => generateBatchArray(batchCount), [batchCount]);

    useEffect(() => {
        setAllBatches(batchArray);
    }, [batchArray]);

    console.log(allBatches);

    const handleSelectElement = () => {
        setCurrElement(batchArray[selectedBatch].content[idx]);
    }

    const [value, setValue] = useState('1');
    const handleTabChange = (e, newValue) => {
        setValue(newValue);
        setSelectedBatch(newValue - 1);
    }

    const handleCompletion = () => {
        if (!allBatches[selectedBatch].success) {
            setCompletedElements([...completedElements, currElement]);
            console.log(idx);
            handleClose();
            console.log(allBatches[selectedBatch].content.length, 'length');
            if (idx >= allBatches[selectedBatch].content.length) {
                console.log("success");
                setIdx(0);
                const updatedBatch = [...allBatches];
                updatedBatch.splice(selectedBatch, 1, { success: true, content: prodBoq.content });
                setAllBatches(updatedBatch);
                setCurrElement({
                    name: '',
                    qty: '',
                    mixTime: '',
                    _id: ''
                })
                return;
            }
            handleSelectElement();
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

    const handleStart = () => {
        setBackdropOpen(!backdropOpen);
        setTime(Date.now());
        setIdx(idx + 1);
        setTimeout(() => {
            countdownRef.current.api.start();
        }, 1);
        console.log(countdownRef);
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
                            {batchArray.map((batch, i) => (
                                batch.success === true ? 
                                <Tab key={i} label={`Batch ${i + 1}`} value={`${i + 1}`} disabled /> 
                                :
                                <Tab key={i} label={`Batch ${i + 1}`} value={`${i + 1}`} />
                            ))}
                            {/* <Tab label='Tab One' value='1'/>
                            <Tab label='Tab Two' value='2'/>
                            <Tab label='Tab Three' value='3'/> */}
                        </TabList>
                    </Box>
                    {batchArray.map((batch, i) => (
                        <TabPanel key={i} value={`${i + 1}`}>
                            Batch {i + 1}
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                <Paper>
                                    <Box p={2}>
                                        <Stack spacing={0.5}>
                                            <Typography gutterBottom variant='h6' component='div'>
                                                Composition
                                            </Typography>
                                            {batch.content.map((materials, element) => (
                                                <div key={element}>
                                                    <span>{materials.name}</span>
                                                    <Divider />
                                                </div>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Paper>
                                <Paper>
                                    <Box p={2}>
                                        <Typography gutterBottom variant='h6' component='div'>
                                            Current Element
                                        </Typography>
                                        {currElement && currElement.name}
                                        <Divider />
                                    </Box>
                                </Paper>
                                <Paper>
                                    <Box p={2}>
                                        <Typography gutterBottom variant='h6' component='div'>
                                            Completed
                                        </Typography>
                                        {completedElements && completedElements.map((element, i) => (
                                            <div key={i}>
                                                <span>{element.name}</span>
                                                <Divider />
                                            </div>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                            <Button variant='contained' sx={{ marginTop: 2 }} onClick={handleStart}>
                                Start
                            </Button>
                            <Backdrop open={backdropOpen} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Countdown 
                                        date={time + 3000} 
                                        onComplete={handleCompletion} 
                                        autoStart={false}
                                        key={time} 
                                        ref={countdownRef} 
                                        renderer={renderer} 
                                    />
                                </Box>
                            </Backdrop>
                        </TabPanel>
                    ))}
                    {/* <TabPanel value='1'>Panel one</TabPanel>
                    <TabPanel value='2'>Panel two</TabPanel>
                    <TabPanel value='3'>Panel three</TabPanel> */}
                </TabContext>
            </Container>
        </>
    )
}