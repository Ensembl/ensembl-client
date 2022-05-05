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

import { of, switchMap, catchError } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

export const fetch = <T>(url: string) =>
  fromFetch(url).pipe(
    switchMap((response) => {
      if (response.ok) {
        // OK return data
        return response.json() as Promise<T>;
      } else {
        // Server is returning a status requiring the client to try something else.
        return of({ error: true, message: `Error ${response.status}` });
      }
    }),
    catchError((err) => {
      // Network or other error, handle appropriately
      return of({ error: true, message: err.message });
    })
  );
