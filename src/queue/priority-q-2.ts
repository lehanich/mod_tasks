import { Priority,
  StrategyAdapter,
  WorkerContainer } from "../interface";
import Queue from "./queue";
import {ListNodeLink} from "./queue/LinkedList/interface";

export default class PriorityQ2<T> implements StrategyAdapter {
  #maxSize: number = 100;
  #queue: Queue<WorkerContainer> = new Queue(100);
  #length: number = 0;

  constructor(size: number) {
    this.#maxSize = size;
    this.#queue = new Queue(size);
    this.#length = 0;
  }

  insert(value: any, priority: Priority): void {
    let j: number;
    let item: WorkerContainer = [priority, value];

    if (this.#length === 0) {
      this.#queue.push(item);
    } else {
      switch(priority) {
        case "low":
          this.#queue.push(item)
          break;

        case "normal":
          this.#queue.inserMiddle(item);
          break;

        case "height":
          this.#queue.insertFirst(item);
          break;
        default: 

      }
    }

    this.#length++;
  }

  remove(delWorker: any): void {
    let findElem = this.#queue.findContainer(delWorker);
    // if (findElem) {
    this.#queue.delete(findElem);
    // }
    this.#length--;
  }

  peek(i: number): WorkerContainer | undefined {
    let j = 0;
    let current: ListNodeLink<WorkerContainer> = this.#queue.first;

    while (i !== j) {
      current = current?.next;
      j++
    };

    return <WorkerContainer>current!.value
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

    this.#length--;
    item = this.#queue.pop()

    return item;
  }

  push(item: WorkerContainer) {
    this.#queue.push(item)
    this.#length++;
  }

  get length() {
    return this.#length;
  }

  get queue() {
    return this.#queue;
  }
}