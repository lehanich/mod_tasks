import {  StrategyAdapter,
          Priority,
          WorkerContainer } from "../interface";

export class Strategy<T> implements StrategyAdapter {

  #strategy: StrategyAdapter;

  constructor(strategy: StrategyAdapter) {
    this.#strategy = strategy;
  }

  insert(worker: any, priority: Priority): void {
    this.#strategy.insert(worker, priority);
  };

  remove(delWorker: Worker): void {
    this.#strategy.remove(delWorker);
  };

  peek(index: number): WorkerContainer {
    return this.#strategy.peek(index);
  };

  get length(): number {

    return this.#strategy.length;
  };

  get queue() {
    return this.#strategy.queue;
  }
}