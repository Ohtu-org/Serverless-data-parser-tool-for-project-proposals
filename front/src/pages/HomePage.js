import React from 'react'
import { useDispatch } from 'react-redux'
//Mui components
import Grid from '@mui/material/Grid'

//Components
import Messages from '../components/Messages'
import Words from '../components/Words'
import Categories from '../components/Categories'
import Layout from '../components/Layout'

import { initializeMessages } from '../reducers/dataReducer'



const HomePage = () => {

  const dispatch = useDispatch()

  dispatch(initializeMessages())


  return(
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Messages />
        </Grid>
        <Grid item xs={4}>
          <Words />
        </Grid>
        <Categories />
      </Grid>
    </Layout>
  )
}

export default HomePage