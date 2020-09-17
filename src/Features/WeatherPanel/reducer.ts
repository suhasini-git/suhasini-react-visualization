import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

export type IMeasurement = {
  metric: string;
  at: number;
  value: number;
  unit: string;
};

export type IRealTimeData = {
  dataArray: IMeasurement[];
};

const initialState: IRealTimeData = {
  dataArray: [],
};

const slice = createSlice({
  name: 'RealTimeData',
  initialState,
  reducers: {
    setRealTimeData: (state, action: PayloadAction<IMeasurement>) => {
      const { metric, at, value, unit } = action.payload;
      const index = state.dataArray.map(elem => elem.metric).findIndex(value => value === metric);
      if (index === -1) {
        state.dataArray.push({ metric, at, value, unit });
      } else {
        state.dataArray[index] = { metric, at, value, unit };
      }
    },
    realTimeMeasurementApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
