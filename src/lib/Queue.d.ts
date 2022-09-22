export declare function Queue(queues: ReadonlyArray<T>): {
  set: (queues: ReadonlyArray<T>) => void;
  replaceQueues: (queues: ReadonlyArray<T>) => void;
  add: (queues: ReadonlyArray<T>) => void;
  remove: (queues: string | ReadonlyArray<T>) => void;
  process:(queues:string | ReadonlyArray<T>) =>void;
};
