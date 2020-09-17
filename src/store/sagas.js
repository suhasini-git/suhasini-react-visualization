import { spawn } from 'redux-saga/effects';
import metricsSaga from '../Features/MetricSelect/saga';
import realTimeSaga from '../Features/WeatherPanel/saga';
import realTimeChart from '../Features/WeatherChart/saga';

export default function* root() {

  yield spawn(metricsSaga);
  yield spawn(realTimeSaga);
  yield spawn(realTimeChart);
}
