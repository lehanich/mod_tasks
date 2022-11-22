import { Priority, ScheduleOptions, WorkerContainer } from "./interface";
import { Strategy } from "./queue/strategy";

export default class Scheduler<T> {
  #timeout = 100; // timeout for threads
  #delay = 1000; // for other apps
  #options: ScheduleOptions<unknown>;
  workers?: Strategy<Priority>; // [Priority, I][] = [];
  static #instance: Scheduler<unknown>;
  cursor?: Generator<T>;
  status?: string = "pending";

  constructor (worker: any, options: ScheduleOptions<T>) {
    if (Scheduler.#instance == null) {
      Scheduler.#instance = this;
    }

    this.#options = options;
    Scheduler.#instance.updateOptions(options);

    if (worker) {
      Scheduler.#instance.addWorker(worker, options);
    }

    if (options.timeout) {
      Scheduler.#instance.#timeout = options.timeout;
    }

    if (options.delay) {
      Scheduler.#instance.#delay = options.delay;
    }

    return <Scheduler<T>> Scheduler.#instance;
  }

  updateOptions(options: ScheduleOptions<unknown>) {
    this.#options = options;
  }

  addWorker(worker: any, options: any) {
    Scheduler.#instance.workers!.insert(worker, options.priority);
  }

  deleteWorker(delWorker: any) {
    Scheduler.#instance.workers!.remove(delWorker);

    if (Scheduler.#instance!.workers!.length === 0 && this.status === "pending") {
      // let status = Scheduler.#instance!.cursor!.next("stop"); // TypeError: Generator is already running
    }
  }

  timeout(priority: Priority) {
    let time = 100;
    let length = Scheduler.#instance!.workers!.length > 0 ?
                 Scheduler.#instance!.workers!.length : 1;

    switch(priority) {
      case "height":
        time = Math.ceil(this.#timeout / length * 50 / 100);
        break;

      case "normal":
        time = Math.ceil(this.#timeout / length * 30 / 100);
        break;

      case "low":
        time = Math.ceil(this.#timeout / length * 20 / 100);
        break;

      default:
        return Math.ceil(this.#timeout / length)
    }

    return time;
  }

  *executePromise(): Generator {
    let now = new Date().getTime();
    let status: any
    let array: Function[] = [];
    let scheduler = Scheduler.#instance!;

    while (scheduler.workers!.length > 0) {
      for (let item of scheduler.workers!.queue) {
        if (scheduler.workers!.length === 0) {
          break;
        }

        if (array.length < this.#options!.concurent) {
          let worker: WorkerContainer | undefined = scheduler.workers!.pop();
          if (worker !== undefined) {
            let callback = () => this.updateState(worker![1], "run");
            array.push(callback);
          }
        }

        if (array.length === this.#options!.concurent ||
          scheduler.workers!.length === 0) {
          if (new Date().getTime() < now + this.#timeout) {
            setTimeout(() => {
              now = new Date().getTime();

              Promise.all(array.map((p) => p())).then((value) => {
                array = [];
                scheduler.cursor!.next("next tick");
              });
            }, this.#delay);
          }

          status = yield "";
          // console.log("status" , status);
        }

        if (status === "stop") {
          this.status = "resolved";
          return "done";
        }
        // status = yield "";
      }
    }

    this.status = "resolved";
    return "done";
  }

  *executeIter(): Generator {
    let now = new Date().getTime();
    let status: any;
    let getState: Promise<T>;
    let worker: WorkerContainer | undefined;
    let scheduler = Scheduler.#instance!;

    while (scheduler.workers!.length > 0) {
      if (new Date().getTime() > now + this.#timeout) {
        setTimeout(() => {
          now = new Date().getTime();

          for (let item of scheduler.workers!.queue) {
            if (scheduler.workers!.length === 0) {
              break;
            }

            worker = scheduler.workers!.pop();
            scheduler.workers!.push(<WorkerContainer>worker);

            if (worker) {
              let now2 = new Date().getTime();

              while (new Date().getTime() < now2 + this.timeout(worker[0])) {
                getState = this.updateState(worker[1], "run");
              }

              getState = this.updateState(worker[1], "waiting");
            }
          }

          scheduler.cursor!.next();
        }, this.#delay );

        status = yield "";

        if (status === "stop") {
          return "done";
        }
      }
    }
  }

  updateState(worker: any,  state: any) {
    return worker.setState(state)
  }

  static queue(strategy: Strategy<Priority>) {
    Scheduler.#instance.workers = strategy;
  }

  static init(options: any) {
    Scheduler.#instance = new Scheduler(null, options);
    Scheduler.#instance.#timeout = options.timeout ? options.timeout : 100;
    Scheduler.#instance.#delay = options.delay ? options.delay : 1000;

    return Scheduler;
  }

  start() {
    if (Scheduler.#instance!.cursor == null) {

      if (this.#options!.type === "Promise") {
        Scheduler.#instance!.cursor = Scheduler.#instance!.executePromise();
      } else {
        Scheduler.#instance!.cursor = Scheduler.#instance!.executeIter();
      }

      Scheduler.#instance!.cursor!.next();
    }
  }

  get options() {
    return this.#options;
  }

  static instanceOptions (): ScheduleOptions<unknown> {
    return  Scheduler.#instance.#options;
  }

  // deprecated
  #sleepTime(sleepDuration: number): void {
    var now = new Date().getTime();
  
    while (new Date().getTime() < now + sleepDuration){ 
      /* Do nothing */ 
    }
  }
}
