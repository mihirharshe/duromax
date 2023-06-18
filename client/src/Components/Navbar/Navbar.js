import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
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
import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

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
import PersistLogin from '../Auth/PersistLogin';
import Label from '../Screening/Label';
import { BatchReportPrintHelper } from '../Reports/BatchReport';
import { StockReportPrintHelper } from '../Reports/StockOutReport';
import { StockInventory } from '../Reports/StockInventory';
import SalesReport from '../Reports/SalesReport';
import RawMaterialReport from '../Reports/RawMaterialReport';
import AdjRMReport from '../Reports/AdjRMReport';
import BucketReport from '../Reports/BucketReport';
import AdjBktReport from '../Reports/AdjBktReport';
import useLogout from '../../hooks/useLogout';
import BatchReportsTable from '../Reports/BatchReportsTable';
import useAuth from '../../hooks/useAuth';
import GenerateLabel from '../ManualLabel/GenerateLabel';
import StockOut from '../StockOut/StockOut';
import StockOutReportsTable from '../Reports/StockOutReportsTable';

const drawerWidth = 240;

const navigation = [
    { name: 'Raw Material', icon: <ArticleIcon />, href: '/raw-material', allowedRoles: ['Admin'] },
    { name: 'Bucket', icon: <ArticleIcon />, href: '/bucket', allowedRoles: ['Admin'] },
    { name: 'BOQ', icon: <ArticleIcon />, href: '/boq', allowedRoles: ['Admin'] },
    { name: 'Adjust Raw Material', icon: <ArticleIcon />, href: '/adjust-rm', allowedRoles: ['Admin', 'FactoryMain', 'Manager'] },
    { name: 'Adjust Bucket', icon: <ArticleIcon />, href: '/adjust-bkt', allowedRoles: ['Admin', 'FactoryMain', 'Manager'] },
    { name: 'Production', icon: <ArticleIcon />, href: '/production', allowedRoles: ['Admin', 'Manager'] },
    { name: 'Screening', icon: <ArticleIcon />, href: '/screen', allowedRoles: ['Admin', 'Factory', 'FactoryMain'] },
    { name: 'Stock Inventory', icon: <ArticleIcon />, href: '/inventory', allowedRoles: ['Admin', 'Factory', 'FactoryMain', 'Manager'] },
    { name: 'Sales Report', icon: <ArticleIcon />, href: '/reports/sales', allowedRoles: ['Admin', 'Factory', 'FactoryMain', 'Manager'] },
    { name: 'Batch Report', icon: <ArticleIcon />, href: '/reports/batch', allowedRoles: ['Admin', 'Factory', 'FactoryMain', 'Manager'] },
    { name: 'RM Report', icon: <ArticleIcon />, href: '/reports/raw-materials', allowedRoles: ['Admin', 'Manager'] },
    { name: 'Buckets Report', icon: <ArticleIcon />, href: '/reports/buckets', allowedRoles: ['Admin', 'Manager'] },
    { name: 'Stock Out Report', icon: <ArticleIcon />, href: '/reports/stock-out', allowedRoles: ['Admin', 'Manager'] },
    { name: 'Stock Out', icon: <ArticleIcon />, href: '/stock-out', allowedRoles: ['Admin', 'Manager'] },
    { name: 'Generate Label', icon: <ArticleIcon />, href: '/generate-label', allowedRoles: ['Admin', 'Manager', 'Factory', 'FactoryMain'] },
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
    const { auth } = useAuth();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const logout = useLogout();
    const navigate = useNavigate();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

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
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Duromax
                    </Typography>
                    <Button variant="contained" color="info" onClick={handleLogout}>LOGOUT</Button>
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
                    {navigation
                        .filter((item) => {
                            return item.allowedRoles.some(role => auth.roles.includes(role));
                        })
                        .map((item) => (
                            <Link key={item.name} to={item.href} className="navLinks">
                                <Tooltip title={item.name} arrow placement='right'>
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
                                </Tooltip>
                            </Link>
                        ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ paddingTop: 8, paddingLeft: 8, backgroundColor: 'whitesmoke', minHeight: '100vh' }}>
                <Routes>
                    <Route element={<RequireAuth allowedRoles={['Admin', 'Factory', 'FactoryMain']} />} >
                        <Route path="/screen" element={<ScreenMain />} />
                        <Route path="/screen/:id" element={<ScreenProd />} />
                        <Route path='/screen/:id/test/:batchId' element={<QualityTest />} />
                        <Route path="/screen/:id/bktFill/:batchId" element={<BucketFill />} />
                        <Route path="/screen/:id/label/:batchId" element={<Label />} />
                    </Route>

                    <Route path="/reports/sales" element={<SalesReport />} />
                    <Route path="/inventory" element={<StockInventory />} />
                    <Route path="/reports/batch" element={<BatchReportsTable />} />
                    <Route path="/reports/batch/:id/:batchId" element={<BatchReportPrintHelper />} />
                    <Route path='/reports/stock-out' element={<StockOutReportsTable />} />
                    <Route path="/reports/stock-out/:transactionId" element={<StockReportPrintHelper />} />

                    <Route path="/generate-label" element={<GenerateLabel />} />
                    <Route path="/stock-out" element={<StockOut />} />

                    <Route element={<RequireAuth allowedRoles={['Admin', 'Manager', 'FactoryMain']} />} >
                        <Route path="/adjust-rm" element={<AdjustRM />} />
                        <Route path="/adjust-bkt" element={<AdjustBkt />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={['Admin', 'Manager']} />} >
                        <Route path="/production" element={<Production />} />
                        <Route path="/reports/raw-materials" element={<RawMaterialReport />} />
                        <Route path="/reports/raw-materials/:name" element={<AdjRMReport />} />
                        <Route path="/reports/buckets" element={<BucketReport />} />
                        <Route path="/reports/buckets/:id" element={<AdjBktReport />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={['Admin']} />} >
                        <Route path="/raw-material" element={<RawMaterial />} />
                        <Route path="/bucket" element={<Bucket />} />
                        <Route path="/boq" element={<Boq />} />
                        <Route path="/boq/add" element={<AddBoq />} />
                        <Route path="/boq/edit/:id" element={<EditBoq />} />
                    </Route>

                </Routes>
            </Box>
        </Box>
    );
}

