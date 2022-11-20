import Scheduler from "scheduler";

export type Priority = "low" | "normal"  |"height";
export type Worker = any;
export type WorkerContainer = [Priority, Worker];

export interface StrategyAdapter {
  insert(value: any, priority: Priority): void;
  remove(delWorker: Worker): void;
  peek(index: number): WorkerContainer;
  get length(): number;
  get queue(): WorkerContainer[];
}

export type ScheduleOptions<T> = {
  timeout: number,
  delay: number,
  priority: Priority,
  iterable: Iterable<T>,
  // task: Function,
  type: TaskType,
  concurent: number
}

export type TaskType = "Promise" | "Iter" | undefined;
export type TaskOptions<T> = {
  priority: Priority,
  iterable: Iterable<T>,
  task: Function;
}

export interface TaskAdapter<T> {
  start(resolve: Function, reject: Function): void;
  setState(state: string): Promise<unknown>;
  // exec(): Promise<unknown>;
  deleteWorker(): void;
  type: "Promise" | "Iter" | undefined;
  get options(): TaskOptions<T>;
  init(scheduler: Scheduler<T>, options: TaskOptions<T>): void;
  check(): unknown; // for debug
}
