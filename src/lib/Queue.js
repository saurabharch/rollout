
// // import Queue from'bull';
// const Queue = require('bull');
const humanInterval = require('human-interval');
// import { Queue as QueueMQ } from 'bullmq';
const differenceInMilliseconds = require('date-fns/differenceInMilliseconds');
const parseISO = require('date-fns/parseISO');
// import redisConfig from'../config/redis';
// const { BULLMQ } = require( "../config/keys");
// import*as jobs from'../jobs';



// console.log(`REDIS config for BULLMQ ${JSON.stringify(redisConfig)}`)
// const queues = Object.values(jobs).map(job => ({
//   bull: BULLMQ ? new QueueMQ(job.key,{connection: {host:redisConfig.host,port:redisConfig.port}}) : new Queue(job.key, redisConfig.url),
//   name: job.key,
//   handle: job.handle,
//   options: job.options
// }));

// export default{
  
//   queues,
//   removeRepeatable(name, repeat) {
//     const queue = this.get(name)

//     return queue.bull.removeRepeatable('__default__', repeat)
//   },

//   getRepeatableJobs(name) {
//     const queue = this.get(name)
//     const jobs = queue.bull.getRepeatableJobs()

//     return jobs
//   },

//   schedule(name, data, date, options) {
//     let delay

//     if (typeof date === 'number' || date instanceof Number) {
//       delay = date
//     } else {
//       if (typeof date === 'string' || date instanceof String) {
//         const byHuman = humanInterval(date)
//         if (!isNaN(byHuman)) {
//           delay = byHuman
//         } else {
//           delay = differenceInMilliseconds(parseISO(date), new Date())
//         }
//       } else {
//         delay = differenceInMilliseconds(date, new Date())
//       }
//     }

//     if (delay > 0) {
//       return this.add(name, data, { ...options, delay })
//     } else {
//       throw new Error('Invalid schedule time')
//     }
//   },
//   add(name, data){
//     const queue = this.queues.find(queue => queue.name === name);
//     // console.log(` Queue Data : ${JSON.stringify(data)} \nQueue Report : ${JSON.stringify(queue)}`);
//     return queue.bull.add(data, queue.options);
//   },

//   process(){
//     return this.queues.forEach(queue => {
//       queue.bull.add(queue.handle);

//       queue.bull.on('failed', (job, err) => {
//         console.log('Job failed', queue.key, job.data);
//         console.log(err);
//       });
//     });
//   }
// };

const Queue = require('bull');
import {Queue3 as QueueMQ , Worker} from 'bullmq';
//var CircularJSON = require('circular-json');
// import { Queue, Worker } from "bullmq";

const { BULLMQ } = require( "../../config/keys");

const  redisConfig = require('../../config/redis');
import*as jobs from'../jobs';

const redisOptions = {
  
  port: redisConfig.port,
  
  host: redisConfig.host,
  // password:redisConfig.password,
  // tls: redisConfig.tls,
};
 const queues = Object.values(jobs).map(job => ({
      bull: BULLMQ ? new QueueMQ(job.key,{connection: redisOptions,prefix: 'rollout-job',defaultJobOptions: {
      attempts: 3, // no of attempts for failed jobs
      backoff: { // retry after every 2^n times where n=1, 2, 3,...
        type: 'exponential',
        delay: 1000, // 1 sec
      },
    },
        enableReadyCheck: false}) : new Queue(job.key, redisConfig.url),
      name: job.key,
      handle: job.handle,
      options: job.options
  }));


// export default {
//   queues,
//   add (name, data,options){
//     const queue = this.queues.find(queue => queue.name === name);
    
//     return this.queue.bull.add(queue.jobName,data,options || queue.options);
//   },
//    removeRepeatabl (name, repeat){
//     const queue = this.get(name);

//     return this.queue.bull.removeRepeatable('__default__', repeat);
//   },
//   getRepeatableJobs(name){
//     const queue = this.get(name)
//     const jobs = this.queue.bull.getRepeatableJobs();

//     return jobs
//   },
//   process() {
//     this.queues.forEach( queue => {
//       const worker = new Worker(queue.bull.name, queue.handle, redisConfig);
      
//       worker.on("completed", (job, result) => {
//         console.log("Job completed!", job.data);
//         console.log(job.data);
//       });

//       worker.on("failed", (job, err) => {
//         console.log("Job failed!", job.queueName, job.data);
//         console.log(err);
//         this.repeatJob(job);
//       });
//     });
//   },
//   repeatJob(job) {
//     const opts = job.opts;
//     opts.priority = 1;
//     this.add(job.queue.name, job.data, opts);
//   }
// }

export default {
  queues,
  
  add(name, data, options) {
    const queue = this.queues.find(queue => queue.name === name );
    // console.log(` Queue Data : ${CircularJSON.stringify(data)} \nQueue Report : ${CircularJSON.stringify(queue)}`);
    return queue.bull.add(queue.name,data,options || queue.options);
  },
    removeRepeatabl (name, repeat){
    const queue = this.get(name);

    return queue.bull.removeRepeatable('__default__', repeat);
  },
  schedule(name, data, date, options) {
    let delay

    if (typeof date === 'number' || date instanceof Number) {
      delay = date
    } else {
      if (typeof date === 'string' || date instanceof String) {
        const byHuman = humanInterval(date)
        if (!isNaN(byHuman)) {
          delay = byHuman
        } else {
          delay = differenceInMilliseconds(parseISO(date), new Date())
        }
      } else {
        delay = differenceInMilliseconds(date, new Date())
      }
    }

    if (delay > 0) {
      return this.queues.add(name, data, { ...options, delay })
    } else {
      throw new Error('Invalid schedule time')
    }
  },
  getRepeatableJobs(name){
    const queue = this.queues.get(name)
    const jobs = queue.bull.getRepeatableJobs();

    return jobs;
  },
    process() {
    this.queues.forEach( queue => {
      if(BULLMQ ==false){
              queue.bull.add(queue.handle);

              queue.bull.on('failed', (job, err) => {
                console.log('Job failed', queue.key, job.data);
                console.log(err);
              });
      }else{
           const worker = new Worker(queue.bull.name, queue.handle, redisOptions);
      
          worker.on("completed", (job, result) => {
            console.log("Job completed!", job.data);
            console.log(job.data);
          });

          worker.on("failed", (job, err) => {
            console.log("Job failed!", job.queueName, job.data);
            console.log(err);
            this.repeatJob(job);
          });
        }
    });
  },
  repeatJob(job) {
    const opts = job.opts;
    opts.priority = 1;
    this.queues.add(job.queue.name, job.data, opts);
  }
};