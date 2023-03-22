import './App.css';
import React from 'react';
// import Navbar from './components/Navbar/Navbar';
import {
    BrowserRouter, Routes, Route
} from "react-router-dom";
// import { Box } from '@mui/system'
// import Login from './components/Auth/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/en-gb';
import { AuthProvider } from './context/AuthProvider';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                    <Dashboard />
                </LocalizationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
