const Bull = require('bull');
const Redis = require('ioredis');
const url = require('url');

const getRedisPasswordFromURI = (redisUri) => {
  const parsedURL = new url.URL(redisUri);
  return decodeURIComponent(parsedURL.password);
}

const redisConfig = {
  hosts: [
    'redis://:@127.0.0.1:8704',
    'redis://:@127.0.0.1:8970',
    'redis://:@127.0.0.1:10744',
  ],
  prefix: 'FPrefix'
};

const nodeOptions = {
  keyPrefix: redisConfig.prefix,
  autoResubscribe: true,
  autoResendUnfulfilledCommands: true
}

const clusterOptions = {
  enableReadyCheck: true,
  retryDelayOnClusterDown: 300,
  retryDelayOnFailover: 1000,
  retryDelayOnTryAgain: 3000,
  slotsRefreshTimeout: 10000,
  clusterRetryStrategy: times => Math.min(times * 1000, 10000),
  redisOptions: nodeOptions
}
// clusterOptions.redisOptions.password = getRedisPasswordFromURI(redisConfig.host);
redisClientInstance = new Redis.Cluster(redisConfig.hosts, clusterOptions);



const bullOptions = {
  prefix: 'FPrefix:{SPrefix}',
  defaultJobOptions: {
    delay: 0,
    removeOnComplete: true
  },
  createClient: (type, opts) => {
    return redisClientInstance;
  }
};

const myQueue = new Bull('testQueueName', '', bullOptions);

myQueue.process(function(job, done){
  console.log("Received message", job.data.msg);
  done();
});
myQueue.add({msg:"Hello-->"});