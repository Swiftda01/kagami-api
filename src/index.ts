import Moralis from 'moralis';
import express from 'express';
import cors from 'cors';
import config from './config';
import { parseServer } from './parseServer';
// @ts-ignore
import ParseServer from 'parse-server';
import http from 'http';
import { streamsSync } from '@moralisweb3/parse-server';

export const app = express();

declare const Parse: any;

Moralis.start({
  apiKey: config.MORALIS_API_KEY,
});

const Twit = require('twit');

const T = new Twit({
  consumer_key: config.TWITTER_CONSUMER_KEY,
  consumer_secret: config.TWITTER_CONSUMER_SECRET,
  access_token: config.TWITTER_ACCESS_TOKEN,
  access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET,
});

T.post('statuses/update', { status: 'hello world!' }, function(err: any, data: any, response: any) {
  console.log(data)
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(
  streamsSync(parseServer, {
    apiKey: config.MORALIS_API_KEY,
    webhookUrl: '/streams',
  }),
);

app.use(`/server`, parseServer.app);

app.get('/policies', async (req, res, next) => {
  const Policy = Parse.Object.extend('Policy');

  const policiesQuery = await new Parse.Query(Policy);
  const policies = await policiesQuery.find({ useMasterKey: true });

  const Cluster = Parse.Object.extend('Cluster');
  const clusters = await new Parse.Query(Cluster).find({ useMasterKey: true });

  res.json(
    policies.map((policy: any) => {
      const cluster = clusters.find((searchedCluster: any) => {
        return policy.attributes.cluster.id === searchedCluster.id;
      });

      return {
        type: policy.attributes.type,
        rules: policy.attributes.rules,
        clusterName: cluster.attributes.name,
      };
    }),
  );
});

const httpServer = http.createServer(app);
httpServer.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Moralis Server is running on port ${config.PORT}.`);
});
// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
