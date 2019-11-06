var Queue = require('bull');

var sendQueue = new Queue("Server B", {redis: {host: '127.0.0.1', port: 6379}});
// var receiveQueue = new Queue("Server A");

sendQueue.process(function(job, done){
  console.log("Received message", job.data.msg);
  done();
});
let index = 0;
setInterval(() => {
    sendQueue.add({msg:"Hello-->" + index});
    index++;
}, 1000);