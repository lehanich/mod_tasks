
import {
  ListNodeVal,
  ListNodeLink
} from "./LinkedList/interface";

export interface Queue<T> {
  maxSize: number;
  length: number;
  first?: ListNodeLink<T>;
  last?: ListNodeLink<T>;

  push(value: ListNodeVal<T>): void;
  pop(): ListNodeVal<T>;
}
