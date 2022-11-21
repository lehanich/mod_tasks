// Очередь на основе связного списка
import {
  Queue as IQueue
} from "./interface";
import LinkedList from "./LinkedList/LinkedList";
import {
  ListNodeLink
} from "./LinkedList/interface";
import LinkedListNode from "./LinkedList/LinkedListNode";
import {WorkerContainer} from "../../interface";

export default class Queue<T> implements IQueue<T> {
  public maxSize: number = 10;
  public length: number = 0;
  protected queue: LinkedList<T> = new LinkedList<T>;
  public first: ListNodeLink<T> = null;
  public last: ListNodeLink<T> = null;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.first = null;
    this.last = null;
  }

  public push(value: T): void {
    if (this.length < this.maxSize) {
      this.queue.add(value)

      if (!this.first) {
        this.first = this.queue.first;
      }
      this.length++;
      this.last = this.queue.last;
    }
  }

  public pop(): T {
    if (!this.queue.first) {
      throw new Error('Queue is empty');
      // return <T>"error";
    }

    const value = this.queue.first?.value;
    const oldFirst = this.queue.deleteFirst();

    this.length--;
    this.first = this.queue.first;

    return <T>value;
  }

  insertFirst(value: T): void {
    this.queue.insertFirst(value);
  }

  inserMiddle(value: T): void {
    let current: ListNodeLink<T> = this.queue.first;
    const newItem = new LinkedListNode(value);
    let i = 0;

    if (!this.queue.first || !this.queue.last) {
      this.queue.first = newItem;
      this.queue.last = newItem;
      this.queue.next = newItem;
      this.length++;

      return undefined
    }

    while (i < Math.floor(this.length / 2)) {
      current = current?.next;
      i++
    }

    let prevItem = current!.prev
    newItem.prev = prevItem;
    newItem.next = current;
    prevItem!.next = newItem;
    current!.prev = newItem;
    this.length++;
  }

  find(key: T): ListNodeLink<T> {
    return this.queue.find(key);
  }

  findContainer(key: any): ListNodeLink<WorkerContainer> {
    let current: ListNodeLink<WorkerContainer> = <ListNodeLink<WorkerContainer>>this.queue.first;

    while (current?.value![1] !== key) {
      if (current?.next == null) {
        return null;
      } else {
        current = current?.next;
      }
    }

    return current
  }

  delete(link: ListNodeLink<T>): void {
    this.queue.delete(link)
    this.length--;
  }

  *[Symbol.iterator](): Iterator<T> {
    yield <T>this.first?.value;

    let currentNode = this.first;

    while (currentNode) {
      currentNode = currentNode.next;
      yield <T>currentNode?.value;
    }
  }
}
