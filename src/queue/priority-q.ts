import { Priority,
  StrategyAdapter,
  WorkerContainer } from "../interface";

export default class PriorityQ<T> implements StrategyAdapter {
  #maxSize: number = 100;
  #queue: WorkerContainer[] = new Array(100);
  #length: number = 0;

  constructor(size: number) {
    this.#maxSize = size;
    this.#queue = new Array(size);
    this.#length = 0;
  }

  insert(value: any, priority: Priority): void {
    let j: number;
    let item: WorkerContainer = [priority, value];

    this.doubleQueue()

    if (this.#length === 0) {
      this.#queue[0] = item;
    } else {
      switch(priority) {
        case "low":
          this.#queue[this.#length] = item
          break;

        case "normal":
          let insert = Math.floor(this.#length / 2)

          for (j=this.#length - 1; j >= insert; j--) {
            this.#queue[j+1] = this.#queue[j]
          }

          this.#queue[insert] = item;
          break;

        case "height":
          for (j=this.#length - 1; j >= 0; j--) {
            this.#queue[j+1] = this.#queue[j]
          }

          this.#queue[0] = item;
          break;
        default: 

      }
    }

    this.#length++;
  }

  remove(delWorker: T): void {
    let i = 0;
    let array = new Array(this.#maxSize);

    for (let worker of this.#queue) {
      if (i>= this.#length) {
        break;
      }

      if (worker && worker != undefined && worker[1] !== delWorker) {
        array[i] = worker;
        i++;
      }

      if (worker && worker[1] === delWorker) {
        this.#length--;
      }
    }

    this.#queue = array;
  }

  peekMin() {
    return this.#queue[this.#length - 1];
  }

  peekMax() {
    return this.#queue[0];
  }

  peek(i: number) {
    return this.#queue[i];
  }

  isEmpty() {
    return this.#length === 0;
  }

  isFull() {
    return this.#length === this.#maxSize;
  }

  pop(): WorkerContainer | undefined{
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
    this.#queue[this.#length] = item;
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

  get length() {
    return this.#length;
  }

  get queue() {
    return this.#queue;
  }
}