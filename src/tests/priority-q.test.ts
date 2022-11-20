import {describe, expect, it} from '@jest/globals';
import PriorityQ from "../queue/priority-q";

describe("Priority Queue", function () {
  it("Create", () => {
    let priorityQ = new PriorityQ(100);

    expect(priorityQ.length === 0);
  });

  it("insert element with priority ", () => {
    let priorityQ = new PriorityQ(100);

    priorityQ.insert(3, "height");
    priorityQ.insert(2, "low")
    priorityQ.insert(1, "normal")

    expect( priorityQ.length === 3 && priorityQ.peek(0)[1] === 3 &&
            priorityQ.peek(1)[1] === 1 && priorityQ.peek(2)[1] === 2);
  });

  it("Remove by value", () => {
    let priorityQ = new PriorityQ(100);

    priorityQ.insert(3, "height");
    priorityQ.insert(2, "low")
    priorityQ.insert(1, "normal")

    priorityQ.remove(3);

    expect( priorityQ.length === 2 && priorityQ.peek(0)[1] === 1);
  });
});
