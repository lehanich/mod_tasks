//  двусторонний двусвязанный список
import {
  LinkedList as ILinkedList,
  ListNodeLink,
} from "./interface";
import LinkedListNode from "./LinkedListNode";

export default class LinkedList<T> implements ILinkedList<T> {
  first: ListNodeLink<T> = null;
  last: ListNodeLink<T> = null;
  next: ListNodeLink<T> = null;

  constructor() {
    this.first = null;
    this.last = null;
    this.next = null;
  }

  public add(value: T): ILinkedList<T> {
    const newItem = new LinkedListNode(value);

    if (!this.first || !this.last) {
      this.first = newItem;
      this.last = newItem;
      this.next = newItem;

      return this;
    }

    newItem.prev = this.last;
    this.last.next = newItem;
    this.last = newItem;

    return this;
  }

  *[Symbol.iterator](): Iterator<T> {
    yield <T>this.first?.value;

    let currentNode = this.first;

    while (currentNode) {
      currentNode = currentNode.next;
      yield <T>currentNode?.value;
    }
  }

  find(key: T): ListNodeLink<T> {
    let current: ListNodeLink<T> = this.first;

    while (current?.value !== key) {
      console.log("find", current?.value, key)
      if (current?.next == null) {
        return null;
      } else {
        current = current?.next;
      }
    }

    return current;
  }

  insertFirst(value: T): ILinkedList<T> {
    const newItem:ListNodeLink<T> = new LinkedListNode(value);

    if (!this.first || !this.last) {
      this.first = newItem;
      this.last = newItem;
      this.next = newItem;

      return this;
    }

    newItem.next = this.first;
    this.first.prev = newItem;
    this.first = newItem;

    return this;
  }

  deleteFirst(): ListNodeLink<T> {
    if (!this.first) {
      return null;
    }

    const deletedFirst = this.first

    this.first =  this.first?.next;

    if (this.first) {
      delete this.first.prev;
    }

    return deletedFirst;
  }

  deleteLast(): ListNodeLink<T> {
    if (!this.last) {
      return null;
    }

    const deletedLast = this.last;

    this.last =  this.last?.prev;

    if (this.last) {
      delete this.last.next;
    }

    return deletedLast;
  }

  delete(link: ListNodeLink<T>): void {
    if (this.last === link) {
      this.deleteLast();
    } else if (this.first === link) {
      this.deleteFirst();
    } else {
      let prev = link?.prev;
      let next = link?.next;

      prev!.next = next;
      next!.prev = prev;
    }
  }
}
