import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { BullAdapter } from '@bull-board/api/bullAdapter';
import Queue from "./Queue";
const { BULLMQ } = require( "../../config/keys");

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/queues");
const { addQueue, removeQueue, setQueues, replaceQueues } =  createBullBoard({
  queues: BULLMQ ? Queue.queues.map( queue => new BullMQAdapter(queue.bull)) : Queue.queues.map( queue =>new BullAdapter( queue.bull)),
  serverAdapter: serverAdapter
});

export default serverAdapter;