export interface LinkedList<T> {
  first: ListNodeLink<T>;
  last: ListNodeLink<T>;
  next: ListNodeLink<T>;

  add(value: ListNodeVal<T>): LinkedList<T>;
  insertFirst(value: ListNodeVal<T>): LinkedList<T>;
  deleteFirst(): ListNodeLink<T>;
  deleteLast(): ListNodeLink<T>;
  find(key: T): ListNodeLink<T>;

  [Symbol.iterator](): Iterator<T>;
  // deleteElement():;
}

export interface LinkedListNode<T> {
  value: T | undefined;
  next: ListNodeLink<T>;
  prev?: ListNodeLink<T>;
}

export type ListNodeVal<T> = T | T[] | undefined;

export type ListNodeLink<T> = undefined | null | LinkedListNode<T>;
