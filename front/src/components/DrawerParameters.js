import React from 'react'
import { useSelector } from 'react-redux'

//Mui components
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const DrawerParameters = () => {
  const parameters = useSelector(state => state.parameters)
  if (!parameters){
    return(
      <Box
        bgcolor='#f9f9f9'
        sx={{
          p: 2
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant='h6'
              noWrap
              component='div'
            >
                  Current parameters
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
                  Channel: ...
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
                  User: ...
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
                  Hours: ...
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
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
          <Typography
            variant='h6'
            noWrap
            component='div'
          >
                Current parameters
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
                Channel: { parameters.channel }
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
                User: { parameters.user }
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
                Hours: { parameters.hours }
          </Typography>
        </Grid>
      </Grid>

    </Box>
  )
}


export default DrawerParameters