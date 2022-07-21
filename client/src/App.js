import './App.css';
import React from 'react';
import Navbar from './Components/Navbar/Navbar';
import {
    BrowserRouter,
} from "react-router-dom";
import { Box } from '@mui/system'

function App() {
    return (
        <BrowserRouter>
            <Navbar />
        </BrowserRouter>
    );
}

export default App;
