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

import { of, from, timer, combineLatest, firstValueFrom } from 'rxjs';
import { take, catchError } from 'rxjs/operators';

const noEarlierThan = async <P extends Promise<any>>(
  promise: P,
  minimumTime: number
) => {
  const source$ = combineLatest([
    timer(minimumTime).pipe(take(1)),
    from(promise).pipe(catchError((error) => of(error)))
  ]);

  const [, result] = await firstValueFrom(source$);
  if (result instanceof Error) {
    throw result;
  } else {
    return result;
  }
};

export default noEarlierThan;
