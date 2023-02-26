import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArticleIcon from '@mui/icons-material/Article';
import { Link, Routes, Route } from 'react-router-dom';

import { RawMaterial } from '../RawMaterial/RawMaterial';
import { Bucket } from '../Bucket/Bucket';
import { Boq } from '../BOQ/Boq';
import { AddBoq } from '../BOQ/AddBoq';
import { EditBoq } from '../BOQ/EditBoq';
import { AdjustRM } from '../Adjust/AdjustRM';
import { AdjustBkt } from '../Adjust/AdjustBkt';
import { Production } from '../Production/Production';
import { ScreenMain } from '../Screening/ScreenMain';
import { ScreenProd } from '../Screening/ScreenProd';
import { QualityTest } from '../Screening/QualityTest';
import { BucketFill } from '../Screening/BucketFill';
import RequireAuth from '../Auth/RequireAuth';
import Label from '../Screening/Label';
import { BatchReportPrintHelper } from '../Reports/BatchReport';

const drawerWidth = 240;

const navigation = [
    { name: 'Raw Material', icon: <ArticleIcon />, href: '/raw-material' },
    { name: 'Bucket', icon: <ArticleIcon />, href: '/bucket' },
    { name: 'BOQ', icon: <ArticleIcon />, href: '/boq' },
    { name: 'Adjust Raw Material', icon: <ArticleIcon />, href: '/adjust-rm' },
    { name: 'Adjust Bucket', icon: <ArticleIcon />, href: '/adjust-bkt' },
    { name: 'Production', icon: <ArticleIcon />, href: '/production' },
    { name: 'Screening', icon: <ArticleIcon />, href: '/screen' },
];

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Navbar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Duromax
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {navigation.map((item) => (
                        <Link key={item.name} to={item.href} className="navLinks">
                            <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.icon}
                                        {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Drawer>
            {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
             */}
            <Box component="main" sx={{ paddingTop: 8, paddingLeft: 8, backgroundColor: 'whitesmoke', minHeight: '100vh' }}>
                <Routes>
                    <Route path="/screen" element={<ScreenMain />} />
                    <Route path="/screen/:id" element={<ScreenProd />} />
                    <Route path='/screen/:id/test/:batchId' element={<QualityTest />} />
                    <Route path="/screen/:id/bktFill/:batchId" element={<BucketFill />} />
                    <Route path="/screen/:id/label/:batchId" element={<Label />} />

                    <Route path="/reports/prod/:id/:batchId" element={<BatchReportPrintHelper />} />

                    <Route element={<RequireAuth allowedRoles={['Admin']} />} >
                        <Route path="/raw-material" element={<RawMaterial />} />
                        <Route path="/bucket" element={<Bucket />} />
                        <Route path="/boq" element={<Boq />} />
                        <Route path="/boq/add" element={<AddBoq />} />
                        <Route path="/boq/edit/:id" element={<EditBoq />} />
                        <Route path="/adjust-rm" element={<AdjustRM />} />
                        <Route path="/adjust-bkt" element={<AdjustBkt />} />
                        <Route path="/production" element={<Production />} />
                    </Route>


                </Routes>
            </Box>
        </Box>
    );
}

