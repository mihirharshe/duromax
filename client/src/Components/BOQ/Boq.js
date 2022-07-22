import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

export const Boq = () => {
    return (
        <>
            <Container maxWidth='lg' sx={{ marginTop: 2 }}>
                <Box display='flex' alignItems='center' justifyContent='space-between' marginBottom={1}>
                    <Box component='span'>List of BOQs :</Box>
                </Box>
            </Container>
        </>
    )
}
