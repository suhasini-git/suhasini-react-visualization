import { createSlice, PayloadAction } from 'redux-starter-kit';
import * as _ from 'lodash';
import randomColor from 'randomcolor';

export type MetricsData = string[];

export type ApiErrorAction = {
  error: string;
};

export type ActiveMetricEntries = {
  activeMetrics: string[];
};

export type IMetricsSwitchState = {
  metrics: string[];
  activeMetrics: string[];
  colorMapping: {
    [metric: string]: string;
  };
};

const initialState: IMetricsSwitchState = {
  metrics: [],
  activeMetrics: [],
  colorMapping: {},
};

const slice = createSlice({
  name: 'metricsSwitch',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<MetricsData>) => {
      const metrics = action.payload;
      const colorMappingArray = metrics.map(elem => ({ metric: elem, color: randomColor() }));
      state.colorMapping = _.mapValues(_.keyBy(colorMappingArray, 'metric'), 'color');
      state.metrics = metrics;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    setActiveMetrics: (state, action: PayloadAction<ActiveMetricEntries>) => {
      const { activeMetrics } = action.payload;
      state.activeMetrics = activeMetrics;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
