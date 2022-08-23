import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { Select, MenuItem } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

const axios = require('axios').default

export default function AddTask(props) {

  const [compaignList, setCompaignList] = useState([]);

  const [open, setOpen] = React.useState(false)

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },

    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },

    input: {
      margin: theme.spacing(1, 0, 1),
    },

    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }))
  const classes = useStyles();

  useEffect(() => {
    getCampaignList();
  }, [])

  const getCampaignList = async () => {
    let campaignList = [];
    console.log("Add Task", props.userName)
    let response = await axios.post('http://127.0.0.1:3001/getOrgCampagin', {userName: props.userName});

    campaignList = response.data;

    // console.log('Add task data', campaignList[0][0]);
    setCompaignList(campaignList);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  const [idofcampaign, setidofcampaign] = useState();
  const [taskName, setTaskName] = useState();
  const [taskLocation, setTaskLocation] = useState();
  const [taskDetails, setTaskDetails] = useState();
  const [benificeirs, setBenificeirs] = useState();
  const [requiredAmount, setRequiredAmount] = useState();

  const submitHandler = async (event) => {
    event.preventDefault()

    await axios.post('http://127.0.0.1:3001/addTask', {
      projectname: taskName,
      campaginid: idofcampaign,
      location: taskLocation,
      budget: requiredAmount,
      completion: "0",
    })

    setOpen(true)
  }

  const compaignChangeHandler = (event) => {
    setidofcampaign(event.target.value)
  }

  const taskNameChangeHandler = (event) => {
    setTaskName(event.target.value)
  }

  const taskLocationChangeHandler = (event) => {
    setTaskLocation(event.target.value)
  }

  // const taskDetailsChangeHandler = (event) => {
  //   setTaskDetails(event.target.value)
  // }

  // const benificeirsChangeHandler = (event) => {
  //   setBenificeirs(event.target.value)
  // }

  const requiredAmountChangeHandler = (event) => {
    setRequiredAmount(event.target.value)
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create Project
        </Typography>
        <form noValidate onSubmit={submitHandler}>
          <Select
            labelId="nameofcampaign"
            id="nameofcampaign"
            value={idofcampaign ?? 'Select'}
            required
            fullWidth
            variant="outlined"
            onChange={compaignChangeHandler}
            className={classes.input}
          >
            {compaignList.map((data, key) => (
              <MenuItem key={key} value={data[0].campaginid}>
                {data[0].campaginname}
              </MenuItem>
            ))}
          </Select>

          <TextField
            autoComplete="taskname"
            name="taskname"
            variant="outlined"
            required
            fullWidth
            id="taskname"
            label="Task Name"
            autoFocus
            onChange={taskNameChangeHandler}
            className={classes.input}
          />

          <TextField
            autoComplete="tasklocation"
            name="tasklocation"
            variant="outlined"
            required
            fullWidth
            id="tasklocation"
            label="Task Location"
            autoFocus
            onChange={taskLocationChangeHandler}
            className={classes.input}
          />

          {/* <TextField
            autoComplete="taskdetails"
            name="taskdetails"
            variant="outlined"
            required
            fullWidth
            id="taskdetails"
            label="Task Details"
            autoFocus
            onChange={taskDetailsChangeHandler}
            className={classes.input}
          />

          <TextField
            autoComplete="taskbenificiary"
            name="taskbenificiary"
            variant="outlined"
            required
            fullWidth
            id="taskbenificiary"
            label="Task Beneficiaries"
            autoFocus
            onChange={benificeirsChangeHandler}
            className={classes.input}
          /> */}

          <TextField
            autoComplete="amount"
            name="amount"
            variant="outlined"
            required
            fullWidth
            id="amount"
            label="Required Amount"
            autoFocus
            onChange={requiredAmountChangeHandler}
            className={classes.input}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create Task
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
          Project Created Successfull
          </Alert>
        </Snackbar>
      </div>
    </Container>
  )
}
