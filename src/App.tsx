import React from 'react';
import createStore from './store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import MetricsSwitch from './Features/MetricSelect/MetricSelect';
import { Grid } from '@material-ui/core';
import RealTimePanel from './Features/WeatherPanel/WeatherPanel';
import RealTimeChart from './Features/WeatherChart/WeatherChart';

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'white',
    },
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <Wrapper>
        <Header />
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <RealTimePanel />
          </Grid>
          <Grid item xs={6}>
            <MetricsSwitch />
          </Grid>
        </Grid>
        <RealTimeChart />
        <ToastContainer />
      </Wrapper>
    </Provider>
  </MuiThemeProvider>
);

export default App;
