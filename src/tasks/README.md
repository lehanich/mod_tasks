# Задачи Tasks (TaskManager)

модуль выполнения задачи

Основной объект Task реализует интерфейс TaskAdapter. Конструктор принимает опции и конкретную реализацию TaskWorker (TaskIter или TaskPromise)

В качестве опций ожидается объект со следующими ключами 
  priority - "low" | "normal"  |"height",
  iterable - итерируемый объект (опционально),
  task - функция колбек;

## Реализации TaskWorker

### TaskIter

  реализует задачу обхода по итерируемому объекту

### TaskPromise

  реализует обертку колбека в Promise.

# Использование

Для запуска задачи необходимо инициализировать задачи и выполнить метод start, который возвращает Promise

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

worker.start(resolve, reject);
```


# Расширение

## Интерфейс TaskAdapter

содержит следующие методы

### start(resolve: Function, reject: Function): void;

запуск задачи

### setState(state: string): Promise<unknown>;

метод ставит задачу в режим выполнения "run" или паузу. Этот метод использует планировщик (Scheduler)

### deleteWorker(): void;

удаление себя из очереди задач. Используйте метод планировщика this.#sheduler!.deleteWorker(this); (см пример task-iter.ts)

### type: "Promise" | "Iter" | undefined;

свойство-флаг, указывающий на тип задачи. Допустимы значения "Promise" "Iter"

### get options(): TaskOptions<T>;

получить объект с опциями

### init(scheduler: Scheduler<T>, options: TaskOptions<T>): void;

инициализация задачи

### check(): unknown; // for debug

получить внутренние свойства для дебага
