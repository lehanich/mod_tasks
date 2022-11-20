import { TaskAdapter, TaskOptions } from "../interface";
import Scheduler from "../scheduler";

export default class TaskPromise<T> implements TaskAdapter<T> {
  #callback: Function | undefined;
  #worker?: AsyncGenerator<unknown, any, unknown>;
  #status: "pending" | "rejected" | "resolved" = "pending";
  #sheduler: Scheduler<T> | undefined;;
  #options?: TaskOptions<T>;
  type: "Promise" = "Promise";

  constructor() {
  }

  getTask(status: string): Promise<unknown> | unknown {
    if (status === "run") {
      return  new Promise((resolve) => {
        this.#callback!();
        this.deleteWorker();
        this.#worker!.next("resolved");
        resolve({ done: true });
      }).then((value) => {
        // console.log("AFTER TASK", value)
      }).catch((e) => {
        this.#worker!.next("rejected");
        // console.log(e)
      })
    } 
  }

  setState(state: string): Promise<unknown> {
    return <Promise<unknown>>this.getTask(state)
  }

  deleteWorker() {
    this.#sheduler!.deleteWorker(this);
  }

  get options(): TaskOptions<T> {
    return this.#options!;
  }

  init(scheduler: Scheduler<T>, options: TaskOptions<T>) {
    this.#callback = options.task;
    this.#sheduler = scheduler;
    this.#options = options;
  }

  async *iter(resolve: Function, reject: Function): AsyncGenerator<unknown, any, unknown> {
    let status:any;

    while (this.#status === "pending") {
        status = yield await Promise.resolve(1);
        this.#status = status;
    }

    if (status === "resolved") {
      resolve(status)
    } else {
      reject(status)
    }
  }

  start(resolve: Function, reject: Function) {
    this.#worker = this.iter(resolve, reject);
    let status = this.#worker!.next();

    status.then((value) => {
      if (value.done) {
        resolve();
      }
    }).catch((e) => {
      reject(e)
    })
  }

  check() {
    
  }
}