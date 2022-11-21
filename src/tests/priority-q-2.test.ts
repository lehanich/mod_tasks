import {describe, expect, it} from '@jest/globals';
import PriorityQ2 from "../queue/priority-q-2";

describe("Priority Queue 2!!", function () {
  it("Create", () => {
    let PriorityQ = new PriorityQ2(100);

    expect(PriorityQ.length === 0);
  });

  it("insert element with priority ", () => {
    let PriorityQ = new PriorityQ2(100);

    PriorityQ.insert(3, "height");
    PriorityQ.insert(2, "low")
    PriorityQ.insert(1, "normal")

    expect( PriorityQ.length === 3 && PriorityQ.peek(0)![1] === 3 &&
            PriorityQ.peek(1)![1] === 1 && PriorityQ.peek(2)![1] === 2);
  });

  it("Remove by value", () => {
    let PriorityQ = new PriorityQ2(100);

    PriorityQ.insert(3, "height");
    PriorityQ.insert(2, "low")
    PriorityQ.insert(1, "normal")

    PriorityQ.remove(3);

    expect( PriorityQ.length === 2 && PriorityQ.peek(0)![1] === 1);
  });

  it("Push at the end of queue", () => {
    let PriorityQ = new PriorityQ2(100);

    PriorityQ.push(["height", 3]);
    PriorityQ.push(["low", 2]);
    PriorityQ.push(["normal", 1]);

    expect( PriorityQ.length === 3 && PriorityQ.peek(0)![1] === 3
      && PriorityQ.peek(1)![1] === 2 && PriorityQ.peek(2)![1] === 1);
  });

  it("Pop first element from queue", () => {
    let PriorityQ = new PriorityQ2(100);

    PriorityQ.push(["height", 3]);
    PriorityQ.push(["low", 2]);
    PriorityQ.push(["normal", 1]);

    let pop = PriorityQ.pop();

    expect( (pop === undefined || pop[1] === 3) &&
    PriorityQ.peek(0)![1] === 2);
  });

  it("Pop all elements from queue", () => {
    let PriorityQ = new PriorityQ2(100);

    PriorityQ.push(["height", 3]);
    PriorityQ.push(["low", 2]);
    PriorityQ.push(["normal", 1]);

    let pop1 = PriorityQ.pop();
    let pop2 = PriorityQ.pop();
    let pop3 = PriorityQ.pop();

    expect( (pop1 === undefined || pop1[1] === 3) &&
            (pop2 === undefined || pop2[1] === 1) &&
            (pop3 === undefined || pop3[1] === 2) );
  });
});
