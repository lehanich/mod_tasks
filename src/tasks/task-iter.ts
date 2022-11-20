import { TaskAdapter, TaskOptions } from "../interface";
import Scheduler from "../scheduler";

export default class TaskIter<T> implements TaskAdapter<T> {
  #callback: Function | undefined;
  #worker?: Generator<unknown>; // <T>
  // #state: State = "waiting"; 
  #sheduler: Scheduler<T> | undefined;
  #options?: TaskOptions<T>;
  #iterable: Iterable<T> | undefined;
  type: "Iter" = "Iter";

  constructor() {
    // if (typeof options.task !== "function"){
    //   throw new Error("Callback is not a function")
    // }

    // this.#iterable = options.iterable;
    // this.#callback = options.task;
    // this.#sheduler = new Scheduler(null, options);
    // this.#options = options;
  }

  start(resolve: Function, reject: Function) {
    this.#worker = this.iter(resolve, reject);
    let status = this.#worker!.next();
    status = this.#worker!.next("run");
    // status = this.setState("run")
    console.log("status", status)

    // status.value.then(() => resolve())
    if (status.done) {
      resolve();
    }
  }

  // iterate(resolve: any, reject: any) {
  //   this.#sheduler.start()
  //   this.#worker = this.iter(resolve, reject);
  //   let status = this.#worker.next();

  //   if (status.done) {
  //     resolve();
  //   }
  // }

  *iter(resolve: Function, reject: Function): Generator<unknown,any,unknown> { // <T, any, unknown>
    let status;
    let cursor = this.#iterable![Symbol.iterator]();
    let i=0;
    console.log("start iter")

    while (true) {
      if (status === "run") {
        let item = cursor.next();
        console.log("iter item", item)
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
    // this.#state = state;

    if (this.#worker) {
      // return this.#worker.next(state)
      console.log("get worker")
      console.dir(this.#sheduler!.workers!.queue)
      return <Promise<unknown>>Promise.resolve(this.#worker.next(state))
    }

    return <Promise<unknown>>Promise.resolve("end")
  }

  // exec() {
  //   return <Promise<unknown>>this.getTask("test")
  // }

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