import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { IState } from '../../store';
import gql from 'graphql-tag';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default () => {
  return (
    <Provider value={client}>
      <WeatherTimeChart />
    </Provider>
  );
};

const WeatherTimeChart = () => {
  const dispatch = useDispatch();
  const { startTimeStamp, currentTimeStamp, dataArray, unitMapping, metricToUnitMapping } = useSelector(
    (state: IState) => state.realTimeChart,
  );
  const { activeMetrics, colorMapping } = useSelector((state: IState) => state.metrics);
  const measurements = dataArray.map(entry => entry.measurements);

  const convertToDatapoints = (
    measurements: {
      metric: string;
      at: number;
      unit: string;
      value: number;
    }[][],
  ) => {
    if (measurements[0] === undefined) {
      return [];
    }
    let length = Math.min(...measurements.map(elem => elem.length));
    const res = [];

    for (let i = 0; i < length; i++) {
      let temp = {};
      measurements.forEach(entry => {
        temp = { ...temp, ...{ [entry[i].metric]: entry[i].value, timeStamp: entry[i].at } };
      });
      res.push(temp);
    }

    return res;
  };

  const dataPoints = convertToDatapoints(measurements);

  const queryArray = activeMetrics
    .reduce(
      (accumulator, currentValue) =>
        `${accumulator},{ metricName: "${currentValue}", after: ${startTimeStamp}, before: ${currentTimeStamp} }`,
      '',
    )
    .substr(1);

  const query = gql`
  {
    getMultipleMeasurements(input: [${queryArray}]) {
      metric
      measurements {
        metric
        at
        unit
        value
      }
    }
  }
`;

  const [result] = useQuery({
    query,
  });

  const { data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.realTimeChartApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    dispatch(actions.measurementsDataReceived(getMultipleMeasurements));
  }, [dispatch, data, error]);

  if (activeMetrics.length === 0) {
    return null;
  }

  return (
    <ResponsiveContainer width="90%" height="65%">
      <LineChart data={dataPoints} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <XAxis
          type="number"
          dataKey="timeStamp"
          domain={[startTimeStamp, 'auto']}
          tickFormatter={str => moment(str).format('HH:mm')}
        />
        {Object.keys(unitMapping).map(unitName => (
          <YAxis type="number" key={unitName} yAxisId={unitName} unit={unitName} />
        ))}
        {activeMetrics.map(activeMetric => (
          <Line
            dot={false}
            isAnimationActive={false}
            dataKey={activeMetric}
            type="natural"
            key={activeMetric}
            yAxisId={metricToUnitMapping[activeMetric]}
            stroke={colorMapping[activeMetric]}
            unit={metricToUnitMapping[activeMetric]}
          />
        ))}
        <CartesianGrid />
        <Tooltip labelFormatter={str => moment(str).format('LLLL')} />
      </LineChart>
    </ResponsiveContainer>
  );
};
