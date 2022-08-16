import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { Select, MenuItem } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

export default function Donation(props) {
  const myContract = props.myContractObj
  const ethereum = window.ethereum

  const [compaignList, setCompaignList] = useState([])

  useEffect(() => {
    getCampaignList()
  }, [])

  const getCampaignList = async () => {
    let campaignCount = await myContract.methods.campaignCount().call()

    let campaignList = []

    for (let i = 0; i < campaignCount; i++) {
      let campaigndatas = await myContract.methods.campaignDetails(i).call()
      let newcampaignList = [i, campaigndatas.name]
      campaignList.push(newcampaignList)
    }
    console.log('=======================>hai', props.userName)
    setCompaignList(campaignList)
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  const [open, setOpen] = React.useState(false)

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
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

  const [nameofcampaign, setnameofcampaign] = useState('Select')
  const [idofcampaign, setidofcampaign] = useState()
  const [amount, setAmount] = useState()

  const submitHandler = async (event) => {
    event.preventDefault()
    let campaigndatas = await myContract.methods.campaignDetails(idofcampaign).call();
    const infoValue = await myContract.methods
      .newDonation(props.userName, campaigndatas.name, idofcampaign, amount)
      .send({ from: props.payAddress, gas: 999999 })
    console.log(infoValue);

    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const compaignChangeHandler = (event) => {
    setidofcampaign(event.target.value)
  }

  const amountChangeHandler = (event) => {
    setAmount(event.target.value)
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Donate
        </Typography>
        <br />
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
            {compaignList.map((data) => (
              <MenuItem key={data[0]} value={data[0]}>
                {data[1]}
              </MenuItem>
            ))}
          </Select>

          <TextField
            variant="outlined"
            required
            fullWidth
            id="amount"
            label="Amount (₹/⟠)"
            name="amount"
            autoComplete="amount"
            onChange={amountChangeHandler}
            className={classes.input}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Donate
          </Button>
        </form>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Donation Successfull
          </Alert>
        </Snackbar>
      </div>
    </Container>
  )
}
