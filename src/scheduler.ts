import { Priority, ScheduleOptions } from "./interface";
import { Strategy } from "./queue/strategy";

export default class Scheduler<T> {
  #timeout = 100; // timeout for threads
  #delay = 1000; // for other apps
  #options: ScheduleOptions<unknown>;
  workers?: Strategy<Priority>; // [Priority, I][] = [];
  // #runTasks: [];
  static #instance: Scheduler<unknown>;
  cursor?: Generator<T>;
  status?: string;

  // static queueType: any;

  constructor (worker: any, options: ScheduleOptions<T>) {
    if (Scheduler.#instance == null) {
      Scheduler.#instance = this;

      // if (options.priority === "PriorityQ") {
      //   Scheduler.queueType = "PriorityQ";
      //   Scheduler.#instance.workers = new Strategy(new PriorityQ(100));
      // } else {
      //   Scheduler.queueType = "Vector";
      //   Scheduler.#instance.workers = new Strategy(new StandartQ());
      // }
    }

    console.log("NEW SCHEDULER options ", options)
    this.#options = options;

    if (worker) {
      Scheduler.#instance.addWorker(worker, options);
    }

    if (options.timeout) {
      Scheduler.#instance.#timeout = options.timeout
    }

    if (options.delay) {
      Scheduler.#instance.#delay = options.delay
    }

    return <any> Scheduler.#instance;
  }

  addWorker(worker: any, options: any) {
    Scheduler.#instance.workers!.insert(worker, options.priority);
  }

  deleteWorker(delWorker: any) {
    console.log("start delete")
    console.dir(Scheduler.#instance!.workers!.queue)
    Scheduler.#instance.workers!.remove(delWorker);
    console.dir(Scheduler.#instance!.workers!.queue)
    console.log("2 lenfth", Scheduler.#instance!.workers!.length)
    if (Scheduler.#instance!.workers!.length === 0) {
      let status = Scheduler.#instance!.cursor!.next("stop");
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

  // async *execute(): any {
  //   let now = new Date().getTime();
  //   let status: any

  //   if (this.#options!.type === "Promise") {
      
  //     let array = [];
  //     let j = this.#options!.concurent;
  //     while (Scheduler.#instance!.workers!.length > 0) {

  //     for (let i=0; i < Scheduler.#instance!.workers!.length; i++) {

  //       if (j > 0) {
  //           j--;
  //           let worker = Scheduler.#instance!.workers!.peek(i);
  //           console.log("worker", worker)
  //           console.log("worker2", worker[1])
  //           console.log("workers", Scheduler.#instance!.workers)
  //           console.log("length", Scheduler.#instance!.workers!.length)
  //           let test = () => this.updateState2(worker[1], "run");
  //           console.log ("www", test)
  //           console.log("j", j)
  //           array.push(test)
  //         } // while (j!==0)

  //         if (j==0 || i === Scheduler.#instance!.workers!.length - 1) {
  //           j = this.#options.concurent;
  //           console.log("enter", array);
  //           //  status = yield "";
  
  //           //  (async () => {await Promise.all([...array]).then(() => {
  //           //   console.log("end promise all")
  //           //   Scheduler.#instance!.cursor.next();
  //           //   array = [];
  //           //   console.log("end status 3", status)
  //           //  })})();
  //             // console.log(array.map((p) => p()))

  //            Promise.all(array.map((p) => p())).then(() => {
  //             // array = [];
  //             // console.log("end status2", status)

  //             // Scheduler.#instance!.cursor.next();
  //           });
  //           console.log("end status", status)
  //           Scheduler.#instance!.cursor!.next();
  //           array = [];
  //           status = yield "";
  //         }
  //         console.log("scheduler status ", status)
  //         if (status === "stop") {
  //           return "done";
  //         }
  //         // status = yield "";
  //       }
  //     }
  //   } else {
  //     while (Scheduler.#instance!.workers!.length > 0) {
  //       {
  //         if (new Date().getTime() > now + this.#timeout) {
  //           setTimeout(() => {
  //             now = new Date().getTime();

  //             for (let i=0; i < Scheduler.#instance!.workers!.length; i++) {
  //               let worker: any;

  //               worker = Scheduler.#instance!.workers!.peek(i);

  //               if (worker) {
  //                 let now2 = new Date().getTime();

  //                 while (new Date().getTime() < now2 + this.timeout(worker[0])) {
  //                   this.updateState(worker[1], "run");
  //                 }

  //                 this.updateState(worker[1], "waiting");
  //               }
  //             }
  //             console.log("Scheduler set cursor next")
  //             Scheduler.#instance!.cursor!.next();
  //           }, this.#delay);

  //           status = yield "";

  //           console.log("scheduler status", status)
  //           console.log("length ", Scheduler.#instance!.workers!.length)
  //           console.dir(Scheduler.#instance!.workers!.queue)

  //           if (status === "stop") {
  //             return "done";
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  *executePromise(): Generator {
    let now = new Date().getTime();
    let status: any
    let array: any[] = [];
    let j = this.#options!.concurent;
    
    while (Scheduler.#instance!.workers!.length > 0) {

      for (let i=0; i < Scheduler.#instance!.workers!.length; i++) {

        if (j > 0) {
            j--;
            let worker = Scheduler.#instance!.workers!.peek(i);
            console.log("worker", worker)
            console.log("worker2", worker[1])
            console.log("workers", Scheduler.#instance!.workers)
            console.log("length", Scheduler.#instance!.workers!.length)
            let test = () => this.updateState2(worker[1], "run");
            console.log ("www", test)
            console.log("j", j)
            array.push(test)
        } // while (j!==0)

        if (j==0 || i === Scheduler.#instance!.workers!.length - 1) {
            j = this.#options.concurent;
            console.log("enter", array);
            //  status = yield "";
  
            //  (async () => {await Promise.all([...array]).then(() => {
            //   console.log("end promise all")
            //   Scheduler.#instance!.cursor.next();
            //   array = [];
            //   console.log("end status 3", status)
            //  })})();
              // console.log(array.map((p) => p()))
              if (new Date().getTime() > now + this.#timeout) {
                setTimeout(() => {
                  now = new Date().getTime();
                  Promise.all(array.map((p) => p())).then(() => {
                    // array = [];
                    // console.log("end status2", status)

                    // Scheduler.#instance!.cursor.next();
                  });
                }, this.#delay);
              }
            console.log("end status", status)
            Scheduler.#instance!.cursor!.next();
            array = [];
            status = yield "";
        }
        console.log("scheduler status ", status)
        if (status === "stop") {
            return "done";
        }
        // status = yield "";
      }
    }
  }

  *executeIter(): Generator {
    let now = new Date().getTime();
    let status: any

    console.log("worker type ", this.#options!.type)

    while (Scheduler.#instance!.workers!.length > 0) {
      {
        if (new Date().getTime() > now + this.#timeout) {
          setTimeout(() => {
            now = new Date().getTime();

            for (let i=0; i < Scheduler.#instance!.workers!.length; i++) {
              let worker: any;

              worker = Scheduler.#instance!.workers!.peek(i);

              if (worker) {
                let now2 = new Date().getTime();

                while (new Date().getTime() < now2 + this.timeout(worker[0])) {
                  this.updateState(worker[1], "run");
                }

                this.updateState(worker[1], "waiting");
              }
            }
            console.log("Scheduler set cursor next")
            Scheduler.#instance!.cursor!.next();
          }, this.#delay);

          status = yield "";

          console.log("scheduler status", status)
          console.log("length ", Scheduler.#instance!.workers!.length)
          console.dir(Scheduler.#instance!.workers!.queue)

          if (status === "stop") {
            return "done";
          }
        }
      }
    }
  }

  async *execute(): any {
    let now = new Date().getTime();
    let status: any

    console.log("worker type ", this.#options!.type)

    if (this.#options!.type === "Promise") {
      
      let array: any[] = [];
      let j = this.#options!.concurent;
      while (Scheduler.#instance!.workers!.length > 0) {

      for (let i=0; i < Scheduler.#instance!.workers!.length; i++) {

        if (j > 0) {
            j--;
            let worker = Scheduler.#instance!.workers!.peek(i);
            console.log("worker", worker)
            console.log("worker2", worker[1])
            console.log("workers", Scheduler.#instance!.workers)
            console.log("length", Scheduler.#instance!.workers!.length)
            let test = () => this.updateState2(worker[1], "run");
            console.log ("www", test)
            console.log("j", j)
            array.push(test)
          } // while (j!==0)

          if (j==0 || i === Scheduler.#instance!.workers!.length - 1) {
            j = this.#options.concurent;
            console.log("enter", array);
            //  status = yield "";
  
            //  (async () => {await Promise.all([...array]).then(() => {
            //   console.log("end promise all")
            //   Scheduler.#instance!.cursor.next();
            //   array = [];
            //   console.log("end status 3", status)
            //  })})();
              // console.log(array.map((p) => p()))
              if (new Date().getTime() > now + this.#timeout) {
                setTimeout(() => {
                  now = new Date().getTime();
                  Promise.all(array.map((p) => p())).then(() => {
                    // array = [];
                    // console.log("end status2", status)

                    // Scheduler.#instance!.cursor.next();
                  });
                }, this.#delay);
              }
            console.log("end status", status)
            Scheduler.#instance!.cursor!.next();
            array = [];
            status = yield "";
          }
          console.log("scheduler status ", status)
          if (status === "stop") {
            return "done";
          }
          // status = yield "";
        }
      }
    } else {
      while (Scheduler.#instance!.workers!.length > 0) {
        {
          if (new Date().getTime() > now + this.#timeout) {
            setTimeout(() => {
              now = new Date().getTime();

              for (let i=0; i < Scheduler.#instance!.workers!.length; i++) {
                let worker: any;

                worker = Scheduler.#instance!.workers!.peek(i);

                if (worker) {
                  let now2 = new Date().getTime();

                  while (new Date().getTime() < now2 + this.timeout(worker[0])) {
                    this.updateState(worker[1], "run");
                  }

                  this.updateState(worker[1], "waiting");
                }
              }
              console.log("Scheduler set cursor next")
              Scheduler.#instance!.cursor!.next();
            }, this.#delay);

            status = yield "";

            console.log("scheduler status", status)
            console.log("length ", Scheduler.#instance!.workers!.length)
            console.dir(Scheduler.#instance!.workers!.queue)

            if (status === "stop") {
              return "done";
            }
          }
        }
      }
    }
  }

  updateState(worker: any,  state: any) {
    // worker.state = state
    console.log("set state", state)
    return worker.setState(state)
  }
  updateState2(worker: any,  state: any) {
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
      // Scheduler.#instance!.cursor = Scheduler.#instance!.execute();
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
