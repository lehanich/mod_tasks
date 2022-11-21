import {
  LinkedListNode as ILinkedListNode,
  ListNodeVal,
  ListNodeLink
} from "./interface";

export default class LinkedListNode<T> implements ILinkedListNode<T> {
  value: T;
  next: ListNodeLink<T> = null;
  prev: ListNodeLink<T> = null;
  
  constructor(value: T,
              next?: ListNodeLink<T>,
              prev?: ListNodeLink<T>) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}
