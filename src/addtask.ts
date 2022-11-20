// import TaskWorker from "./task-worker";
// import TaskWorker from "./task-worker2";
import Task from "./tasks/task";
import {TaskAdapter} from "./interface";

export default function addTask<T>(worker: TaskAdapter<T>): Promise<void> {
  return new Promise((resolve, reject) => {
    // let iterable = [];
    // let worker = new Task(options);
    console.log("worker", worker)
    setImmediate(() => worker.start(resolve, reject));
  });
}
