# Библиотека для разбиения задач на потоки с приоритетом и отложенным выполнением

Библиотека, которая позволяет добавлять функции-задачи на выполнение с заданным приоритетом, библиотека включает планировщик выполнения этих задач.
Выполнение задач не вызывает фризов при любом их количество.


# Состав библиотеки
 планировщик Scheduler
 функция добавления задач addTask.

## Планировщик:

## Функция addTask:

### Scheduler - планировщик

Синглтон, который следит и запускает таски. Функция инициализации init на вход принимает объект с 
timeout - время выполнения очереди, delay - таймаут между очередями, concurent - количество параллельных задач (работает для Promise, для Iter не действовает)

### PriorityQ - простейщая прироритетная очередь.

Планировщик помещает таски в очередь на основании приоритета low, normal, height.

### Task (TaskManager)

управление конкретной задачей (запуск итерации (run), ожидание (waiting))

### addTask

addTask<T>(worker: TaskAdapter<T>) - функция для добавления задачи в очередь, и выполнения колбека, возвращает Promise.
worker - задача, реализующая интерфейс TaskAdapter

Для запуска задачи необходимо инициализировать задачу (worker) и выполнить метод start, который возвращает Promise

```js
const worker = new Task(
  {
    priority: 'height',
    iterable: new Array(10),
    task: () => { 
      console.log("start foreach")
      console.log(1, test++)
    }
  },
  new TaskIter()
);

worker.start(resolve, reject)
```

IterableObject - iterable объект
task - Функция, колбек. В задаче Promise выполняется один раз. В задаче Iterable выполняется на каждом новом элементе Iterable объекта
priority - приоритет выполнения задачи low, normal, height

## Описание

## Для задач Iter

Таймаут между итерациями рассчитывает Scheduler на основании приоритетов. По формуле (timeout / длина_очереди) * time%

time% - 50% для height, 30% для normal, 20% для low

После каждого прохода приоритетной очереди, планировщик ждет delay мс

## Для задач Promise

Все задачи помещаются в очередь в соостветствии с приоритетом. Планщировщик белет из очереди количество задач равное параметру concurent. Они выполняются в Promise.all()

## Инициализация планировщика. 

```js
import { Scheduler,
  Strategy,
  PriorityQ } from "./index";

Scheduler.init({
  timeout: 10,
  delay: 100,
  concurent: 2
}).queue(new Strategy(new PriorityQ(100)));
```

## Пример запуска функции addTask для итерируемых объектов

```js
import addTask, { Scheduler,
  Strategy,
  PriorityQ,
  Task,
  TaskIter,
  TaskPromise } from "./index";

let test=0;
const task1 = addTask(
  new Task(
    {
      priority: 'height',
      iterable: new Array(10),
      task: () => { 
        console.log("start foreach")
        console.log(1, test++)
      }
    },
    new TaskIter()
  )
);

task1.then((result) => {
  console.log(2);
});
```

## Пример запуска функции addTask для функций

```js
import addTask, { Scheduler,
  Strategy,
  PriorityQ,
  Task,
  TaskIter,
  TaskPromise } from "./index";

let test=0;
const task1 = addTask(
  new Task(
    {
      priority: 'height',
      task: () => { 
        console.log("start foreach")
        console.log(1, test++)
      }
    },
    new TaskPromise()
  )
);

task1.then((result) => {
  console.log(2);
});
```

## Потмер запуска нескольких экземпляров функции

```js
import addTask, { Scheduler,
  Strategy,
  PriorityQ,
  Task,
  TaskIter,
  TaskPromise } from "./index";

Scheduler.init({
  timeout: 10,
  delay: 100,
  concurent: 2
}).queue(new Strategy(new PriorityQ(100)));

const task1 = addTask(
  new Task(
    {
      priority: 'height',
      iterable: new Array(10),
      task: () => { 
        console.log("start foreach")
        console.log(1, test++)
      }
    },
    new TaskIter()
  )
);

task1.then((result) => {
  console.log(2);
});

const task2 = addTask(
  new Task({
    priority: 'low',
    iterable: new Array(10),
    task: () => {
      console.log("start")
      console.log(2, test++)
    }
  },  new TaskIter())
);

task2.then((result) => {
  console.log(22);
});

```

# Расширение функционала:

# ToDo

Добавить Browser workers, node workers
