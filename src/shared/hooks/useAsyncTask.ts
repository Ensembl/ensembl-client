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

import {
  of,
  from,
  race,
  tap,
  timer,
  map,
  mergeMap,
  combineLatest,
  startWith,
  catchError,
  shareReplay,
  distinctUntilChanged,
  type Observable
} from 'rxjs';

// TODO: write the actual hook
const useAsyncTask = () => {
  return {
    run: runAsyncVisualTask
  };
};

/**
 * This is a function for handling asynchronous tasks that are accompanied
 * by a change in the UI (e.g. a spinner) indicating that they are running.
 *
 * It is impossible to predict how long such a task may take — it may finish
 * almost immediately, or may take a long time. The purpose of the runAsyncVisualTask
 * function is to avoid unwelcome flickering on the screen caused by the loading indicator
 * quickly appearing and disappearing when the task is too quick to finish.
 *
 * Therefore, runAsyncVisualTask does the following:
 * - if the task finishes very quickly (faster than the interval set by the ignoreTime option),
 *   then do not bother displaying the loading indicator
 * - if the task takes longer than the ignoreTime period to complete, register
 *   the loading state, and maintain it for at least the interval defined by the minimumRunningTime
 *   option
 * - if the task finishes after the ignoreTime interval, but before the minimumRunningTime interval,
 *   keep the loading state until the minimumRunningTime interval expires
 *
 * The implementation was inspired by https://stackblitz.com/edit/rxjs-spinner-flickering?file=index.ts
 */

export const runAsyncVisualTask = <T>(params: {
  task: Promise<T> | Observable<T>; // using observable option for testability
  ignoreTime?: number;
  minimumRunningTime?: number;
  onComplete?: (arg: T) => unknown;
  onError?: (arg: unknown) => unknown;
}) => {
  const { ignoreTime = 100, minimumRunningTime = 1000 } = params;

  const promise$ = from(params.task).pipe(
    shareReplay(1), // make sure that task doesn't need to run from the start when it connects to withRegisteredTask
    tap((result) => {
      params.onComplete?.(result);
    }),
    map((result) => ({
      status: 'success',
      result
    })),
    catchError((error) => {
      params.onError?.(error);

      return of({
        status: 'error',
        error
      });
    })
  );

  const ignoreTimer$ = timer(ignoreTime).pipe(map(() => 'registered'));
  const minimumRunningTimer$ = timer(minimumRunningTime).pipe(startWith(null));

  const withRegisteredTask = (task: typeof promise$) => {
    return combineLatest([
      minimumRunningTimer$,
      task.pipe(startWith({ status: 'loading', result: null }))
    ]).pipe(
      map(([time, result]) => {
        if (time === null) {
          return { status: 'loading', result: null };
        } else {
          return result;
        }
      }),
      distinctUntilChanged((prev, curr) => {
        return prev.status === curr.status;
      })
    );
  };

  return race(promise$, ignoreTimer$).pipe(
    mergeMap((winner) => {
      if (typeof winner === 'string') {
        // Meaning that the ignoreTimer$ stream has completed,
        // and that we should register the task
        return withRegisteredTask(promise$);
      } else {
        // The task completed before the ignoreTimer$ stream
        // No need to report it to the user
        return of(winner);
      }
    })
  );
};

export default useAsyncTask;
