
import { reducer as metricsReducer } from '../Features/MetricSelect/reducer';
import { reducer as realTimeMeasurementsReducer } from '../Features/WeatherPanel/reducer';
import { reducer as realTimeChartReducer } from '../Features/WeatherChart/reducer';

export default {
  metrics: metricsReducer,
  realTimeMeasurements: realTimeMeasurementsReducer,
  realTimeChart: realTimeChartReducer,
};
