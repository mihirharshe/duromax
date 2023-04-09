import React, { useState } from 'react'
import { Container, Paper, Box, TextField, Stack, Button, Grid, Typography } from '@mui/material'
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import useAuth from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login = () => {

    const baseUrl = process.env.REACT_APP_API_URL;

    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState({
        email: '',
        password: ''
    });

    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const validateEmail = (email) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [id]: value,
        }));
        setError((prev) => ({
            ...prev,
            [id]: '',
        }))
    }

    const handleBlur = (e) => {
        const { id, value } = e.target;
        if (id === 'email') {
            if (!validateEmail(value)) {
                setError((prev) => ({
                    ...prev,
                    email: 'Invalid email address',
                }))
            }
        }
        if(id === 'password'){
            if(value.length < 5){
                setError((prev) => ({
                    ...prev,
                    password: 'Password must be at least 5 characters',
                }))
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!validateEmail(user.email) || user.password.length < 5) {
                return;
            }
            const response = await axios.post(`${baseUrl}/api/v1/auth/login`, user, { withCredentials: true });
            const accessToken = response?.data?.accessToken;
            const decoded = jwt_decode(accessToken);
            // const roles = decoded?.UserInfo?.roles;
            // const name = decoded?.UserInfo?.name;
            const userDetails = {
                id: decoded?.UserInfo?.id,
                email: decoded?.UserInfo?.email,
                name: decoded?.UserInfo?.name,
                accessToken
            };
            setAuth({
                user: userDetails,
                roles: decoded?.UserInfo?.roles
            });
            // localStorage.setItem('token', accessToken);
            // console.log(response);
            console.log(decoded);
            setSuccess(true);
            setError({ email: '', password: '' });
            setErrMsg('');
            setUser({ email: '', password: '' });
            // console.log(user);
            navigate(from, { replace: true });
        } catch(err) {
            setErrMsg(err?.response?.data?.message);
            console.log(err);
        }
        
    }



    return (
        <div style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1920' height='1080' preserveAspectRatio='none' viewBox='0 0 1920 1080'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1107%26quot%3b)' fill='none'%3e%3crect width='1920' height='1080' x='0' y='0' fill='%230e2a47'%3e%3c/rect%3e%3cpath d='M 0%2c269 C 128%2c241 384%2c124 640%2c129 C 896%2c134 1024%2c284.4 1280%2c294 C 1536%2c303.6 1792%2c200.4 1920%2c177L1920 1080L0 1080z' fill='%2391b7d8'%3e%3c/path%3e%3cpath d='M 0%2c443 C 128%2c474.4 384%2c592 640%2c600 C 896%2c608 1024%2c474.4 1280%2c483 C 1536%2c491.6 1792%2c611 1920%2c643L1920 1080L0 1080z' fill='%23184a7e'%3e%3c/path%3e%3cpath d='M 0%2c942 C 128%2c901.2 384%2c719.4 640%2c738 C 896%2c756.6 1024%2c1015.2 1280%2c1035 C 1536%2c1054.8 1792%2c876.6 1920%2c837L1920 1080L0 1080z' fill='%232264ab'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1107'%3e%3crect width='1920' height='1080' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")` }}>
            <Container maxWidth="sm">
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    // alignItems="center"
                    justifyContent="center"
                    sx={{ minHeight: '100vh', maxWidth: '70%', margin: 'auto' }}
                >
                    {/* {success && 
                        <Typography variant="h6" component="div" gutterBottom color={'green'}>
                            Login successful
                        </Typography>
                    }
                    {errMsg &&
                        <Typography variant="h6" component="div" gutterBottom color={'red'}>
                            {errMsg}
                        </Typography>
                    } */}
                    <Grid item xs={3}>

                        <Paper elevation={12} sx={{ padding: 5 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" component="div" gutterBottom sx={{ fontWeight: '500' }}>Login</Typography>
                            </Box>
                            <form onSubmit={handleSubmit}>
                                <Stack spacing={2}>
                                    {/* <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" />
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" />
                            <button type="submit">Login</button> */}
                                    <TextField
                                        id='email'
                                        label='Email'
                                        type='text'
                                        required
                                        fullWidth
                                        autoComplete='off'
                                        value={user.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={error.email ? true : false}
                                        helperText={error.email}
                                        sx={{ backgroundColor: 'white' }}
                                    />
                                    <TextField
                                        id='password'
                                        label='Password'
                                        type='password'
                                        required
                                        fullWidth
                                        value={user.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={error.password ? true : false}
                                        helperText={error.password}
                                        sx={{ backgroundColor: 'white' }}
                                    />
                                    {errMsg &&
                                        <Typography variant="p" component="div" gutterBottom color={'red'}>
                                            {errMsg}
                                        </Typography>
                                    }
                                    {success &&
                                        <Typography variant="p" component="div" gutterBottom color={'green'}>
                                            Login successful
                                        </Typography>
                                    }
                                    <Button variant='contained' type='submit'>Login</Button>
                                </Stack>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}