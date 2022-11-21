import Scheduler from "./scheduler";
import addTask from "./addtask";
import {Strategy} from "./queue/strategy";
import StandartQ from "./queue/standart-q";
import PriorityQ from "./queue/priority-q";
import PriorityQ2 from "./queue/priority-q-2";
import Task from "./tasks/task";
import TaskIter from "./tasks/task-iter";
import TaskPromise from "./tasks/task-promise";

export {
  Strategy,
  StandartQ,
  PriorityQ,
  PriorityQ2,
  TaskIter,
  TaskPromise,
  Task,
  Scheduler
};

export default addTask;
