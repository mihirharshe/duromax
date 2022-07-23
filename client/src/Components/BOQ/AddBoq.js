import React, { useState, useEffect ,useMemo } from 'react'
import axios from 'axios';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export const AddBoq = () => {

    const [boq, setBoq] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/boq');
                setBoq(res.data.boq);
            } catch(err) {
                console.log(err)
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }} >
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>ADD BOQs:</Box>
                </Box>
                <Stack spacing={2}>
                    <Item elevation={2}> Item 1 </Item>
                    <Item elevation={3}> Item 2 </Item>
                    <Item elevation={3}> Item 3 </Item>
                    <Item elevation={3}> Item 4 </Item>
                    <Item elevation={3}> Item 5 </Item>
                </Stack>
            </Container>
        </>
    )
}