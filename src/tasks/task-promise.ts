import { TaskAdapter, TaskOptions } from "../interface";
import Scheduler from "../scheduler";

export default class TaskPromise<T> implements TaskAdapter<T> {
  #callback: Function | undefined;
  // #state: State = "waiting";
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
        console.dir(this.#callback)
        this.#callback!();
        console.log("end callback")
        this.deleteWorker();
        console.log("delete item scheduler1")
          // resolve({ done:true });
          // } catch(err) {
          //   reject(err);
          // }
          this.#worker!.next("resolved")
        resolve({ done:true });
      }).catch((e) => {
        this.#worker!.next("rejected")
      })
       // this.#sleepFn
      // .then(() => {
      //     // this.#sheduler.deleteWorker(this);
      //     // console.log("delete item scheduler2")
      //     // resolve(Promise.resolve({ done:true }));

      //     // return Promise.resolve({ done:true });
      //     // return { done:true };
      // });
    } 
  }

  setState(state: string): Promise<unknown> {
    console.log("get worker")
    return <Promise<unknown>>this.getTask(state)
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
    this.#callback = options.task;
    this.#sheduler = scheduler;
    this.#options = options;
  }

  async *iter(resolve: Function, reject: Function): AsyncGenerator<unknown, any, unknown> {
    let status:any;
    let i=0;
    console.log("start iter")

    while (this.#status === "pending") {
        status = yield await Promise.resolve(1);
        this.#status = status;
    }

    console.log("async generator status ", status)
    if (status === "resolved") {
      resolve(status)
    } else {
      reject(status)
    }
  }

  start(resolve: Function, reject: Function) {
    this.#worker = this.iter(resolve, reject);
    let status = this.#worker!.next();
    // status = this.#worker!.next("run");
    // status = this.setState("run")
    console.log("status", status)

    // status.value.then(() => resolve())
    status.then((value) => {
      if (value.done) {
        resolve();
      }
    }).catch((e) => {
      reject(e)
    })
  }

  check(){
    
  }
}