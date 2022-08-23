import React from "react";
import clsx from "clsx";

import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import ContactsIcon from "@material-ui/icons/Contacts";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AddCompaign from "./AddCompaign";
import AdminDashBoard from "./AdminDashBoard";
import ViewDetails from "./ViewDetails";
import AddTask from "./AddTask";
import TaskUpdate from "./TaskUpdate";
import AllotOrgAdmin from "./AllotOrgAdmin";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function AdminHomePage(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap style={{ color: "white" }}>
            Grant Chain
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <Link
              to="/"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem button key="Dashboard">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>

            <Link
              to="/AddCompaign"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem button key="Create Campaign">
                <ListItemIcon>
                  <AccountBalanceWalletIcon />
                </ListItemIcon>
                <ListItemText primary="Create Campaign" />
              </ListItem>
            </Link>

            {/* <Link
              to="/CreateTask"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem button key="Create Task">
                <ListItemIcon>
                  <ContactsIcon />
                </ListItemIcon>
                <ListItemText primary="Create Task" />
              </ListItem>
            </Link> */}

            <Link
              to="/AllotOrgAdmin"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem button key="Allot Campaign Admin">
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Allot Campaign Admin" />
              </ListItem>
            </Link>

            <Link
              to="/ViewDetails"
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <ListItem button key="View Details">
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="View Details" />
              </ListItem>
            </Link>
          </List>
          <Divider />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <Switch>
            <Route exact path="/">
              <AdminDashBoard
                myContractObj={props.myContractObj}
                we3Obj={props.we3Obj}
                contractAddress={props.contractAddress}
                payAddress={props.payAddress}
              />
            </Route>
            <Route path="/AddCompaign">
              <AddCompaign myContractObj={props.myContractObj} payAddress={props.payAddress} />
            </Route>
            {/* <Route path="/CreateTask">
              <AddTask myContractObj={props.myContractObj} payAddress={props.payAddress} />
            </Route> */}
            <Route path="/AllotOrgAdmin">
              <AllotOrgAdmin myContractObj={props.myContractObj} userName={props.userName} payAddress={props.payAddress} />
            </Route>
            <Route path="/ViewDetails">
              <ViewDetails myContractObj={props.myContractObj} payAddress={props.payAddress} />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}
