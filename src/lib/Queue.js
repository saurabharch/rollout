// import Queue from'bull';
const Queue = require('bull');
const humanInterval = require('human-interval')

const differenceInMilliseconds = require('date-fns/differenceInMilliseconds')
const parseISO = require('date-fns/parseISO')
import redisConfig from'../config/redis';

import*as jobs from'../jobs';


const queues = Object.values(jobs).map(job => ({
  bull: new Queue(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
  options: job.options
}));

export default{
  
  queues,
  removeRepeatable(name, repeat) {
    const queue = this.get(name)

    return queue.bull.removeRepeatable('__default__', repeat)
  },

  getRepeatableJobs(name) {
    const queue = this.get(name)
    const jobs = queue.bull.getRepeatableJobs()

    return jobs
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
      return this.add(name, data, { ...options, delay })
    } else {
      throw new Error('Invalid schedule time')
    }
  },
  add(name, data){
    const queue = this.queues.find(queue => queue.name === name);
    // console.log(` Queue Data : ${JSON.stringify(data)} \nQueue Report : ${JSON.stringify(queue)}`);
    return queue.bull.add(data, queue.options);
  },

  process(){
    return this.queues.forEach(queue => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job, err) => {
        console.log('Job failed', queue.key, job.data);
        console.log(err);
      });
    });
  }
};

// import Queue from'bull';
// import redisConfig from'../config/redis';
// import*as jobs from'../jobs';


// const queues = Object.values(jobs).map(job => ({
//   bull: new Queue(job.key, redisConfig),
//   name: job.key,
//   handle: job.handle,
//   options: job.options
// }));

// export default{
  
//   queues,
//   add(name, data){
//     const queue = this.queues.find(queue => queue.name === name);
    
//     return queue.bull.add(data, queue.options);
//   },
//   process(){
//     return this.queues.forEach(queue => {
//       queue.bull.process(queue.handle);

//       queue.bull.on('failed', (job, err) => {
//         console.log('Job failed', queue.key, job.data);
//         console.log(err);
//       });
//     });
//   }
// };