import addTask, { Scheduler,
  Strategy,
  PriorityQ,
  PriorityQ2,
  Task,
  TaskIter,
  TaskPromise } from "./index";

Scheduler.init({
  timeout: 30,
  delay: 1000,
  concurent: 2
}).queue(new Strategy(new PriorityQ2(100)));

console.log("start")

let test=0;
const task1 = addTask(
  new Task(
    {
      priority: 'height',
      iterable: new Array(100),
      task: () => { 
        console.log("start task 1")
        console.log(1, test++)
      }
    },
    new TaskIter()
  )
);

task1.then((value) => {
  console.log(2, value);
});

const task2 = addTask(
  new Task({
    priority: 'low',
    iterable: new Array(100),
    task: () => {
      console.log("start task 2")
      console.log(2, test++)
    }
  },  new TaskIter())
);

task2.then(() => {
  console.log(22);
});

const task3 = addTask(
  new Task({
    priority: 'normal',
    iterable: new Array(100),
    task: () => { 
      console.log("start task 3")
      console.log(3, test++)
    }
  }, new TaskIter())
);

task3.then(() => {
  console.log(33);
});
