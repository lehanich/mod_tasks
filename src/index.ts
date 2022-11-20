import Scheduler from "./scheduler";
import addTask from "./addtask";
import {Strategy} from "./queue/strategy";
import StandartQ from "./queue/standart-q";
import PriorityQ from "./queue/priority-q";
import Task from "./tasks/task";
import TaskIter from "./tasks/task-iter";
import TaskPromise from "./tasks/task-promise";

export {
  Strategy,
  StandartQ,
  PriorityQ,
  TaskIter,
  TaskPromise,
  Task,
  Scheduler
};

export default addTask;
