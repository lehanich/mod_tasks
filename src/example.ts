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
        console.log("start task 1")
        console.log(1, test++)
      }
    },
    new TaskPromise()
  )
);

task1.then(() => {
  console.log(2);
});

const task2 = addTask(
  new Task({
    priority: 'low',
    iterable: new Array(10),
    task: () => {
      console.log("start task 2")
      console.log(2, test++)
    }
  },  new TaskPromise())
);

task2.then(() => {
  console.log(22);
});

const task3 = addTask(
  new Task({
    priority: 'normal',
    iterable: new Array(10),
    task: () => { 
      console.log("start task 3")
      console.log(3, test++)
    }
  }, new TaskPromise())
);

task3.then(() => {
  console.log(33);
});
