import './App.css'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'

//Styles
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import theme from './styles/theme'


//Pages
import HomePage from './pages/HomePage'
import SlackPage from './pages/SlackPage'

//Actions
import { initializeChannels } from './reducers/channelReducer'
import { initializeParameters } from './reducers/parameterReducer'

const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeChannels())
    dispatch(initializeParameters())
  }, [dispatch])


  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path='/:id' element={<SlackPage />}/>
          <Route path='/' element={<HomePage />}/>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
