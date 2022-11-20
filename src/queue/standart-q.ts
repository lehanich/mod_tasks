import { Priority,
         StrategyAdapter,
         WorkerContainer } from "../interface";

export default class StandartQ<T> implements StrategyAdapter {
  #maxSize?: number | null = 100;
  #queueArray: WorkerContainer[] = new Array(100);
  #length: number = 0;

  constructor(size?: number | null) {
    this.#maxSize = size;
    this.#queueArray = [];
    this.#length = 0;
  }

  insert(worker: any, priority: Priority): void {
    if (this.#length === this.#maxSize) {
      this.#maxSize = this.#maxSize * 2;
      let array = new Array(this.#maxSize);

      for (let item of this.#queueArray) {
        array.push(item);
      }
      this.#queueArray = array;
    }
    
    this.#queueArray.push([priority, worker]);
  };

  remove(delWorker: Worker): void {
    let i = 0;
    let array = []

    for (let worker of this.#queueArray) {
      if (worker && worker[1] !== delWorker) {
        array.push(worker)
      }
      i++
    }

    this.#queueArray = array
  };

  peek(index: number): WorkerContainer {
    return this.#queueArray[index];
  };

  get length(): number {

    return this.#length;
  };

  get queue() {
    return this.#queueArray;
  }
}
