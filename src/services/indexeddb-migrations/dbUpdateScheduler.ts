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

/**
 * The purpose of IndexedDBUpdateScheduler is to queue and run
 * asynchronous updates of IndexedDB (e.g. ones that require network requests).
 *
 * As Jake Archibald points out in the documentation for the idb library:
 * An IndexedDB transaction auto-closes if it doesn't have anything left do
 * once microtasks have been processed. Therefore, do not await other things
 * between the start and end of your transaction, otherwise
 * the transaction will close before you're done.
 */

export class IndexedDBUpdateScheduler {
  #queue: Array<() => Promise<unknown>> = [];

  addTask = (task: () => Promise<unknown>) => {
    this.#queue.push(task);
  };

  runTasks = async (params?: { onComplete?: () => void }) => {
    // if the queue contains tasks
    // run the tasks sequentially,
    // and run the onComplete function, if provided, when they finish
    if (!this.#queue.length) {
      return;
    }

    for (const task of this.#queue) {
      await task();
    }

    params?.onComplete?.();
  };
}
