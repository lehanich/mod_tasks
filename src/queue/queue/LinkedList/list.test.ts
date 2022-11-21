import {describe, expect, test} from '@jest/globals';
import LinkedList from "./LinkedList";

describe("LinkedList create", function () {

  it("should create empty linked list", () => {
    const linkedList = new LinkedList();
    expect(linkedList.first === null);
  });
});

describe("LinkedList functions", function () {
  const list = new LinkedList();

  list.add(1);
  list.add(2);
  list.add(3);

  it("LinkedList is iterable", () => {
    expect(typeof list[Symbol.iterator] === "function");
  });

  it("LinkedList first element has value", () => {
    expect(list.first?.value === 1);
  });

  it("LinkedList last not empty", () => {
    expect(list.last?.value === 3);
  });

  it("LinkedList first element has next link", () => {
    expect(list.first?.next?.value === 2);
  });

  it("LinkedList elements has prev link", () => {
    expect(list.first?.next?.prev !== null && list.first?.next?.prev !== undefined);
  });

  it("LinkedList delete() first", () => {
    const list = new LinkedList();

    list.add(1);
    list.add(2);
    list.add(3);
    list.delete(list.first);

    expect(list.first?.value === 2);
  })

  it("LinkedList delete() last", () => {
    const list = new LinkedList();

    list.add(1);
    list.add(2);
    list.add(3);
    list.delete(list.last);

    expect(list.last?.value === 2);
  })

  it("LinkedList delete() middle", () => {
    const list = new LinkedList();

    list.add(1);
    list.add(2);
    list.add(3);
    list.delete(list.first?.next);

    expect(list.first?.next?.value === 3 && list.last?.prev?.value === 1);
  })
});
