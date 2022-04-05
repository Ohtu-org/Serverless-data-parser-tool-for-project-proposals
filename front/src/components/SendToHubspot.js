import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

//Reducers
import { sendPending, sendAssignedJSON, sendReset, clearAssignedWords } from '../reducers/sendReducer'


//Mui stuff
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { yellow, green, red } from '@mui/material/colors'
import CheckIcon from '@mui/icons-material/Check'
import ErrorIcon from '@mui/icons-material/Error'
import Fade from '@mui/material/Fade'

const SendToHubspot = () => {
  const dispatch = useDispatch()
  const sendStatus = useSelector(state => state.sendStatus)
  const readyToSend = useSelector(state => state.readyToSend)

  const sendJson = async(event) => {
    //console.log(assignedWords)
    event.preventDefault()
    dispatch(sendPending())
    //dispatch(clearAssignedWords())
    dispatch(sendAssignedJSON())
  }

  const delayedReset = () => {
    if (sendStatus === 'success') dispatch(clearAssignedWords())
    setTimeout(() => dispatch(sendReset()), 5000)
  }

  return(
    <Box
      bgcolor='#f9f9f9'
      sx={{
        p: 2
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'left' }}>
              <Box sx={{ position: 'relative' }}>
                <Button
                  variant='outlined'
                  id='sendToHubSpotButton'
                  onClick={sendJson}
                  disabled={!readyToSend}
                >
                Send To Hubspot
                </Button>
                {(sendStatus === 'error' || sendStatus ==='success') && delayedReset()}
                {<Fade in={sendStatus === 'success'}>
                  <CheckIcon
                    id='HubSpotSuccess'
                    sx={{
                      color: 'white',
                      bgcolor: green[500],
                      position: 'absolute',
                      marginTop: '5px',
                      marginLeft: '12px'
                    }} />
                </Fade>
                }
                {<Fade in={sendStatus === 'error'}>
                  <ErrorIcon
                    id='HubSpotError'
                    sx={{
                      color: 'white',
                      bgcolor: red[500],
                      position: 'absolute',
                      marginTop: '5px',
                      marginLeft: '12px'
                    }} />
                </Fade>
                }
                {(sendStatus === 'pending') && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: yellow[500],
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SendToHubspot
