import './App.css';
import React from 'react';
import Navbar from './components/Navbar/Navbar';
import {
    BrowserRouter, Routes, Route
} from "react-router-dom";
import { Box } from '@mui/system'
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from './context/AuthProvider';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Dashboard />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
