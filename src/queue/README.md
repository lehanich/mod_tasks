# Очереди 
## PriorityQ - простейщая прироритетная очередь.

Планировщик помещает таски в очередь с приоритетами low, normal, height. При каждой вставке проверяется приоритет новой задачи. low втсавляется в конец очереди, normal - в середину, height - в начало.

## StandartQ - массив задач без приоритетов

## Использовате

При инициализации планировщика необходимо указать в какой очереди будут размещаться задачи с помощью конструкцтт new Strategy(new PriorityQ(100)). 100 - размер очереди

```js
Scheduler.init({
  timeout: 10,
  delay: 100,
  concurent: 2
}).queue(new Strategy(new PriorityQ(100)));
```

## Расширение

Возможно создать свою реализацию очереди (вместо PriorityQ и StandartQ). Она должна реализовывать интерфейс StrategyAdapter. 

### insert(value: any, priority: Priority): void;

метод вставки элемента в очередь

### remove(delWorker: Worker): void;

метод удаления элемента из очереди

### peek(index: number): WorkerContainer;

метод получения элемента по номеру элемента

### get length(): number;

получить длину очереди

### get queue(): WorkerContainer[];

считать саму очередь
