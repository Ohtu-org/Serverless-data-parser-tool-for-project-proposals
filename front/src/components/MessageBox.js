import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserMessage } from '../reducers/userMessageReducer'
//Mui components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { IconButton } from '@mui/material'
import CloseIcon from '@material-ui/icons/Close'

const MessageBox = () => {
  const message = useSelector(state => state.userMessage)
  const dispatch = useDispatch()

  const clearMessage = () => {
    dispatch(clearUserMessage())
    console.log('click')
  }

  if(!message) return null

  return (
    <Box sx={{ width: '100%', bgcolor: 'white' }}>
      <Typography variant='h6' textAlign='center' color='black'>
        {message}   <IconButton onClick={clearMessage}><CloseIcon /></IconButton>
      </Typography>
    </Box>
  )
}

export default MessageBox