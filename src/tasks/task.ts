import { ScheduleOptions, TaskAdapter, TaskOptions, TaskType } from "../interface";
import Scheduler from "../scheduler";
import TaskPromise from "./task-promise";
import TaskIter from "./task-iter";

export default class Task<T> implements TaskAdapter<T> {
  // #callback;
  // #state: State = "waiting"; 
  #sheduler: Scheduler<T> | undefined;;
  #taskType: TaskAdapter<T>;
  #options: TaskOptions<T>;
  type:TaskType = undefined;

  constructor(options: TaskOptions<T>, taskObj: TaskAdapter<T>) {

    if ('type' in taskObj) {
      this.type = taskObj.type;
    }

    this.#options = options;

    let options2: ScheduleOptions<T> =  <ScheduleOptions<T>>{ ...Scheduler.instanceOptions() };

    if ("type" in options2 && 'type' in taskObj) {
      if ( options2.type && options2.type !== taskObj.type) {
        throw new Error("Типы задач должны быть одинаковыми")
      }
      options2.type =  this.type
    }

    if ("type" in options2 == false) {
      options2.type =  this.type;
    }

    console.log("NEW TASK options2 ", options2 );
    console.log("NEW TASK taskObj ", taskObj );
    console.log("NEW TASK Scheduler.instanceOptions ", Scheduler.instanceOptions() );

    this.#sheduler = new Scheduler(null, options2);

    console.log("this.#sheduler.options." , this.#sheduler.options)
    // if (this.#sheduler.options.type === "Promise") {
    //   this.#taskType = new TaskPromise(options);
    // } else if (this.#sheduler.options.type === "Iter") {
    //   this.#taskType = new TaskIter(options);
    // } else {
    //   this.#taskType = new TaskPromise(options);
    // }
    
    this.#taskType = taskObj;
    this.#taskType.init(this.#sheduler, options);

    console.log("before add worker");
    console.dir(this.#sheduler.workers!.queue)

    // this.#sheduler = new Scheduler(this.#taskType, this.#options);

    this.#sheduler.addWorker(this.#taskType, this.#options)
    console.log("add worker");
    console.dir(this.#sheduler.workers!.queue)
    console.log("check")
    console.dir(this.#taskType.check())
  }

  start(resolve: Function, reject: Function): void {
    this.#sheduler!.start();
    console.log(this.#taskType)
    this.#taskType.start(resolve, reject);
  }

  setState(state:string ): any {
    return this.#taskType.setState(state);
  }

  // exec(): Promise<unknown> {
  //   return this.#taskType.exec()
  //         .then(() => this.deleteWorker(this.#taskType))

  // }

  deleteWorker() {
    this.#taskType.deleteWorker();
    // this.#sheduler!.deleteWorker(this);
  }

  get options(): TaskOptions<T> {
    return this.#options;
  }

  init(scheduler: any, option: any) {

  }

  check() {

  }
}