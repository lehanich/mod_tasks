import { Priority,
  StrategyAdapter,
  WorkerContainer } from "../interface";

export default class PriorityQ<T> implements StrategyAdapter {
  #maxSize: number = 100;
  #queueArray: WorkerContainer[] = new Array(100);
  #length: number = 0;

  constructor(size: number) {
    this.#maxSize = size;
    this.#queueArray = new Array(size);
    this.#length = 0;
  }

  insert(value: any, priority: Priority): void {
    let j: number;
    let item: WorkerContainer = [priority, value];

    this.doubleQueue()

    if (this.#length === 0) {
      this.#queueArray[0] = item;
    } else {
      switch(priority) {
        case "low":
          this.#queueArray[this.#length] = item
          break;

        case "normal":
          let insert = Math.floor(this.#length / 2)

          for (j=this.#length - 1; j >= insert; j--) {
            this.#queueArray[j+1] = this.#queueArray[j]
          }

          this.#queueArray[insert] = item;
          break;

        case "height":
          for (j=this.#length - 1; j >= 0; j--) {
            this.#queueArray[j+1] = this.#queueArray[j]
          }

          this.#queueArray[0] = item;
          break;
        default: 

      }
    }

    this.#length++;
  }

  remove(delWorker: T): void {
    let i = 0;
    let array = new Array(this.#maxSize)

    for (let worker of this.#queueArray) {
      if (i>= this.#length) {
        break;
      }

      if (worker && worker != undefined && worker[1] !== delWorker) {
        array[i] = worker
        i++
      }
    }

    this.#length--;
    this.#queueArray = array
  }

  peekMin() {
    return this.#queueArray[this.#length - 1]
  }

  peekMax() {
    return this.#queueArray[0]
  }

  peek(i: number) {
    return this.#queueArray[i]
  }

  isEmpty() {
    return this.#length === 0;
  }

  isFull() {
    return this.#length === this.#maxSize;
  }

  pop(): WorkerContainer {
    let item: WorkerContainer = <WorkerContainer>this.#queueArray.shift();

    this.#length--;

    return item;
  }

  push(item: WorkerContainer) {
    this.doubleQueue();
    this.#queueArray[this.#queueArray.length] = item;
    this.#length++;
  }

  doubleQueue() {
    if (this.#length === this.#maxSize && this.#length > 0) {
      this.#maxSize = this.#maxSize * 2;
      let array = new Array(this.#maxSize);

      for (let item of this.#queueArray) {
        array.push(item);
      }
      this.#queueArray = array;
    }
  }

  get length() {
    return this.#length;
  }

  get queue() {
    return this.#queueArray;
  }
}