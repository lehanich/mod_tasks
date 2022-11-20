import { TaskAdapter, TaskOptions } from "../interface";
import Scheduler from "../scheduler";

export default class TaskIter<T> implements TaskAdapter<T> {
  #callback: Function | undefined;
  #worker?: Generator<unknown>; // <T>
  #sheduler: Scheduler<T> | undefined;
  #options?: TaskOptions<T>;
  #iterable: Iterable<T> | undefined;
  type: "Iter" = "Iter";

  constructor() {
  }

  start(resolve: Function, reject: Function) {
    this.#worker = this.iter(resolve, reject);
    let status = this.#worker!.next();
    status = this.#worker!.next("run");

    if (status.done) {
      resolve();
    }
  }

  *iter(resolve: Function, reject: Function): Generator<unknown,any,unknown> { // <T, any, unknown>
    let status;
    let cursor = this.#iterable![Symbol.iterator]();
    let i = 0;
    // console.log("start iter")

    while (true) {
      if (status === "run") {
        let item = cursor.next();

        if (item.done) {
          this.deleteWorker();
          resolve();

          return { done:true };
        }

        try {
          this.#callback!(i, item, this.#iterable);
          i++;
        } catch(err) {
          reject(err);
        }

        status = yield item.value;
      } else {
        status = yield;
      }
    }

    this.#sheduler!.deleteWorker(this)
    resolve()
  }

  setState(state: string): Promise<unknown> {
    if (this.#worker) {
      return <Promise<unknown>>Promise.resolve(this.#worker.next(state))
    }

    return <Promise<unknown>>Promise.resolve("end")
  }

  deleteWorker() {
    this.#sheduler!.deleteWorker(this);
  }

  get options(): TaskOptions<T> {
    return this.#options!;
  }

  init(scheduler: Scheduler<T>, options: TaskOptions<T>) {
    this.#iterable = options.iterable;
    this.#callback = options.task;
    this.#sheduler = scheduler;
    this.#options = options;
  }

  check() {
    return {
      1: this.#sheduler!.workers!.queue,
      2: this.#options,
      3: this.#iterable
    }
  }
}