import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { Table, Divider } from 'antd'
import 'antd/dist/antd.css'

const axios = require('axios').default

const columnsT2 = [
  {
    title: 'Certificate ID',
    dataIndex: 'idDonation',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
  },
]
export default function DonationHistory(props) {
  const [certificateID, setcertificateID] = useState('')
  const [campaignName, setcampaignName] = useState('')
  const [amount, setamount] = useState('')

  useEffect(() => {
    getDonationDetails()
  }, [])

  const [donationDetails, setdonationDetails] = useState([])

  const getDonationDetails = async () => {
    let donationList = []

    let donationData = await axios.post('http://127.0.0.1:3001/findDonation', {
      emailid: props.userName,
    })

    donationData.data.map((value, key) => {
      let newdonationList = {
        key: key,
        idDonation: value.donaitionid,
        amount: value.amount,
      }
      donationList.push(newdonationList)
    })

    console.log('=======================>hai', donationData.data)
    setdonationDetails(donationList)
  }

  const rowSelectionT2 = {
    onChange: (selectedRowKeys, selectedRows) => {
      let cid = selectedRows[0].idDonation
      let campaignNme = selectedRows[0].nameCapaign
      let amount = selectedRows[0].amount
      setcertificateID(cid)
      setcampaignName(campaignNme)
      setamount(amount)
    },
  }

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
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Donation History
        </Typography>

        <div style={{ width: 800 }}>
          <Divider />

          <Table
            rowSelection={{
              type: 'radio',
              ...rowSelectionT2,
            }}
            columns={columnsT2}
            dataSource={donationDetails}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleClickOpen}
        >
          Show Certificate
        </Button>

        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Certificate of Donation'}
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                We hereby express our sincere appreciation to{' '}
                <b>{props.userName}</b>.
              </Typography>
              <Typography gutterBottom>
                In recogition of your donation to help the participants of the{' '}
                <b>Grant Chain</b> platfrom for the amount of <b>{amount}</b>.
              </Typography>
              <Typography gutterBottom>
                Certificate ID: # <b>{certificateID}</b>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary" autoFocus>
                Print
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </Container>
  )
}
