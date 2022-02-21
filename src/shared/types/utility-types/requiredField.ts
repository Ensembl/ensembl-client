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

/*

The RequireField utility type can take an object with one or more optional fields
and generate a type in which some or all of these fields are required.

Examples of usage:

Given the following type (only the `c` field is mandatory):

```
type Foo = {
  a?: string;
  b?: number;
  c: boolean;
};
```

the following will generate a type in which both `a` and `c` fields are mandatory:

```
type FooWithRequiredA = RequireField<Foo, 'a'>;
```

whereas the following will generate a type for which all fields are mandatory:

```
type FooWithRequiredAB = RequireField<Foo, 'a' | 'b'>;
```

*/

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
