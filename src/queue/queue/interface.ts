
import {
  ListNodeVal,
  ListNodeLink
} from "./LinkedList/interface";

export interface Queue<T> {
  maxSize: number;
  length: number;
  head?: ListNodeLink<T>;
  rear?: ListNodeLink<T>;

  push(value: ListNodeVal<T>): void;
  pop(): ListNodeVal<T>;
}
