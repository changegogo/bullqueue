var Queue = require('bull');

var sendQueue = new Queue("Server B");

sendQueue.process(function(job, done){
  console.log("Received message", job.data.msg);
  done();
});

// sendQueue.add({msg:"World"});