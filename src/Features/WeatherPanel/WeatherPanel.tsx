import React, { useEffect } from 'react';
import { CardContent, Typography, Grid } from '@material-ui/core';
import { Provider, subscriptionExchange, createClient, defaultExchanges, useSubscription } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { actions } from './reducer';
// import { actions as realTimeChartActions } from '../RealTimeChart/reducer';
import gql from 'graphql-tag';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import Card from '../../components/Card';

const subscriptionClient = new SubscriptionClient('ws://react.eogresources.com/graphql', {
  reconnect: true,
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
});

const metricsDataSubscriptionQuery = gql`
  subscription subscribeToNewMeasurement {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;

export default () => {
  return (
    <Provider value={client}>
      <WeatherPanel />
    </Provider>
  );
};

const WeatherPanel = () => {
  const dispatch = useDispatch();
  const [result] = useSubscription({
    query: metricsDataSubscriptionQuery,
    variables: {},
  });

  const { data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.realTimeMeasurementApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { newMeasurement } = data;
    dispatch(actions.setRealTimeData(newMeasurement));
  }, [dispatch, data, error]);

  const { dataArray } = useSelector((state: IState) => state.realTimeMeasurements);
  const { activeMetrics } = useSelector((state: IState) => state.metrics);

  return (
    <Grid container spacing={3}>
      {dataArray
        .filter(entry => activeMetrics.includes(entry.metric))
        .map(data => (
          <Grid key={data.metric} item xs>
            <Card>
              <CardContent>
                <Typography variant="h6">{data.metric}</Typography>
                <Typography variant="h3">{data.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};
