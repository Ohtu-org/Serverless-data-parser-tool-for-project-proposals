import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

//Reducers
import { getMessagesParameters } from '../reducers/dataReducer'
import { clearAssignedWords } from '../reducers/assignReducer'


//Mui stuff
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const ParametersForm = () => {
  const [channel, setChannel] = useState('')
  const [user, setUser] = useState('')
  const [hours, setHours] = useState('')
  const dispatch = useDispatch()

  const channels = useSelector(state => state.channel)

  const putParameters = async(event) => {
    event.preventDefault()
    dispatch(getMessagesParameters(channel, user, hours))
    dispatch(clearAssignedWords())
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
          <FormControl
            fullWidth
          >
            <InputLabel>Channel</InputLabel>
            <Select
              id='channel'
              label='Channel'
              defaultValue='general'
              input={<OutlinedInput label='Channel'/>}
              onChange={({ target }) => setChannel(target.value)}
            >
              {channels.map((channel) => (
                <MenuItem
                  key={channel}
                  value={channel}
                >
                  {channel}
                </MenuItem>
              ))}
            </Select>
            <TextField
              id='user'
              label='User'
              variant='outlined'
              sx={{
                mt:1
              }}
              onChange={({ target }) => setUser(target.value)}
            />
            <TextField
              id='hours'
              label='Hours'
              variant='outlined'
              sx={{
                mt:1
              }}
              onChange={({ target }) => setHours(target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            variant='outlined'
            id='submit'
            onClick={putParameters}
          >
            Go
          </Button>
        </Grid>

      </Grid>
    </Box>
  )
}

export default ParametersForm