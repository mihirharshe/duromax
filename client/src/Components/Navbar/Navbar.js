import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { Tooltip, Collapse } from '@mui/material';
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
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { RawMaterial } from '../RawMaterial/RawMaterial';
import { Bucket } from '../Bucket/Bucket';
import { Customer } from '../Customer/Customer';
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
import { BucketInventory } from '../Reports/BucketInventory';
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
import StockInventory from '../Reports/StockInventory';
import { BucketSales } from '../Reports/BucketSales';
import { Restock } from '../Restock/Restock';

const drawerWidth = 240;

const navigation = [
    {
        name: 'Master',
        icon: <ArticleIcon />,
        allowedRoles: ['Admin'],
        subItems: [
            { name: 'Raw Material', href: '/raw-material' },
            { name: 'Bucket', href: '/bucket' },
            { name: 'Customer', href: '/customer' }
        ]
    },
    { name: 'BOQ', icon: <ArticleIcon />, href: '/boq', allowedRoles: ['Admin'] },
    { name: 'Adjust Raw Material', icon: <ArticleIcon />, href: '/adjust-rm', allowedRoles: ['Admin', 'FactoryMain', 'Manager'] },
    { name: 'Adjust Bucket', icon: <ArticleIcon />, href: '/adjust-bkt', allowedRoles: ['Admin', 'FactoryMain', 'Manager'] },
    { name: 'Production', icon: <ArticleIcon />, href: '/production', allowedRoles: ['Admin', 'Manager'] },
    { name: 'Screening', icon: <ArticleIcon />, href: '/screen', allowedRoles: ['Admin', 'Factory', 'FactoryMain'] },
    { name: 'Bucket Inventory', icon: <ArticleIcon />, href: '/bucket-inventory', allowedRoles: ['Admin', 'Factory', 'FactoryMain', 'Manager'] },
    { name: 'Bucket Sales', icon: <ArticleIcon />, href: '/bucket-sales', allowedRoles: ['Admin', 'Factory', 'FactoryMain', 'Manager'] },
    { name: 'Stock Inventory', icon: <ArticleIcon />, href: '/stock-inventory', allowedRoles: ['Admin', 'Factory', 'FactoryMain', 'Manager'] },
    {
        name: 'Reports',
        icon: <ArticleIcon />,
        allowedRoles: ['Admin', 'Factory', 'FactoryMain', 'Manager'],
        subItems: [
            { name: 'Sales Report', href: '/reports/sales' },
            { name: 'Batch Report', href: '/reports/batch' },
            { name: 'RM Report', href: '/reports/raw-materials' },
            { name: 'Buckets Report', href: '/reports/buckets' },
            { name: 'Stock Out Report', href: '/reports/stock-out' }
        ]
    },
    { name: 'Stock Out', icon: <ArticleIcon />, href: '/stock-out', allowedRoles: ['Admin', 'Manager', 'Factory', 'FactoryMain'] },
    { name: 'Generate Label', icon: <ArticleIcon />, href: '/generate-label', allowedRoles: ['Admin', 'Manager', 'Factory', 'FactoryMain'] },
    { name: 'Restock', icon: <ArticleIcon />, href: '/restock', allowedRoles: ['Admin', 'Manager', 'Factory', 'FactoryMain'] },
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
    const [subMenus, setSubMenus] = React.useState({});
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

    const toggleSubMenu = (itemName) => {
        setSubMenus(prev => ({
            ...prev,
            [itemName]: !prev[itemName]
        }));
    };

    // Add click event listener to close drawer when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if drawer is open and click is outside drawer and hamburger menu
            if (open && 
                !event.target.closest('.MuiDrawer-paper') && 
                !event.target.closest('[aria-label="open drawer"]')) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

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
                            <React.Fragment key={item.name}>
                                {item.subItems ? (
                                    <>
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={() => toggleSubMenu(item.name)}
                                                sx={{
                                                    minHeight: 48,
                                                    justifyContent: open ? 'initial' : 'center',
                                                    px: 2.5,
                                                }}>
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        mr: open ? 3 : 'auto',
                                                        justifyContent: 'center',
                                                    }}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                                                {open && (subMenus[item.name] ? <ExpandLess /> : <ExpandMore />)}
                                            </ListItemButton>
                                        </ListItem>
                                        <Collapse in={subMenus[item.name] && open} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {item.subItems.map((subItem) => (
                                                    <Link key={subItem.name} to={subItem.href} className="navLinks">
                                                        <ListItemButton sx={{ pl: 4 }}>
                                                            <ListItemIcon>
                                                                <ArticleIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={subItem.name} />
                                                        </ListItemButton>
                                                    </Link>
                                                ))}
                                            </List>
                                        </Collapse>
                                    </>
                                ) : (
                                    <Link to={item.href} className="navLinks">
                                        <Tooltip title={item.name} arrow placement='right'>
                                            <ListItem disablePadding sx={{ display: 'block' }}>
                                                <ListItemButton
                                                    sx={{
                                                        minHeight: 48,
                                                        justifyContent: open ? 'initial' : 'center',
                                                        px: 2.5,
                                                    }}>
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 0,
                                                            mr: open ? 3 : 'auto',
                                                            justifyContent: 'center',
                                                        }}>
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                                                </ListItemButton>
                                            </ListItem>
                                        </Tooltip>
                                    </Link>
                                )}
                            </React.Fragment>
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
                    <Route path="/bucket-inventory" element={<BucketInventory />} />
                    <Route path="/bucket-sales" element={<BucketSales />} />
                    <Route path="/stock-inventory" element={<StockInventory />} />
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
                        <Route path="/customer" element={<Customer />} />
                        <Route path="/boq" element={<Boq />} />
                        <Route path="/boq/add" element={<AddBoq />} />
                        <Route path="/boq/edit/:id" element={<EditBoq />} />
                    </Route>

                    <Route path="/restock" element={<Restock />} />

                </Routes>
            </Box>
        </Box>
    );
}
