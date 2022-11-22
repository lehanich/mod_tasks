import { ScheduleOptions,
  TaskAdapter,
  TaskOptions,
  TaskType } from "../interface";
import Scheduler from "../scheduler";

export default class Task<T> implements TaskAdapter<T> {
  #sheduler: Scheduler<T> | undefined;;
  #taskType: TaskAdapter<T>;
  #options: TaskOptions<T>;
  type:TaskType = undefined;

  constructor(options: TaskOptions<T>, taskObj: TaskAdapter<T>) {
    if ('type' in taskObj) {
      this.type = taskObj.type;
    }

    this.#options = options;

    let schedulerOptions: ScheduleOptions<T> =
      <ScheduleOptions<T>>{ ...Scheduler.instanceOptions() };

    if ("type" in schedulerOptions && schedulerOptions.type && 'type' in taskObj) {
      if ( schedulerOptions.type && schedulerOptions.type !== taskObj.type) {
        throw new Error("Типы задач должны быть одинаковыми");
        // "костыль" одновременная работа задач Iter и Promise не поддерживается
      }

      schedulerOptions.type =  this.type;
    }

    if (("type" in schedulerOptions == false || !schedulerOptions.type) && this.type) {
      schedulerOptions.type =  this.type;
    }

    this.#sheduler = new Scheduler(null, schedulerOptions);
    this.#taskType = taskObj;
    this.#taskType.init(this.#sheduler, options);
    this.#sheduler.addWorker(this.#taskType, this.#options);
  }

  start(resolve: Function, reject: Function): void {
    // this.#taskType.start(resolve, reject);
    setImmediate(() => this.#sheduler!.start());
    this.#taskType.start(resolve, reject);
  }

  setState(state:string ): any {
    return this.#taskType.setState(state);
  }

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