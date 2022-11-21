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

export default class Queue<T> extends LinkedList<T> implements IQueue<T> {
  public maxSize: number = 10;
  public length: number = 0;
  public head: ListNodeLink<T> = null;
  public rear: ListNodeLink<T> = null;

  constructor(maxSize: number) {
    super();
    this.maxSize = maxSize;
    this.head = null;
    this.rear = null;
  }

  public push(value: T): void {
    if (this.length < this.maxSize) {
      this.add(value)

      if (!this.head) {
        this.head = this.first;
      }
      this.length++;
      this.rear = this.last;
    }
  }

  public pop(): T {
    if (!this.first) {
      throw new Error('Queue is empty');
      // return <T>"error";
    }

    const value = this.first?.value;
    const oldFirst = this.deleteFirst();

    this.length--;
    this.head = this.first;

    return <T>value;
  }

  inserMiddle(value: T): void {
    let current: ListNodeLink<T> = this.first;
    const newItem = new LinkedListNode(value);
    let i = 0;

    if (!this.first || !this.last) {
      this.first = newItem;
      this.last = newItem;
      this.next = newItem;
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

  findContainer(key: any): ListNodeLink<WorkerContainer> {
    let current: ListNodeLink<WorkerContainer> = <ListNodeLink<WorkerContainer>>this.first;

    while (current?.value![1] !== key) {
      if (current?.next == null) {
        return null;
      } else {
        current = current?.next;
      }
    }

    return current
  }

  remove(link: ListNodeLink<T>): void {
    this.delete(link)
    this.length--;
  }
}
