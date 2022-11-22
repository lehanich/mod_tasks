import { Priority,
         StrategyAdapter,
         WorkerContainer } from "../interface";

export default class StandartQ<T> implements StrategyAdapter {
  #maxSize?: number | null = 100;
  #queue: WorkerContainer[] = new Array(100);
  #length: number = 0;

  constructor(size?: number | null) {
    this.#maxSize = size;
    this.#queue = [];
    this.#length = 0;
  }

  insert(worker: any, priority: Priority): void {
    this.doubleQueue();
    this.#queue.push([priority, worker]);
  };

  remove(delWorker: Worker): void {
    let i = 0;
    let array = [];

    for (let worker of this.#queue) {
      if (worker && worker[1] !== delWorker) {
        array.push(worker);
      }
      i++
    }

    this.#queue = array
  };

  peek(index: number): WorkerContainer {
    return this.#queue[index];
  };

  pop(): WorkerContainer | undefined {
    let item: WorkerContainer;
    
    if (this.#length === 0) {
      return undefined;
    }
    
    item = <WorkerContainer>this.#queue[0];
    this.#length--;

    for (let i=0; i < this.#queue.length - 1; i++) {
      this.#queue[i] = this.#queue[i + 1];
    }

    return item;
  }

  push(item: WorkerContainer) {
    this.doubleQueue();
    this.#queue[this.#queue.length] = item;
    this.#length++;
  }

  doubleQueue() {
    if (this.#length === this.#maxSize && this.#length > 0) {
      this.#maxSize = this.#maxSize * 2;
      let array = new Array(this.#maxSize);

      for (let i=0; i < this.#queue.length; i++) {
        array[i] = this.#queue[i];
      }

      this.#queue = array;
    }
  }

  get length(): number {

    return this.#length;
  };

  get queue() {
    return this.#queue;
  }
}
