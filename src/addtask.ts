import {TaskAdapter} from "./interface";

export default function addTask<T>(worker: TaskAdapter<T>): Promise<void> {
  return new Promise((resolve, reject) => {
    // worker.start(resolve, reject)
    setImmediate(() => worker.start(resolve, reject));
  });
}
