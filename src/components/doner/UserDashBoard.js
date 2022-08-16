import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import Typography from '@material-ui/core/Typography'

import { Table, Divider } from 'antd'
import 'antd/dist/antd.css'

const columns = [
  {
    title: 'Event Action',
    dataIndex: 'EventAction',
  },
  {
    title: 'Event Info',
    dataIndex: 'EventInfo',
  },
  {
    title: 'Event Details',
    dataIndex: 'EventDetails',
  },
  {
    title: 'Timestamp',
    dataIndex: 'DateTime',
  },
]

export default function SupplierDashBoard(props) {
  const ethereum = window.ethereum

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(0),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },

    input: {
      margin: theme.spacing(1, 0, 1),
    },

    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }))

  const useStylesGrid = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  }))

  const classes = useStyles()
  const classesGride = useStylesGrid()
  const [eventDetails, seteventDetails] = useState('')
  const myContract = props.myContractObj

  const [addressEtherBal, setaddressEtherBal] = useState('')
  const [addressCCBal, setaddressCCBal] = useState('')

  useEffect(() => {
    getEventDetails()
  }, [])

  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')

  const [open1, setOpen1] = useState(false)

  const handleClickOpen1 = () => {
    setOpen1(true)
  }

  const handleClose1 = async () => {
    const infoValue = await myContract.methods.getCC().send({
      from: props.payAddress, gas: 999999,
      value: parseInt(text1) * 10 ** 18,
    })
    console.log(infoValue)
    getEventDetails()
    setOpen1(false)
  }

  const cancel1 = () => {
    setOpen1(false)
  }

  const [open2, setOpen2] = useState(false)

  const handleClickOpen2 = () => {
    setOpen2(true)
  }

  const handleClose2 = async () => {
    const infoValue = await myContract.methods
      .givebackCC(text2)
      .send({ from: props.payAddress, gas: 999999 })
    console.log(infoValue)
    getEventDetails()
    setOpen2(false)
  }

  const cancel2 = () => {
    setOpen2(false)
  }

  const text1ChangeHandle = (event) => {
    setText1(event.target.value)
  }

  const text2ChangeHandle = (event) => {
    setText2(event.target.value)
  }

  const getEventDetails = async () => {
    console.log('Web3: ', myContract)
    myContract.getPastEvents(
      'SystemLog2',
      {
        filter: { EventTriggeredBy: props.payAddress },
        fromBlock: 0,
        toBlock: 'latest',
      },
      async (err, events) => {
        console.log('====>events', events)
        let eventDetails = []

        for (let i = 0; i < events.length; i++) {
          let tokenValue = 'Not Required'

          let blockData = await props.we3Obj.eth.getBlock(events[i].blockNumber)
          console.log(blockData)
          var blockTime = new Date(blockData.timestamp * 1000)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ')

          if (events[i].returnValues.TokenConsumption > '0') {
            tokenValue = events[i].returnValues.TokenConsumption
          }

          let newEvent = {
            key: i,
            transactionHash: events[i].transactionHash,
            EventAction: events[i].returnValues.EventAction,
            EventInfo: events[i].returnValues.Data1,
            EventDetails: events[i].returnValues.Data2,
            EventTriggeredBy: events[i].returnValues.EventTriggeredBy,
            TokenConsumption: tokenValue,
            DateTime: blockTime,
          }
          eventDetails.push(newEvent)
        }
        seteventDetails(eventDetails)
      },
    )
  }

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h5">
        Notification Log
      </Typography>
      <div style={{ height: 400, width: 900 }}>
        <Divider />

        <Table columns={columns} dataSource={eventDetails} />
      </div>
      <Dialog
        open={open1}
        onClose={cancel1}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Buy Carbon Credit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount (ETH)"
            type="email"
            onChange={text1ChangeHandle}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel1} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose1} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open2}
        onClose={cancel2}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Return Carbon Credit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Amount"
            onChange={text2ChangeHandle}
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel2} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose2} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
