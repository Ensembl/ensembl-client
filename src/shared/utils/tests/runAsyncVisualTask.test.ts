/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { timer, map, mergeMap, throwError } from 'rxjs';

import runAsyncVisualTask from '../runAsyncVisualTask';

jest.useFakeTimers();

// The tests below are using an observable for a mock task,
// because observables, as opposed to promises, run synchronously when their timers are mocked

describe('runAsyncVisualTask', () => {
  const ignoreInterval = 100;
  const minimumRunningTime = 500;
  const result = 42; // obviously

  it('allows a quick task to finish without registering the loading state', () => {
    const taskDuration = 90; // less than ignoreInterval
    const testTask = timer(taskDuration).pipe(map(() => result));

    const subscriber = jest.fn();
    const onComplete = jest.fn();

    runAsyncVisualTask({
      task: testTask,
      ignoreTime: ignoreInterval,
      minimumRunningTime
    }).subscribe({
      next: subscriber,
      complete: onComplete
    });

    jest.advanceTimersByTime(1000);

    expect(subscriber).toHaveBeenCalledTimes(1); // only one value comes out of the observable
    expect(subscriber.mock.calls.at(-1)[0]).toEqual({
      status: 'success',
      result
    });
    expect(onComplete).toHaveBeenCalled(); // just making sure that the stream completes after the task is finished
  });

  it('maintains the loading state if task completes too soon', () => {
    const taskDuration = 110; // a bit more than ignoreInterval, but less than ignoreInterval + minimumRunningTime
    const testTask = timer(taskDuration).pipe(map(() => result));

    const subscriber = jest.fn();

    runAsyncVisualTask({
      task: testTask,
      ignoreTime: ignoreInterval,
      minimumRunningTime
    }).subscribe(subscriber);

    jest.advanceTimersByTime(taskDuration);

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber.mock.calls.at(-1)[0]).toEqual({
      status: 'loading',
      result: null
    });

    jest.advanceTimersByTime(minimumRunningTime);

    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber.mock.calls.at(-1)[0]).toEqual({
      status: 'success',
      result
    });
  });

  it('runs a slow task to completion', () => {
    const taskDuration = 2000; // more than ignoreInterval + minimumRunningTime
    const testTask = timer(taskDuration).pipe(map(() => result));

    const subscriber = jest.fn();

    runAsyncVisualTask({
      task: testTask,
      ignoreTime: ignoreInterval,
      minimumRunningTime
    }).subscribe(subscriber);

    jest.advanceTimersByTime(taskDuration - 10);

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber.mock.calls.at(-1)[0]).toEqual({
      status: 'loading',
      result: null
    });

    jest.runAllTimers();

    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber.mock.calls.at(-1)[0]).toEqual({
      status: 'success',
      result
    });
  });

  it('calls onSuccess callback if the task succeeds', () => {
    const taskDuration = 2000;
    const testTask = timer(taskDuration).pipe(map(() => result));

    const successHandler = jest.fn();
    const errorHandler = jest.fn();

    runAsyncVisualTask({
      task: testTask,
      ignoreTime: ignoreInterval,
      minimumRunningTime,
      onComplete: successHandler,
      onError: errorHandler
    }).subscribe(jest.fn());

    jest.runAllTimers();

    expect(successHandler.mock.calls.at(-1)[0]).toEqual(result);
    expect(errorHandler).not.toHaveBeenCalled();
  });

  it('calls onError callback if the task fails', () => {
    const taskDuration = 2000;
    const error = new Error('oops');
    const testTask = timer(taskDuration).pipe(
      mergeMap(() => throwError(error))
    );

    const successHandler = jest.fn();
    const errorHandler = jest.fn();

    runAsyncVisualTask({
      task: testTask,
      ignoreTime: ignoreInterval,
      minimumRunningTime,
      onComplete: successHandler,
      onError: errorHandler
    }).subscribe(jest.fn());

    jest.runAllTimers();

    expect(errorHandler.mock.calls.at(-1)[0]).toEqual(error);
    expect(successHandler).not.toHaveBeenCalled();
  });
});
