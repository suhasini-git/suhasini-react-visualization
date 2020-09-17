import { createSlice, PayloadAction } from 'redux-starter-kit';
import moment from 'moment';
import { IMeasurement } from '../WeatherPanel/reducer';

export type ApiErrorAction = {
  error: string;
};

export type IMultiplaMeasurements = {
  metric: string;
  measurements: {
    metric: string;
    at: number;
    unit: string;
    value: number;
  }[];
}[];

export type IRealTimeChartState = {
  dataArray: IMultiplaMeasurements;
  startTimeStamp: number;
  currentTimeStamp: number;
  unitMapping: {
    [unit: string]: string[];
  };
  metricToUnitMapping: {
    [unit: string]: string;
  };
};

const initialState: IRealTimeChartState = {
  dataArray: [],
  startTimeStamp: parseInt(
    moment()
      .subtract(1, 'hours')
      .format('x'),
  ),
  currentTimeStamp: parseInt(moment().format('x')),
  unitMapping: {},
  metricToUnitMapping: {},
};

const slice = createSlice({
  name: 'RealTimeChart',
  initialState,
  reducers: {
    measurementsDataReceived: (state, action: PayloadAction<IMultiplaMeasurements>) => {
      state.dataArray = action.payload;
      action.payload.forEach(elem => {
        const arr = state.unitMapping[elem.measurements[0].unit];
        if (arr) {
          arr.push(elem.metric);
        } else {
          state.unitMapping[elem.measurements[0].unit] = [elem.metric];
        }
        state.metricToUnitMapping[elem.metric] = elem.measurements[0].unit;
      });
    },
    realTimeChartApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    appendNewDataPoint: (state, action: PayloadAction<IMeasurement>) => {
      const index = state.dataArray.map(elem => elem.metric).findIndex(value => value === action.payload.metric);
      if (index !== -1) {
        state.dataArray[index].measurements.push(action.payload);
      } else {
        state.dataArray.push({
          metric: action.payload.metric,
          measurements: [action.payload],
        });
      }
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
