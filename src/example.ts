import addTask, { Scheduler,
  Strategy,
  PriorityQ,
  Task,
  TaskIter,
  TaskPromise } from "./index";

Scheduler.init({
  timeout: 10,
  delay: 10000,
  concurent: 2
}).queue(new Strategy(new PriorityQ(100)));

console.log("start")

let test=0;
const task1 = addTask(
  new Task(
    {
      priority: 'height',
      iterable: new Array(10),
      task: () => { 
        console.log("start foreach")

        // for(let i=0; i<10;i++){
          console.log(1, test++)
          // setTimeout(() => console.log(i++), 1000)
        // }
      }
    },
    new TaskPromise()
  )
);

task1.then((result) => {
  console.log(2);
});

const task2 = addTask(
  new Task({
    priority: 'low',
    iterable: new Array(10),
    task: () => {
      console.log("start foreach")

      // for(let i=0; i<10;i++){
        console.log(2, test++)
        // setTimeout(() => console.log(i++), 1000)
      // }
    }
  },  new TaskPromise())
);

task2.then((result) => {
  console.log(22);
});

const task3 = addTask(
  new Task({
    priority: 'normal',
    iterable: new Array(10),
    task: () => { 
      console.log("start foreach")

      // for(let i=0; i<10;i++){
        console.log(3, test++)
        // setTimeout(() => console.log(i++), 1000)
      // }
    }
  }, new TaskPromise())
);

task3.then((result) => {
  console.log(33);
});
