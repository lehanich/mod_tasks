/* eslint-disable no-console */
import {describe, expect, test, it} from '@jest/globals';
import addTask, { Scheduler,
  Strategy,
  PriorityQ,
  Task,
  TaskIter,
  TaskPromise } from "../index";

describe("Generator forEach", function () {
    let total: number = 0;
    let date1: number, date2: number, date3: number;

    Scheduler.init({
      timeout: 10,
      delay: 100,
      concurent: 3
    }).queue(new Strategy(new PriorityQ(100)));

    // let total=0;
    const task1 = addTask(
      new Task(
        {
          priority: 'low',
          iterable: new Array(1000),
          task: () => { 
            console.log("start foreach")

            // for(let i=0; i<10;i++){
              console.log(1, total++)
              // setTimeout(() => console.log(i++), 1000)
            // }
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
          console.log("start foreach")

          // for(let i=0; i<10;i++){
            console.log(2, total++)
            // setTimeout(() => console.log(i++), 1000)
          // }
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
          console.log("start foreach")

          // for(let i=0; i<10;i++){
            console.log(3, total++)
            // setTimeout(() => console.log(i++), 1000)
          // }
        }
      }, new TaskIter())
    );

    task3.then((result) => {
      date3 = new Date().getTime();
    });

    // forEach(new Array(1000), () => {//new Array(10)
    //   total++;
    // }, { priority: "low" })
    // .then(() => {
    //   date1 = new Date().getTime();
    // })
    // .then(() => {
    //   // expect(total === 3000 && date3 < date2 && date2 < date1)
    // })
    // .catch((err) => {
    // });

    // forEach(new Array(1000), () => {
    //   total++;
    // }, { priority: "normal" })
    // .then(() => {
    //   date2 = new Date().getTime();
    // })
    // .catch((err) => {
    // });

    // forEach(new Array(1000), () => {
    //   total++;
    // }, { priority: "height" })
    // .then(() => {
    //   date3 = new Date().getTime();
    // })
    // .catch((err) => {
    // });

  it("Function forEach goes throue huge iterable object without freeze ", () => {

    expect(total === 3000)
  });

  it("1st forEach has low priority, 2nd - normal, 3d - height. 3d ends earlier then others ", () => {

    expect(date3 < date2 && date2 < date1)
  });

});
