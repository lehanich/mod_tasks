/* eslint-disable no-console */
import {describe, expect, test, it} from '@jest/globals';
import addTask, { Scheduler,
  Strategy,
  PriorityQ,
  Task,
  TaskIter,
  TaskPromise } from "../index";

describe("addTask TaskIter", function () {
    let total: number = 0;
    let date1: number, date2: number, date3: number;

    Scheduler.init({
      timeout: 10,
      delay: 100,
      concurent: 3
    }).queue(new Strategy(new PriorityQ(100)));

    const task1 = addTask(
      new Task(
        {
          priority: 'low',
          iterable: new Array(1000),
          task: () => {
            total++
          }
        },
        new TaskIter()
      )
    );

    task1.then((result) => {
      date1 = new Date().getTime();
    });

    const task2 = addTask(
      new Task({
        priority: 'normal',
        iterable: new Array(10),
        task: () => {
          total++
        }
      },  new TaskIter())
    );

    task2.then((result) => {
      date2 = new Date().getTime();
    });

    const task3 = addTask(
      new Task({
        priority: 'height',
        iterable: new Array(10),
        task: () => {
          total++
        }
      }, new TaskIter())
    );

    task3.then((result) => {
      date3 = new Date().getTime();
    });

  it("Function addTask goes throue huge iterable object without freeze ", () => {
    expect(total === 3000)
  });

  it("1st addTask has low priority, 2nd - normal, 3d - height. 3d ends earlier then others ", () => {
    expect(date3 < date2 && date2 < date1)
  });

});

describe("addTask TaskPromise", function () {
  let total: number = 0;
  let date1: number, date2: number, date3: number;

  Scheduler.init({
    timeout: 10,
    delay: 100,
    concurent: 3
  }).queue(new Strategy(new PriorityQ(100)));

  const task1 = addTask(
    new Task(
      {
        priority: 'low',
        task: () => {
          total++
        }
      },
      new TaskPromise()
    )
  );

  task1.then((result) => {
    date1 = new Date().getTime();
  });

  const task2 = addTask(
    new Task({
      priority: 'normal',
      task: () => {
        total++
      }
    },  new TaskPromise())
  );

  task2.then((result) => {
    date2 = new Date().getTime();
  });

  const task3 = addTask(
    new Task({
      priority: 'height',
      task: () => {
        total++
      }
    }, new TaskPromise())
  );

  task3.then((result) => {
    date3 = new Date().getTime();
  });

  it("Function addTask starts 3 times ", () => {
    expect(total === 3)
  });

  it("1st addTask has low priority, 2nd - normal, 3d - height. 3d ends earlier then others ", () => {
    expect(date3 < date2 && date2 < date1)
  });

});

describe("addTask error", function () {
  let total: number = 0;
  let date1: number, date2: number, date3: number;

  Scheduler.init({
    timeout: 10,
    delay: 100,
    concurent: 3
  }).queue(new Strategy(new PriorityQ(100)));

  const task1 = addTask(
    new Task(
      {
        priority: 'low',
        iterable: new Array(1000),
        task: () => {
          total++
        }
      },
      new TaskIter()
    )
  );

  task1.then(() => {
    date1 = new Date().getTime();
  });

  const t = () => {
    const task2 = addTask(
      new Task({
        priority: 'normal',
        iterable: new Array(10),
        task: () => {
          total++
        }
      },  new TaskPromise())
    );

    task2.then(() => {
      date2 = new Date().getTime();
    });
  }

  it("One Schedule can`t work with TaskPromise and TaskIter", () => {
    expect(t).toThrow(Error);
  });


});